import jwt from 'jsonwebtoken';
import {
    prepareRegistration,
    getUserProfile,
    loginUser,
    changePassword as changePasswordService,
    verifyRegistrationCode,
    resendRegistrationCode,
    updateEmail as updateEmailService,
    verifyEmailChangeCode,
    resendEmailChangeCode as resendEmailChangeCodeService,
} from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const { email, firstName, password, phone, division, district, upazila } = req.body;
        await prepareRegistration({ email, firstName, password, phone, division, district, upazila });
        res.status(201).json({ success: true, message: 'Verification code sent to your email. Complete verification to create your account.' });

    } catch (error) {
        console.error('Registration error:', error);
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Get current authenticated user
export const getMe = async (req, res) => {
    try {
        const user = await getUserProfile({ userId: req.user.id });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get current user error:', error);
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password , staySignedIn } = req.body;
        const { user, userResponse } = await loginUser({ email, password });
        const tokenExpiry = staySignedIn ? '30d' : '24h';
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
        const refreshToken = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '30d' });
        const cookieOptions = { httpOnly: true, secure: !!(process.env.NODE_ENV === 'production'), sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 };
        try { res.cookie('refreshToken', refreshToken, cookieOptions); } catch (_) {}
        res.status(200).json({ success: true, message: 'Login successful', token, user: userResponse });

    } catch (error) {
        console.error('Login error:', error);
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Change password for authenticated user
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await changePasswordService({ userId: req.user.id, currentPassword, newPassword });
        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Verify email with code
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        await verifyRegistrationCode({ email, code });
        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        await resendRegistrationCode({ email });
        return res.status(200).json({ success: true, message: 'Verification code resent' });

    } catch (error) {
        console.error('Resend code error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Update email for a user. If authenticated, uses the token; otherwise falls back to currentEmail in the body.
export const updateEmail = async (req, res) => {
    try {
        const { currentEmail, newEmail, password } = req.body;
        const { userResponse } = await updateEmailService({ authenticatedUserId: req.user?.id, currentEmail, newEmail, password });
        return res.status(200).json({ success: true, message: 'Email updated successfully.', user: userResponse });
    } catch (error) {
        console.error('Update email error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Verify email after user-initiated email change (authenticated)
export const verifyEmailChange = async (req, res) => {
    try {
        const { code } = req.body;
        const { userResponse } = await verifyEmailChangeCode({ userId: req.user.id, code });
        return res.status(200).json({ success: true, message: 'Email verified successfully', user: userResponse });
    } catch (error) {
        console.error('Verify changed email error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};

// Resend verification code for user-initiated email change (authenticated)
export const resendEmailChangeCode = async (req, res) => {
    try {
        await resendEmailChangeCodeService({ userId: req.user.id });
        return res.status(200).json({ success: true, message: 'Verification code resent' });
    } catch (error) {
        console.error('Resend changed email code error:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
    }
};
