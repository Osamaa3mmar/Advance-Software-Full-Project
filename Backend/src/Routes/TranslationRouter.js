import axios from "axios";
import { Router } from "express";

const translationRouter = Router();

translationRouter.post("", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Properly encode the prompt for the URL - must include "json" in the prompt text
    const prompt = `Translate the given text "${message.content}" to Arabic. Respond in JSON format with the structure: { "translate": "<translation>" }`;
    const encodedPrompt = encodeURIComponent(prompt);

    const { data } = await axios.get(
      `https://text.pollinations.ai/${encodedPrompt}?json=true`
    );
    console.log("Translation response:", data);

    return res.status(200).json({ translation: data.translate || data });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Translation failed",
      error: error.response?.data || error.message,
    });
  }
});

export default translationRouter;
