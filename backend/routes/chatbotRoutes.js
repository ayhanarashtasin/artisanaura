import express from 'express';
import fetch from 'node-fetch'; // You'll need to install this: npm install node-fetch

const router = express.Router();

// This endpoint will handle the chat messages
// POST /api/chatbot/chat
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    // Guardrail prompt to keep answers concise and clean
    const systemPrompt = [
      "You are ArtisanAura Assistant, a concise shopping helper for an e‑commerce site.",
      "Style rules:",
      "- Keep answers short and tidy. Default to max 3 sentences, or up to 3 bullet points.",
      "- No headings, no numbered 'options', no blockquotes, no code fences.",
      "- For product descriptions: output ONE concise paragraph (1–3 sentences) with material, key features and use cases. No bracketed placeholders.",
      "- If asked for multiple variants, return at most 3 simple bullets.",
      "- Friendly and helpful, not overly salesy."
    ].join("\n");

    // Format the conversation history for the AI model
    const chatHistory = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const payload = {
      contents: chatHistory,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 256,
        topP: 0.9,
        topK: 40
      }
    };
    const apiKey = process.env.GEMINI_API_KEY; // IMPORTANT: Add your API key to the .env file
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    // Use v1 (stable). v1beta also works for these models, but v1 is recommended.
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`API call failed with status: ${apiResponse.status}, body: ${errorBody}`);
    }

    const result = await apiResponse.json();

    // Helper to lightly clean up verbose/markdowny outputs
    const formatReply = (text) => {
      if (!text) return "I'm not sure how to respond to that.";
      let t = String(text)
        .replace(/^>\s?/gm, '') // strip blockquotes
        .replace(/^#+\s*/gm, '') // strip headings
        .replace(/```[\s\S]*?```/g, '') // strip code fences
        .replace(/\*\*([^*]+)\*\*/g, '$1') // strip bold
        .replace(/\n{3,}/g, '\n\n') // collapse extra newlines
        .trim();
      // Hard cap length to keep it tidy
      const maxLen = 700;
      if (t.length > maxLen) {
        const cut = t.slice(0, maxLen);
        const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'));
        t = cut.slice(0, lastStop > 50 ? lastStop + 1 : maxLen) + '';
      }
      return t;
    };

    // Check for a valid response from the AI
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
      const raw = result.candidates[0].content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
      const cleaned = formatReply(raw);
      res.status(200).json({ reply: cleaned });
    } else {
      res.status(200).json({ reply: "I'm not sure how to respond to that. Can you try asking another way?" });
    }

  } catch (error) {
    console.error('Error with AI Chatbot:', error);
    res.status(500).json({ message: 'Failed to get a response from the AI assistant.' });
  }
});

export default router;
