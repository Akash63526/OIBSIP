const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { sendTemplateEmail } = require('../services/emailService');

// ─── JWT Token Generation ─────────────────────────────────────
const generateAuthTokens = (user) => {
  const accessToken = jwt.sign({ sub: user._id, role: user.role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpirationMinutes
  });
  return { access: { token: accessToken } };
};

// ─── Register ─────────────────────────────────────────────────
// Creates user, generates email verification token, sends verification email
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) {
    return next(new ApiError(400, 'Email already taken'));
  }

  const user = await User.create({ name, email, password });
  const tokens = generateAuthTokens(user);

  // Generate email verification token (random 32-byte hex)
  const verifyTokenValue = crypto.randomBytes(32).toString('hex');
  await Token.create({
    user: user._id,
    token: verifyTokenValue,
    type: 'VERIFY_EMAIL',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send verification email
  const verifyUrl = `${config.clientUrl}/verify-email?token=${verifyTokenValue}`;
  try {
    await sendTemplateEmail({
      to: user.email,
      subject: 'Verify Your Email — SliceSprint',
      templateName: 'verifyEmail.html',
      replacements: {
        userName: user.name,
        verifyUrl,
        year: new Date().getFullYear().toString(),
      },
    });
  } catch (emailErr) {
    // Don't fail registration if email send fails
    console.error('Email send failed during registration:', emailErr.message);
  }

  successResponse(res, 201, 'User registered successfully. Please check your email to verify your account.', { user, tokens });
});

// ─── Login ────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, 'Incorrect email or password'));
  }

  const tokens = generateAuthTokens(user);
  successResponse(res, 200, 'Login successful', { user, tokens });
});

// ─── Logout ───────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  successResponse(res, 200, 'Logout successful');
});

// ─── Get Profile ──────────────────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  successResponse(res, 200, 'Profile fetched successfully', user);
});

// ─── Verify Email ─────────────────────────────────────────────
// POST /auth/verify-email/:token
// Validates the token, marks user.isVerified = true, deletes the token.
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const tokenDoc = await Token.findOne({ token, type: 'VERIFY_EMAIL' });
  if (!tokenDoc) {
    return next(new ApiError(400, 'Invalid or expired verification token'));
  }

  // Check if token has expired (TTL index handles cleanup, but check manually too)
  if (tokenDoc.expiresAt < new Date()) {
    await Token.deleteOne({ _id: tokenDoc._id });
    return next(new ApiError(400, 'Verification token has expired. Please request a new one.'));
  }

  // Mark user as verified
  const user = await User.findById(tokenDoc.user);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  // Delete the used token
  await Token.deleteOne({ _id: tokenDoc._id });

  successResponse(res, 200, 'Email verified successfully. You can now log in.');
});

// ─── Forgot Password ─────────────────────────────────────────
// POST /auth/forgot-password
// Generates a RESET_PASSWORD token, sends reset email.
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, 'Please provide an email address'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether a user exists — return success either way
    return successResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
  }

  // Delete any existing reset tokens for this user
  await Token.deleteMany({ user: user._id, type: 'RESET_PASSWORD' });

  // Generate reset token
  const resetTokenValue = crypto.randomBytes(32).toString('hex');
  await Token.create({
    user: user._id,
    token: resetTokenValue,
    type: 'RESET_PASSWORD',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  // Send reset email
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetTokenValue}`;
  try {
    await sendTemplateEmail({
      to: user.email,
      subject: 'Reset Your Password — SliceSprint',
      templateName: 'resetPassword.html',
      replacements: {
        userName: user.name,
        resetUrl,
        year: new Date().getFullYear().toString(),
      },
    });
  } catch (emailErr) {
    // Clean up the token if email fails
    await Token.deleteOne({ token: resetTokenValue });
    return next(new ApiError(500, 'Failed to send reset email. Please try again later.'));
  }

  successResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
});

// ─── Reset Password ──────────────────────────────────────────
// POST /auth/reset-password/:token
// Validates the token, hashes and saves the new password, deletes the token.
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return next(new ApiError(400, 'Password must be at least 8 characters long'));
  }

  const tokenDoc = await Token.findOne({ token, type: 'RESET_PASSWORD' });
  if (!tokenDoc) {
    return next(new ApiError(400, 'Invalid or expired reset token'));
  }

  if (tokenDoc.expiresAt < new Date()) {
    await Token.deleteOne({ _id: tokenDoc._id });
    return next(new ApiError(400, 'Reset token has expired. Please request a new one.'));
  }

  const user = await User.findById(tokenDoc.user).select('+password');
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Update password (bcrypt hashing happens in pre-save hook)
  user.password = password;
  await user.save();

  // Delete the used token and any other reset tokens for this user
  await Token.deleteMany({ user: user._id, type: 'RESET_PASSWORD' });

  successResponse(res, 200, 'Password reset successfully. You can now log in with your new password.');
});
