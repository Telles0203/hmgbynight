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
  getCharacterArchetypes,
  updateCharacterConcept,
  updateCharacterTitle,
  updateCharacterClan,
  updateCharacterNature,
  updateCharacterDemeanor,
  updateCharacterMoralityPath,
  updateCharacterVirtues,
  updateCharacterVirtue,
  updateCharacterCreation,
  requestMotherHouse,
  cancelMotherHouseRequest,
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


router.get(
  "/options",
  requireAuth,
  requireVerifiedEmail,
  getCharacterOptions
);


router.get(
  "/",
  requireAuth,
  requireVerifiedEmail,
  listCharacters
);


router.post(
  "/",
  requireAuth,
  requireVerifiedEmail,
  createCharacter
);


router.get(
  "/:characterId/archetypes",
  requireAuth,
  requireVerifiedEmail,
  getCharacterArchetypes
);


router.patch(
  "/:characterId/concept",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterConcept
);


router.patch(
  "/:characterId/title",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterTitle
);


router.patch(
  "/:characterId/clan",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterClan
);


router.patch(
  "/:characterId/nature",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterNature
);


router.patch(
  "/:characterId/demeanor",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterDemeanor
);


router.patch(
  "/:characterId/morality-path",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterMoralityPath
);


router.patch(
  "/:characterId/virtues",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterVirtues
);


router.patch(
  "/:characterId/virtues/:virtueKey",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterVirtue
);


router.patch(
  "/:characterId/creation",
  requireAuth,
  requireVerifiedEmail,
  updateCharacterCreation
);


router.post(
  "/:characterId/mother-house-request",
  requireAuth,
  requireVerifiedEmail,
  requestMotherHouse
);


router.delete(
  "/:characterId/mother-house-request",
  requireAuth,
  requireVerifiedEmail,
  cancelMotherHouseRequest
);


router.delete(
  "/:characterId",
  requireAuth,
  requireVerifiedEmail,
  characterDeleteLimiter,
  deleteCharacter
);


module.exports =
  router;