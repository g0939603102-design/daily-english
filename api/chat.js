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
      const actualMime = mimeType || 'audio/webm';
      const ext = actualMime.includes('mp4') ? 'mp4' : actualMime.includes('ogg') ? 'ogg' : 'webm';
      
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

      const rawText = await whisperRes.text();
      let data;
      try { data = JSON.parse(rawText); } catch(e) { data = { error: rawText }; }
      if (!whisperRes.ok || data.error) {
        return res.status(200).json({ transcript: '', error: JSON.stringify(data) });
      }
      return res.status(200).json({ transcript: data.text || '' });
    } catch (e) {
      return res.status(200).json({ transcript: '', error: e.message });
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
