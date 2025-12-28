export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not found in environment');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { systemPrompt, prompt } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://life-decoder.vercel.app',
        'X-Title': 'Life Decoder Mystical'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-opus-4.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'OpenRouter API error',
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in analyze-mystical:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
