export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { topic, level } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: `你是英文老師。主題：${topic}，程度：${level}。請生成5個單字，用JSON格式回傳，包含word, pronunciation, partOfSpeech, chineseMeaning, example1, example1Translation, example2, example2Translation, tip。只回傳JSON。格式：{"words":[...]}` }]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
  res.status(200).json(JSON.parse(clean));
}
