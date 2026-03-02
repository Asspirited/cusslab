// Cloudflare Worker — proxies requests to OpenAI API
// Deploy: wrangler deploy
// Set secret: wrangler secret put OPENAI_API_KEY
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key configured on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    // Translate Anthropic request format to OpenAI format
    const anthropicBody = await request.json();
    const openaiBody = {
      model: 'gpt-4o',
      max_tokens: anthropicBody.max_tokens || 1000,
      messages: anthropicBody.messages,
      ...(anthropicBody.system && {
        messages: [
          { role: 'system', content: anthropicBody.system },
          ...anthropicBody.messages,
        ],
      }),
    };
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openaiBody),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'OpenAI error', openai: data }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    // Translate OpenAI response format back to Anthropic format
    const translated = {
      content: [
        {
          type: 'text',
          text: data.choices?.[0]?.message?.content || '',
        },
      ],
      model: data.model,
      usage: data.usage,
    };
    return new Response(JSON.stringify(translated), {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
