import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            email,
            firstName,
            password,
            phone,
            division,
            district,
            upazila
        });

        await newUser.save();

        // Return success response (don't send password)
        const userResponse = {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            phone: newUser.phone,
            division: newUser.division,
            district: newUser.district,
            upazila: newUser.upazila,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
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

