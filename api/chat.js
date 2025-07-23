export default async function handler(req, res) {
    const { message } = req.body;
  
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OpenAI API Key' });
    }
  
    try {
      const completion = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        }),
      });
  
      const data = await completion.json();
      return res.status(200).json({ response: data.choices[0]?.message?.content || "No response." });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  