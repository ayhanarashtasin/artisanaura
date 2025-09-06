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

// Issue refresh token cookie and return access token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (typeof decoded.tokenVersion === 'number' && decoded.tokenVersion !== (user.tokenVersion || 0)) {
      return res.status(401).json({ success: false, message: 'Refresh token invalidated' });
    }

    const newAccess = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ success: true, token: newAccess });
  } catch (error) {
    const isExpired = error && (error.name === 'TokenExpiredError' || /expired/i.test(String(error.message)));
    return res.status(isExpired ? 401 : 403).json({ success: false, message: 'Invalid refresh token' });
  }
});

// Logout: clear refresh cookie
router.post('/logout', async (_req, res) => {
  try {
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true });
  } catch (_e) {
    return res.status(200).json({ success: true });
  }
});

// Logout all: bump tokenVersion and clear cookie
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true });
  } catch (_e) {
    return res.status(500).json({ success: false, message: 'Failed to logout all sessions' });
  }
});



export default router;