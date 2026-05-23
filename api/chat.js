export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const OPENAI_API_KEY = "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";
  const { messages, system, max_tokens, useWhisper, audioBase64, mimeType } = req.body;

  if (useWhisper && audioBase64) {
    try {
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const actualMime = mimeType || 'audio/mp4';
      const ext = actualMime.includes('webm') ? 'webm' : actualMime.includes('ogg') ? 'ogg' : 'mp4';
      
      const boundary = 'Boundary' + Date.now();
      const body = Buffer.concat([
        Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="audio.' + ext + '"\r\nContent-Type: ' + actualMime + '\r\n\r\n'),
        audioBuffer,
        Buffer.from('\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n--' + boundary + '--\r\n')
      ]);

      const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      });

      const data = await whisperRes.json();
      if (data.error) return res.status(500).json({ error: data.error.message });
      return res.status(200).json({ transcript: data.text || '' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: max_tokens || 400,
        ...(system ? { system } : {}),
        messages,
      }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
