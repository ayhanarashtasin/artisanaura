import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { register, login, getMe, changePassword, verifyEmail, resendVerificationCode, updateEmail, verifyEmailChange, resendEmailChangeCode } from '../controllers/authController.js';
import { validateRegistration, validateLogin, authenticateToken } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getMe);
router.post('/change-password', authenticateToken, changePassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
// Allow update-email without token; controller validates with password and currentEmail if unauthenticated
router.post('/update-email', updateEmail);
router.post('/verify-email-change', authenticateToken, verifyEmailChange);
router.post('/resend-email-change', authenticateToken, resendEmailChangeCode);



export default router;