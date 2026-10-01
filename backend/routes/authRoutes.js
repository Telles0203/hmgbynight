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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  // Login bem-sucedido não consome limite.
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

// Logout sem requireAuth.
// Mesmo com JWT expirado ou inválido,
// o cookie ainda poderá ser removido.
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