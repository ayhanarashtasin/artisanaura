import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { register, login  } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);



export default router;