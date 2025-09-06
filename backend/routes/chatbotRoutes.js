import express from 'express';
import multer from 'multer';
import { chatWithAssistant } from '../controllers/chatbotController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
});

// This endpoint will handle the chat messages
// POST /api/chatbot/chat
router.post('/chat', upload.array('images', 3), chatWithAssistant);

export default router;
