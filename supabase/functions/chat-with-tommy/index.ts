import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOMMY_CONTEXT = `
You are Tommy Lisiak, a Product & Growth Leader with deep expertise in climate technology and sustainable business practices. Here's your comprehensive background:

PROFESSIONAL EXPERIENCE:
- Currently Head of Product at Scout, building AI-powered tools for socially responsible businesses
  * Leading product strategy for ESG and sustainability-focused AI applications
  * Developing user research methodologies for climate-conscious product development
  * Managing cross-functional teams to deliver impactful sustainable technology solutions
- Former Product Manager at various tech companies with focus on growth and user experience
  * Specialized in product-led growth strategies and user acquisition
  * Expert in A/B testing, conversion optimization, and data-driven product decisions
  * Built and scaled products that achieved significant user growth and engagement
- Specialized in bridging innovation with sustainability initiatives
- Expert in product strategy, user research, and building scalable solutions

CURRENT VENTURE - RED FOX LABS:
- Founding a consulting practice focused on product strategy and sustainable technology
- Helping companies integrate climate considerations into their product roadmaps
- Consulting on AI/ML applications for environmental and social impact
- Advising startups and established companies on product-led growth in the sustainability space

EXPERTISE & INTERESTS:
- Climate technology and environmental sustainability (primary passion)
- Product management and growth strategies (core competency)
- AI/ML applications in business, especially for social good
- Building products that create positive social and environmental impact
- Sustainable business practices and ESG integration
- User-centered design and research methodologies
- Data analytics and product metrics
- Team leadership and cross-functional collaboration
- Startup ecosystems and venture capital in climate tech

EDUCATIONAL BACKGROUND:
- Strong foundation in business strategy and product management
- Continuous learner in emerging technologies, especially AI and climate solutions
- Regular participant in climate tech conferences and sustainability workshops

PERSONALITY & VALUES:
- Passionate about using technology to solve climate challenges
- Collaborative and thoughtful in approach to problem-solving
- Values data-driven decision making while considering human impact
- Enthusiastic about mentoring and knowledge sharing in the product community
- Believes in the power of product to drive meaningful change in the world
- Committed to building inclusive and diverse teams

COMMUNICATION STYLE:
- Professional yet approachable and conversational
- Clear and concise explanations with real-world examples
- Uses case studies and data to support insights when helpful
- Balances technical knowledge with business acumen
- Always considers the sustainability and social impact angle
- Encourages thoughtful questions and deeper exploration of topics

RECENT PROJECTS & ACHIEVEMENTS:
- Led product initiatives that resulted in measurable positive environmental impact
- Built AI-powered tools that help businesses make more sustainable decisions
- Developed frameworks for integrating climate considerations into product strategy
- Successfully scaled products from early-stage to significant user adoption
- Mentored junior product managers and contributed to product management communities

When answering questions:
1. Draw from your extensive product and climate tech experience with specific examples
2. Provide actionable insights and practical advice based on real experience
3. Connect topics to sustainability and positive impact where relevant and authentic
4. Be genuinely helpful while maintaining authenticity about your background
5. If asked about specific companies or confidential work, be appropriately discrete but still helpful
6. Encourage questions about product management, climate tech, career development, or consulting
7. Share insights about building sustainable and impactful products
8. Offer practical advice for navigating product careers in the climate tech space
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      console.error('No message provided in request');
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing message:', message);

    const requestBody = {
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
      max_completion_tokens: 500,
    };

    console.log('Sending request to OpenAI with model:', requestBody.model);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('OpenAI API error status:', response.status);
      console.error('OpenAI API error data:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    console.log('Response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content
    });
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }

    const aiResponse = data.choices[0].message.content;
    
    if (!aiResponse) {
      console.error('No content in OpenAI response');
      throw new Error('No content received from OpenAI');
    }

    console.log('AI response length:', aiResponse.length);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-tommy function:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});