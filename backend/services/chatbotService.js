import fetch from 'node-fetch';

const buildPrompt = (history, message, files) => {
  const systemPrompt = [
    'You are ArtisanAura Assistant, a concise shopping helper for an e‑commerce site.',
    'Style rules:',
    '- Keep answers short and tidy. Default to max 3 sentences, or up to 3 bullet points.',
    '- No headings, no numbered options, no blockquotes, no code fences.',
    '- For product descriptions: output ONE concise paragraph (1–3 sentences).',
  ].join('\n');

  const chatHistory = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...history.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] })),
  ];
  const latestUserParts = [{ text: message }];
  for (const file of files) {
    if (!String(file.mimetype || '').startsWith('image/')) continue;
    const base64 = file.buffer.toString('base64');
    latestUserParts.push({ inlineData: { data: base64, mimeType: file.mimetype } });
  }
  chatHistory.push({ role: 'user', parts: latestUserParts });
  return chatHistory;
};

const formatReply = (text) => {
  if (!text) return "I'm not sure how to respond to that.";
  let t = String(text)
    .replace(/^>\s?/gm, '')
    .replace(/^#+\s*/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const maxLen = 700;
  if (t.length > maxLen) {
    const cut = t.slice(0, maxLen);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'));
    t = cut.slice(0, lastStop > 50 ? lastStop + 1 : maxLen) + '';
  }
  return t;
};

export const chat = async ({ message, history = [], files = [] }) => {
  if (!message) {
    const err = new Error('Message is required.');
    err.statusCode = 400;
    throw err;
  }
  const contents = buildPrompt(history, message, files);
  const payload = { contents, generationConfig: { temperature: 0.4, maxOutputTokens: 256, topP: 0.9, topK: 40 } };
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  const apiResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!apiResponse.ok) {
    const errorBody = await apiResponse.text();
    const err = new Error(`API call failed with status: ${apiResponse.status}, body: ${errorBody}`);
    err.statusCode = 500;
    throw err;
  }
  const result = await apiResponse.json();
  const raw = result.candidates && result.candidates.length > 0 && result.candidates[0].content ? (result.candidates[0].content?.parts?.[0]?.text || "I'm not sure how to respond to that.") : "I'm not sure how to respond to that. Can you try asking another way?";
  const cleaned = formatReply(raw);
  return { reply: cleaned };
};


