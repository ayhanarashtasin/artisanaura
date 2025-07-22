import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const validateRegistration = (req, res, next) => {
    const { email, firstName, password, division, district, upazila } = req.body;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    // Password validation
    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    // Name validation
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'First name must be at least 2 characters long'
        });
    }

    // Location validation
    if (!division || !district || !upazila) {
        return res.status(400).json({
            success: false,
            message: 'Please select your division, district, and upazila'
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    // Password validation
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a password'
        });
    }

    next();
};
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user and attach to request
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = { id: user._id, email: user.email };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};