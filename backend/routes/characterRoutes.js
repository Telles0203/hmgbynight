const express = require(
  "express"
);

const {
  rateLimit,
} = require(
  "express-rate-limit"
);


const {
  getCharacterOptions,
  createCharacter,
  listCharacters,
  updateCharacterConcept,
  requestMotherHouse,
  deleteCharacter,
} = require(
  "../controllers/characterController"
);


const {
  requireAuth,
  requireVerifiedEmail,
} = require(
  "../Middlewares/auth"
);


const router =
  express.Router();


// ==============================
// Delete rate limit
// ==============================

const characterDeleteLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      5,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    skipSuccessfulRequests:
      true,

    message: {
      ok:
        false,

      error:
        "Muitas tentativas de exclusão de personagem. Aguarde alguns minutos.",
    },
  });


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


// ==============================
// Update Concept
// ==============================

router.patch(
  "/:characterId/concept",

  requireAuth,
  requireVerifiedEmail,

  updateCharacterConcept
);


// ==============================
// Request mother House
// ==============================

router.post(
  "/:characterId/mother-house-request",

  requireAuth,
  requireVerifiedEmail,

  requestMotherHouse
);


// ==============================
// Delete PC
// ==============================

router.delete(
  "/:characterId",

  requireAuth,
  requireVerifiedEmail,

  characterDeleteLimiter,

  deleteCharacter
);


module.exports =
  router;