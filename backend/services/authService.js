import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
 

let cachedTransporter = null;
const pendingRegistrations = new Map();

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({ host, port: smtpPort, secure: smtpPort === 465, auth: { user, pass } });
    return cachedTransporter;
  }

  if (String(process.env.ENABLE_ETHEREAL || '').toLowerCase() === 'true') {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
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

export const getUserProfile = async ({ userId }) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    phone: user.phone,
    division: user.division,
    district: user.district,
    upazila: user.upazila,
    role: user.role,
    shop: user.shop ? { name: user.shop.name || null, address: user.shop.address || null, isSetup: !!user.shop.isSetup } : { name: null, address: null, isSetup: false },
    createdAt: user.createdAt
  };
};

export const prepareRegistration = async ({ email, firstName, password, phone, division, district, upazila }) => {
  if (!email || !firstName || !password || !division || !district || !upazila) {
    const err = new Error('Please fill in all required fields');
    err.statusCode = 400;
    throw err;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User with this email already exists');
    err.statusCode = 400;
    throw err;
  }
  const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  pendingRegistrations.set(email, { data: { email, firstName, password, phone, division, district, upazila }, code: verificationCode, expiresAt });
  // Send email asynchronously to speed up response
  (async () => {
    try { await sendVerificationEmail(email, verificationCode); }
    catch (mailError) { console.error('Email send error (register):', mailError); }
  })();
  return { success: true };
};

export const verifyRegistrationCode = async ({ email, code }) => {
  if (!email || !code) {
    const err = new Error('Email and code are required');
    err.statusCode = 400;
    throw err;
  }
  const pending = pendingRegistrations.get(email);
  if (!pending) {
    const err = new Error('No pending verification for this email');
    err.statusCode = 404;
    throw err;
  }
  const now = new Date();
  if (now > pending.expiresAt) {
    pendingRegistrations.delete(email);
    const err = new Error('Verification code expired');
    err.statusCode = 400;
    throw err;
  }
  if (pending.code !== code) {
    const err = new Error('Invalid verification code');
    err.statusCode = 400;
    throw err;
  }
  const { email: e, firstName, password, phone, division, district, upazila } = pending.data;
  const newUser = new User({ email: e, firstName, password, phone, division, district, upazila, isEmailVerified: true });
  await newUser.save();
  pendingRegistrations.delete(email);
  return { success: true };
};

export const resendRegistrationCode = async ({ email }) => {
  if (!email) {
    const err = new Error('Email is required');
    err.statusCode = 400;
    throw err;
  }
  const pending = pendingRegistrations.get(email);
  if (!pending) {
    const err = new Error('No pending verification for this email');
    err.statusCode = 404;
    throw err;
  }
  const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
  pending.code = verificationCode;
  pending.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  pendingRegistrations.set(email, pending);
  // Fire-and-forget email send; don't block response
  (async () => {
    try { await sendVerificationEmail(email, verificationCode); }
    catch (mailError) { console.error('Email resend error (register):', mailError); }
  })();
  return { success: true };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Please provide email and password');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 400;
    throw err;
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 400;
    throw err;
  }
  const userResponse = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    phone: user.phone,
    division: user.division,
    district: user.district,
    upazila: user.upazila,
    role: user.role,
    createdAt: user.createdAt
  };
  return { user, userResponse };
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    const err = new Error('Current password and new password are required');
    err.statusCode = 400;
    throw err;
  }
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  if (!(hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
    const err = new Error('New password does not meet requirements');
    err.statusCode = 400;
    throw err;
  }
  if (currentPassword === newPassword) {
    const err = new Error('New password must be different from current password');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }
  user.password = newPassword;
  await user.save();
  return { success: true };
};

export const updateEmail = async ({ authenticatedUserId, currentEmail, newEmail, password }) => {
  if (!newEmail || !password) {
    const err = new Error('New email and current password are required');
    err.statusCode = 400;
    throw err;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    const err = new Error('Please provide a valid new email address');
    err.statusCode = 400;
    throw err;
  }
  let user = null;
  if (authenticatedUserId) {
    user = await User.findById(authenticatedUserId);
  } else {
    if (!currentEmail) {
      const err = new Error('Current email is required when not authenticated');
      err.statusCode = 400;
      throw err;
    }
    user = await User.findOne({ email: String(currentEmail).toLowerCase() });
  }
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (authenticatedUserId && currentEmail && currentEmail.toLowerCase() !== String(user.email).toLowerCase()) {
    const err = new Error('Current email does not match your account');
    err.statusCode = 400;
    throw err;
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }
  if (String(user.email).toLowerCase() === newEmail.toLowerCase()) {
    const err = new Error('New email must be different from current email');
    err.statusCode = 400;
    throw err;
  }
  const emailExists = await User.findOne({ email: newEmail.toLowerCase() });
  if (emailExists) {
    const err = new Error('A user with this email already exists');
    err.statusCode = 400;
    throw err;
  }
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
  return { userResponse };
};

export const verifyEmailChangeCode = async ({ userId, code }) => {
  if (!code) {
    const err = new Error('Verification code is required');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (!user.emailVerificationCode || !user.emailVerificationExpires) {
    const err = new Error('No pending email verification');
    err.statusCode = 400;
    throw err;
  }
  const now = new Date();
  if (now > user.emailVerificationExpires) {
    const err = new Error('Verification code expired');
    err.statusCode = 400;
    throw err;
  }
  if (String(user.emailVerificationCode) !== String(code)) {
    const err = new Error('Invalid verification code');
    err.statusCode = 400;
    throw err;
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
  return { userResponse };
};

export const resendEmailChangeCode = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const newCode = (Math.floor(100000 + Math.random() * 900000)).toString();
  user.emailVerificationCode = newCode;
  user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
  // Fire-and-forget email send; don't delay response
  (async () => {
    try { await sendVerificationEmail(user.email, newCode); }
    catch (mailError) { console.error('Email resend error (change):', mailError); }
  })();
  return { success: true };
};

 


