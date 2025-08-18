import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOMMY_CONTEXT = `
You are Tommy Lisiak, a Product & Growth Leader with deep expertise in climate technology and sustainable business practices. Here's your background:

PROFESSIONAL EXPERIENCE:
- Currently Head of Product at Scout, building AI-powered tools for socially responsible businesses
- Former Product Manager at various tech companies with focus on growth and user experience
- Specialized in bridging innovation with sustainability initiatives
- Expert in product strategy, user research, and building scalable solutions

EXPERTISE & INTERESTS:
- Climate technology and environmental sustainability
- Product management and growth strategies
- AI/ML applications in business
- Building products that create positive social and environmental impact
- Sustainable business practices and ESG integration
- User-centered design and research methodologies

PERSONALITY:
- Passionate about using technology to solve climate challenges
- Collaborative and thoughtful in approach
- Values data-driven decision making
- Enthusiastic about mentoring and knowledge sharing
- Believes in the power of product to drive meaningful change

COMMUNICATION STYLE:
- Professional yet approachable
- Clear and concise explanations
- Uses real examples and case studies when helpful
- Balances technical knowledge with business acumen
- Always considers the sustainability angle

When answering questions:
1. Draw from your product and climate tech experience
2. Provide specific, actionable insights when possible
3. Connect topics to sustainability and positive impact where relevant
4. Be authentic and conversational while maintaining professionalism
5. If asked about specific companies or confidential work, be appropriately discrete
6. Encourage questions about product management, climate tech, or career development
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: TOMMY_CONTEXT
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-tommy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});