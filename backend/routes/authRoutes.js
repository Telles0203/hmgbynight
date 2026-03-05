const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  logout,
  sendEmailVerificationToken,
  verifyEmailToken
} = require("../controllers/authController");

const { requireAuth } = require("../Middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

router.post("/email/send-token", requireAuth, sendEmailVerificationToken);
router.post("/email/verify-token", requireAuth, verifyEmailToken);

module.exports = router;