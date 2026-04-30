export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { topic, level } = req.body;
    
    const topicMap = {
      daily:"日常生活", travel:"旅遊出行", work:"職場英文",
      social:"社交聊天", drama:"追劇口語", food:"飲食文化",
      health:"健康生活", shopping:"購物消費"
    };
    const levelMap = {
      beginner:"初學者（基本單字）", elementary:"初級（常用片語）",
      intermediate:"中級（口語表達）", advanced:"高級（地道用法）"
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `你是英文老師，幫助台灣人學生活英文。
主題：${topicMap[topic] || topic}
程度：${levelMap[level] || level}
日期：${new Date().toISOString().slice(0,10)}

生成5個今日單字，只回傳JSON，格式如下：
{"words":[{"word":"","pronunciation":"","partOfSpeech":"","chineseMeaning":"","example1":"","example1Translation":"","example2":"","example2Translation":"","tip":""}]}`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
