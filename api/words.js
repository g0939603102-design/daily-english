export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { topic, level, count = 8 } = req.body;
    const topicMap = {
      daily:"日常生活", travel:"旅遊出行", work:"職場英文",
      social:"社交聊天", drama:"追劇口語", food:"飲食文化",
      health:"健康生活", shopping:"購物消費"
    };
    const levelMap = {
      beginner:"初學者（超基礎日常單字，簡單句子）",
      elementary:"初級（常用片語，日常對話）",
      intermediate:"中級（口語表達，較複雜句型）",
      advanced:"高級（地道用法，慣用語）"
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `你是英文老師，幫助台灣人學生活英文。
主題：${topicMap[topic] || topic}
程度：${levelMap[level] || level}
時間戳：${Date.now()}

生成${count}個不同的實用英文單字或片語（每次必須不同）。只回傳JSON：
{"words":[{"word":"","pronunciation":"","partOfSpeech":"","chineseMeaning":"","example1":"","example1Translation":"","example2":"","example2Translation":"","tip":""}]}`
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    res.status(200).json(JSON.parse(clean));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
