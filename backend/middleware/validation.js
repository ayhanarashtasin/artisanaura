import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- Registration Validation Middleware ---
export const validateRegistration = (req, res, next) => {
  const { email, firstName, password, division, district, upazila } = req.body;
  
  // Email validation: Checks for a valid email format.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Password validation: Ensures the password meets the minimum length.
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Name validation: Ensures the first name is not empty.
  if (!firstName || firstName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'First name must be at least 2 characters long'
    });
  }

  // Location validation: Ensures all location fields are provided.
  if (!division || !district || !upazila) {
    return res.status(400).json({
      success: false,
      message: 'Please select your division, district, and upazila'
    });
  }

  // If all checks pass, proceed to the next middleware (the controller).
  next();
};

// --- Login Validation Middleware ---
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

// --- Token Authentication Middleware ---
// This function protects your API routes.
export const authenticateToken = async (req, res, next) => {
  try {
    // 1. Get the token from the 'Authorization' header.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

    // 2. If no token is provided, deny access.
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please log in.'
      });
    }

    // 3. Verify the token.
    // This is the crucial step. If the token is expired or the secret is wrong,
    // it will throw an error, which will be caught by the 'catch' block below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Find the user associated with the token.
    const user = await User.findById(decoded.userId);
    if (!user) {
      // This handles cases where the user might have been deleted.
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.'
      });
    }

    // 5. Attach user information to the request object for later use.
    req.user = { id: user._id, email: user.email };
    
    // 6. If everything is valid, proceed to the protected route's controller.
    next();

  } catch (error) {
    // This block runs ONLY if jwt.verify() fails.
    console.error('Auth middleware error:', error.message);
    
    // This is where your error message comes from. It's the correct behavior
    // when the token is invalid or expired.
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
