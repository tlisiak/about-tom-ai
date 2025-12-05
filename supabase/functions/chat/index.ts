import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
};

// Persistent assistant ID - created once via OpenAI dashboard or API
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || '';

// Input validation constants
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 20;
const MAX_PAYLOAD_SIZE = 100000; // 100KB

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// In-memory rate limit store (resets on cold start, which is acceptable)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
const cleanupRateLimits = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Get client IP from request
const getClientIP = (req: Request): string => {
  // Check common headers for proxied requests
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  // Fallback - in edge functions, connection info isn't directly available
  return 'unknown';
};

// Check rate limit and return remaining requests
const checkRateLimit = (clientIP: string): { allowed: boolean; remaining: number; retryAfter?: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(clientIP);
  
  // Clean up old entries occasionally
  if (Math.random() < 0.1) cleanupRateLimits();
  
  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }
  
  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 60),
            'X-RateLimit-Remaining': '0',
          } 
        }
      );
    }

    // Check content length header for basic payload size limit
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Request payload too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    if (!ASSISTANT_ID) {
      throw new Error('OPENAI_ASSISTANT_ID is not configured');
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Validate message count
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum allowed: ${MAX_MESSAGES}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate individual message lengths
    for (const msg of messages) {
      if (typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid message format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Message too long. Maximum allowed: ${MAX_MESSAGE_LENGTH} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('🤖 Using persistent assistant:', ASSISTANT_ID, `(IP: ${clientIP}, remaining: ${rateLimit.remaining})`);

    // Create a thread with all messages
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!threadResponse.ok) {
      const error = await threadResponse.text();
      console.error('❌ Thread creation error:', error);
      throw new Error(`Failed to create thread: ${error}`);
    }

    const thread = await threadResponse.json();
    console.log('📝 Thread created:', thread.id);

    // Run the persistent assistant with streaming
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        stream: true,
        additional_instructions: "IMPORTANT: You MUST use the file_search tool to answer this question. Search your documents first before responding. Do not guess or make up information.",
      }),
    });

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('❌ Run creation error:', error);
      throw new Error(`Failed to create run: ${error}`);
    }

    console.log('🚀 Run started with streaming');

    // Transform the stream to extract text deltas
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              continue;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              // Log key events
              if (parsed.object === 'thread.run.step.completed' && parsed.step_details?.type === 'tool_calls') {
                const toolCalls = parsed.step_details.tool_calls;
                toolCalls?.forEach((call: any, index: number) => {
                  if (call.type === 'file_search') {
                    console.log(`🔍 FILE SEARCH #${index + 1} EXECUTED`);
                  }
                });
              }
              
              // Handle text delta events
              if (parsed.object === 'thread.message.delta') {
                const delta = parsed.delta;
                if (delta?.content?.[0]?.text?.value) {
                  let content = delta.content[0].text.value;
                  // Remove file citation patterns like 【4:0†Profile.pdf】
                  content = content.replace(/【[^】]*】/g, '');
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                }
              }
              
              // Handle completion
              if (parsed.object === 'thread.run' && parsed.status === 'completed') {
                console.log('✅ Run completed successfully');
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              }
              
              // Handle errors
              if (parsed.object === 'thread.run' && parsed.status === 'failed') {
                console.error('❌ Run failed:', parsed.last_error);
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Assistant run failed' })}\n\n`));
              }
            } catch (e) {
              // Not JSON, skip
            }
          }
        }
      },
    });

    return new Response(runResponse.body?.pipeThrough(transformStream), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });

  } catch (error) {
    console.error('❌ Chat function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
