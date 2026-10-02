const express = require("express");

const {
  getCharacterOptions,
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
// Character creation options
// ==============================

router.get(
  "/options",
  requireAuth,
  requireVerifiedEmail,
  getCharacterOptions
);

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