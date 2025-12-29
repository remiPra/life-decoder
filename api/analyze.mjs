// 🔒 VERCEL SERVERLESS FUNCTION
// Cette fonction protège ta clé API côté serveur
// Elle ne sera JAMAIS exposée au navigateur

export default async function handler(req, res) {
  // Sécurité : Accepter seulement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Récupérer la    clé API depuis les variables d'environnement SERVEUR
  const apiKey = process.env.OPENROUTER_API_KEY;
  const wantsStream = (req.query && req.query.stream === '1') || (req.headers.accept || '').includes('text/event-stream');

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const body = {
      // model: 'anthropic/claude-opus-4.5',
      model: "openai/gpt-5.1",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    };

    if (wantsStream) {
      body.stream = true;
    }

    // Appeler OpenRouter depuis le SERVEUR (pas le navigateur)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://life-decoder.vercel.app',
        'X-Title': 'Life Decoder'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: errorData });
    }

    if (wantsStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');

      if (!response.body) {
        return res.status(500).json({ error: 'Stream body missing' });
      }

      for await (const chunk of response.body) {
        res.write(chunk);
      }
      res.end();
      return;
    }

    const data = await response.json();

    // Renvoyer la réponse au Frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
