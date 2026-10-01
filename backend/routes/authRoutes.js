const express = require("express");
const { rateLimit } = require("express-rate-limit");

const router = express.Router();

const {
  register,
  login,
  me,
  logout,
  sendEmailVerificationToken,
  verifyEmailToken,
} = require("../controllers/authController");

const {
  requireAuth,
} = require("../Middlewares/auth");

// ==============================
// Rate limits
// ==============================

// Máximo de 10 tentativas de login
// por IP a cada 15 minutos.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    ok: false,
    error:
      "Muitas tentativas de login. Tente novamente mais tarde.",
  },
});

// Evita criação excessiva de contas.
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

// Limita reenvio de código por usuário/IP.
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

// Limita tentativas de código de validação.
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

// ==============================
// Auth
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

router.get(
  "/me",
  requireAuth,
  me
);

router.post(
  "/logout",
  requireAuth,
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