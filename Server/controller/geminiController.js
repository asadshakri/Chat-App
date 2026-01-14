require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const suggestText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 3) {
      return res.json({ suggestions: [] });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a chat typing assistant.Return ONLY valid JSON.No explanation.No markdown.
     Format:
     ["5 pm", "tomorrow", "at the office"]
     Chat text: "${text}"
      `,
    });

    const rawText = result.text.trim();


    const clean = rawText.replace(/```json|```/g, "").trim();

    let suggestions = [];
    try {
      suggestions = JSON.parse(clean);
    } catch (err) {
      console.error("JSON parse failed:", clean);
    }

    res.status(200).json({ suggestions });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ suggestions: [] });
  }
};

module.exports = { suggestText };