export interface StreamOptions {
  onChunk?: (text: string) => void;
}

// Basic SSE parser for OpenAI/OpenRouter-style streaming responses
export async function streamCompletion(
  endpoint: string,
  payload: Record<string, any>,
  options: StreamOptions = {}
): Promise<string> {
  const response = await fetch(`${endpoint}?stream=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  if (!response.body) {
    throw new Error('No response body to stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let full = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') {
        return full;
      }

      try {
        const json = JSON.parse(data);
        const delta = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? '';
        if (delta) {
          full += delta;
          options.onChunk?.(delta);
        }
      } catch (err) {
        console.error('Stream parse error', err, data);
      }
    }
  }

  // Process any remaining buffer content
  const trimmed = buffer.trim();
  if (trimmed.startsWith('data:')) {
    const data = trimmed.slice(5).trim();
    if (data !== '[DONE]') {
      try {
        const json = JSON.parse(data);
        const delta = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? '';
        if (delta) {
          full += delta;
          options.onChunk?.(delta);
        }
      } catch (err) {
        console.error('Stream parse error (tail)', err, data);
      }
    }
  }

  return full;
}
