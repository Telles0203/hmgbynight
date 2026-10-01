const express = require("express");
const { rateLimit } = require("express-rate-limit");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  logout,
  sendEmailVerificationToken,
  verifyEmailToken,
} = require("../controllers/authController");

const {
  updateAccountName,
  updateAccountPassword,
} = require("../controllers/accountController");

const {
  requireAuth,
} = require("../Middlewares/auth");

// ==============================
// Rate limits
// ==============================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    ok: false,
    error:
      "Muitas tentativas de login. Tente novamente mais tarde.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas tentativas de cadastro. Tente novamente mais tarde.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas solicitações de recuperação. Aguarde alguns minutos.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas tentativas de redefinição. Aguarde alguns minutos.",
  },
});

const emailTokenLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitos códigos solicitados. Aguarde alguns minutos.",
  },
});

const emailVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas tentativas de validação. Aguarde alguns minutos.",
  },
});

const accountPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas tentativas de alteração de senha. Aguarde alguns minutos.",
  },
});

// ==============================
// Authentication
// ==============================

router.post(
  "/register",
  registerLimiter,
  register
);

router.post(
  "/login",
  loginLimiter,
  login
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  resetPassword
);

router.get(
  "/me",
  requireAuth,
  me
);

// ==============================
// Account
// ==============================

router.patch(
  "/account/name",
  requireAuth,
  updateAccountName
);

router.patch(
  "/account/password",
  requireAuth,
  accountPasswordLimiter,
  updateAccountPassword
);

// ==============================
// Logout
// ==============================

router.post(
  "/logout",
  logout
);

// ==============================
// Email verification
// ==============================

router.post(
  "/email/send-token",
  requireAuth,
  emailTokenLimiter,
  sendEmailVerificationToken
);

router.post(
  "/email/verify-email-token",
  requireAuth,
  emailVerifyLimiter,
  verifyEmailToken
);

module.exports = router;