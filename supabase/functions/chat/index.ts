import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VECTOR_STORE_ID = "vs_6931e9c024a881919727cfa25da374bf";

const SYSTEM_PROMPT = `You ARE Tommy - respond as yourself in first person.

MANDATORY: For EVERY question about ANY of these topics, you MUST use file_search FIRST:
- Work history, jobs, companies, roles (e.g., "Where did you work?", "What was your role at X?")
- Skills, achievements, metrics, accomplishments
- Education, background, qualifications  
- Personal interests: soccer/football teams, hobbies, pets, favorite things
- Projects, products, launches
- Any specific names, dates, numbers, or facts about your life

PROCESS:
1. Receive question → 2. Use file_search tool → 3. Read results → 4. Respond based on findings

If file_search returns no results, say "I don't have that specific information in my records."

Response style:
- First person ("I", "my", "me")
- Concise (2-4 sentences), friendly, warm
- Include specific details/metrics from documents
- Be authentic - this is YOUR personal website`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Create an assistant with file_search tool and vector store
    const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        name: "Tommy's Site Assistant",
        instructions: SYSTEM_PROMPT,
        tools: [{ type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: [VECTOR_STORE_ID],
          },
        },
      }),
    });

    if (!assistantResponse.ok) {
      const error = await assistantResponse.text();
      console.error('❌ Assistant creation error:', error);
      throw new Error(`Failed to create assistant: ${error}`);
    }

    const assistant = await assistantResponse.json();
    console.log('🤖 Assistant created:', assistant.id);

    // Create a thread
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

    // Run the assistant with streaming and additional instructions
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistant.id,
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

    // Clean up assistant after response (fire and forget)
    const cleanupAssistant = async () => {
      try {
        await fetch(`https://api.openai.com/v1/assistants/${assistant.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });
        console.log('🧹 Assistant cleaned up:', assistant.id);
      } catch (e) {
        console.error('❌ Failed to cleanup assistant:', e);
      }
    };

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
              cleanupAssistant();
              continue;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              // Comprehensive event logging
              console.log(`📡 Event: ${parsed.object}`, parsed.status ? `Status: ${parsed.status}` : '');
              
              // Log run creation
              if (parsed.object === 'thread.run.created') {
                console.log('🚀 Run created:', parsed.id);
              }
              
              // Log step creation with type
              if (parsed.object === 'thread.run.step.created') {
                console.log('📋 Step created:', parsed.step_details?.type);
              }
              
              // Log step completion with tool call details
              if (parsed.object === 'thread.run.step.completed') {
                console.log('✅ Step completed:', parsed.step_details?.type);
                if (parsed.step_details?.type === 'tool_calls') {
                  const toolCalls = parsed.step_details.tool_calls;
                  console.log('🔧 TOOL CALLS:', JSON.stringify(toolCalls, null, 2));
                  toolCalls?.forEach((call: any, index: number) => {
                    if (call.type === 'file_search') {
                      console.log(`🔍 FILE SEARCH #${index + 1} EXECUTED`);
                      if (call.file_search?.results) {
                        console.log(`📄 Search results count: ${call.file_search.results.length}`);
                      }
                    }
                  });
                }
              }
              
              // Log step delta for tool usage
              if (parsed.object === 'thread.run.step.delta') {
                console.log('🔄 Step delta:', JSON.stringify(parsed.delta?.step_details));
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
                cleanupAssistant();
              }
              
              // Handle errors
              if (parsed.object === 'thread.run' && parsed.status === 'failed') {
                console.error('❌ Run failed:', parsed.last_error);
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Assistant run failed' })}\n\n`));
                cleanupAssistant();
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
