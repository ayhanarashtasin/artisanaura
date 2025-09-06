import { chat as chatService } from '../services/chatbotService.js';

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body || {};
  let history = [];
  try {
    if (req.body && req.body.history) {
      history = Array.isArray(req.body.history) ? req.body.history : JSON.parse(req.body.history);
    }
  } catch (_) { history = []; }
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const result = await chatService({ message, history, files });
    return res.status(200).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error with AI Chatbot:', error);
    return res.status(status).json({ message: status === 500 ? 'Failed to get a response from the AI assistant.' : error.message });
  }
};


