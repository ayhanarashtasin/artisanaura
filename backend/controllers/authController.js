import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Mailer setup – requires real SMTP configuration unless explicit fallback is enabled
let cachedTransporter = null;
// In-memory store for pending registrations
const pendingRegistrations = new Map();

const getTransporter = async () => {
    if (cachedTransporter) return cachedTransporter;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        cachedTransporter = nodemailer.createTransport({
            host,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user, pass }
        });
        return cachedTransporter;
    }

    // If SMTP is not configured, do not silently fall back unless explicitly allowed
    if (String(process.env.ENABLE_ETHEREAL || '').toLowerCase() === 'true') {
        const testAccount = await nodemailer.createTestAccount();
        cachedTransporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
        console.warn('ENABLE_ETHEREAL=true: Using Ethereal test SMTP. Emails will NOT be delivered.');
        return cachedTransporter;
    }

    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.');
};

const sendVerificationEmail = async (toEmail, code) => {
    const transporter = await getTransporter();
    const from = process.env.MAIL_FROM || 'no-reply@artisanaura.local';
    const subject = 'Your ArtisanAura verification code';
    const text = `Your verification code is: ${code}`;
    const html = `<p>Your verification code is: <strong>${code}</strong></p>`;
    await transporter.sendMail({ from, to: toEmail, subject, text, html });
};

export const register = async (req, res) => {
    try {
        const { email, firstName, password, phone, division, district, upazila } = req.body;

        // Validation
        if (!email || !firstName || !password || !division || !district || !upazila) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Prepare pending registration (store until verification)
        const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        pendingRegistrations.set(email, {
            data: { email, firstName, password, phone, division, district, upazila },
            code: verificationCode,
            expiresAt
        });

        // Send the verification email (must succeed)
        try {
            await sendVerificationEmail(email, verificationCode);
        } catch (mailError) {
            console.error('Email send error:', mailError);
            return res.status(500).json({ success: false, message: 'Failed to send verification email. Please try again later.' });
        }

        // Return success response without debug data
        res.status(201).json({
            success: true,
            message: 'Verification code sent to your email. Complete verification to create your account.'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get current authenticated user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                phone: user.phone,
                division: user.division,
                district: user.district,
                upazila: user.upazila,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password , staySignedIn } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Optionally block login until email verified
        // if (!user.isEmailVerified) {
        //     return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
        // }

        // Generate JWT token
        const tokenExpiry = staySignedIn ? '30d' : '24h';
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: tokenExpiry }
        );

        // Return success response (don't send password)
        const userResponse = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            phone: user.phone,
            division: user.division,
            district: user.district,
            upazila: user.upazila,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Change password for authenticated user
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Basic password policy: at least 8 chars, upper, lower, number, special
        const hasMinLength = newPassword.length >= 8;
        const hasUpper = /[A-Z]/.test(newPassword);
        const hasLower = /[a-z]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        if (!(hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
            return res.status(400).json({
                success: false,
                message: 'New password does not meet requirements'
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update and save; pre-save hook will hash the password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Verify email with code
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ success: false, message: 'Email and code are required' });
        }

        const pending = pendingRegistrations.get(email);
        if (!pending) {
            return res.status(404).json({ success: false, message: 'No pending verification for this email' });
        }

        const now = new Date();
        if (now > pending.expiresAt) {
            pendingRegistrations.delete(email);
            return res.status(400).json({ success: false, message: 'Verification code expired' });
        }

        if (pending.code !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Create and save the actual user now
        const { email: e, firstName, password, phone, division, district, upazila } = pending.data;
        const newUser = new User({
            email: e,
            firstName,
            password,
            phone,
            division,
            district,
            upazila,
            isEmailVerified: true
        });
        await newUser.save();
        pendingRegistrations.delete(email);

        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const pending = pendingRegistrations.get(email);
        if (!pending) {
            return res.status(404).json({ success: false, message: 'No pending verification for this email' });
        }

        const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        pending.code = verificationCode;
        pending.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        pendingRegistrations.set(email, pending);

        try {
            await sendVerificationEmail(email, verificationCode);
            return res.status(200).json({ success: true, message: 'Verification code resent' });
        } catch (mailError) {
            console.error('Email send error:', mailError);
            return res.status(500).json({ success: false, message: 'Failed to send verification email' });
        }

    } catch (error) {
        console.error('Resend code error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update email for a user. If authenticated, uses the token; otherwise falls back to currentEmail in the body.
export const updateEmail = async (req, res) => {
    try {
        const { currentEmail, newEmail, password } = req.body;

        // Basic validation
        if (!newEmail || !password) {
            return res.status(400).json({ success: false, message: 'New email and current password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid new email address' });
        }

        // Find user either by authenticated id or by provided currentEmail
        let user = null;
        if (req.user && req.user.id) {
            user = await User.findById(req.user.id);
        } else {
            if (!currentEmail) {
                return res.status(400).json({ success: false, message: 'Current email is required when not authenticated' });
            }
            user = await User.findOne({ email: String(currentEmail).toLowerCase() });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If client sent currentEmail and user is authenticated, ensure it matches
        if (req.user && currentEmail && currentEmail.toLowerCase() !== String(user.email).toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Current email does not match your account' });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Ensure new email is different
        if (String(user.email).toLowerCase() === newEmail.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'New email must be different from current email' });
        }

        // Check if new email already exists
        const emailExists = await User.findOne({ email: newEmail.toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'A user with this email already exists' });
        }

        // Update email immediately without verification as requested
        user.email = newEmail.toLowerCase();
        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;
        await user.save();

        const userResponse = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            phone: user.phone,
            division: user.division,
            district: user.district,
            upazila: user.upazila,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: 'Email updated successfully.',
            user: userResponse
        });
    } catch (error) {
        console.error('Update email error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Verify email after user-initiated email change (authenticated)
export const verifyEmailChange = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Verification code is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.emailVerificationCode || !user.emailVerificationExpires) {
            return res.status(400).json({ success: false, message: 'No pending email verification' });
        }

        const now = new Date();
        if (now > user.emailVerificationExpires) {
            return res.status(400).json({ success: false, message: 'Verification code expired' });
        }

        if (String(user.emailVerificationCode) !== String(code)) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;
        await user.save();

        const userResponse = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            phone: user.phone,
            division: user.division,
            district: user.district,
            upazila: user.upazila,
            createdAt: user.createdAt
        };

        return res.status(200).json({ success: true, message: 'Email verified successfully', user: userResponse });
    } catch (error) {
        console.error('Verify changed email error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Resend verification code for user-initiated email change (authenticated)
export const resendEmailChangeCode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure there is a pending unverified email change
        const newCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        user.emailVerificationCode = newCode;
        user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        try {
            await sendVerificationEmail(user.email, newCode);
        } catch (mailError) {
            console.error('Email send error:', mailError);
            // Still return 200 to avoid leaking info about mail system, but indicate inability
            return res.status(500).json({ success: false, message: 'Failed to send verification email' });
        }

        return res.status(200).json({ success: true, message: 'Verification code resent' });
    } catch (error) {
        console.error('Resend changed email code error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
