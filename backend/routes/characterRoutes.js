const express = require("express");

const {
  createCharacter,
  listCharacters,
} = require(
  "../controllers/characterController"
);

const {
  requireAuth,
  requireVerifiedEmail,
} = require(
  "../Middlewares/auth"
);

const router = express.Router();

// ==============================
// List user's PCs
// ==============================

router.get(
  "/",
  requireAuth,
  requireVerifiedEmail,
  listCharacters
);

// ==============================
// Create PC
// ==============================

router.post(
  "/",
  requireAuth,
  requireVerifiedEmail,
  createCharacter
);

module.exports = router;