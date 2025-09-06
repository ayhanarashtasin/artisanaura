import express from 'express';
import { authenticateToken } from '../middleware/validation.js';
import { submitHelpRequest, listMyHelpRequests } from '../controllers/helpController.js';

const router = express.Router();

// Create a help request
router.post('/', authenticateToken, submitHelpRequest);

// List current user's help requests
router.get('/mine', authenticateToken, listMyHelpRequests);

export default router;


