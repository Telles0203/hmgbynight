const express =
  require(
    "express"
  );


const {
  rateLimit,
} =
  require(
    "express-rate-limit"
  );


const {
  createHouse,
  listHouses,
  searchHouses,
} =
  require(
    "../controllers/houseController"
  );


const {
  getChronicleManagement,
  updateChronicleSettings,
  approveChronicleCharacter,
  rejectChronicleCharacter,
  updateChronicleMemberRole,
} =
  require(
    "../controllers/chronicle/chronicleManagementController"
  );


const {
  requireAuth,
  requireVerifiedEmail,
} =
  require(
    "../Middlewares/auth"
  );


const router =
  express.Router();


const houseCreateLimiter =
  rateLimit({
    windowMs:
      60 *
      60 *
      1000,

    limit:
      10,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    message: {
      ok:
        false,

      error:
        "Muitas tentativas de criação de Crônica. Tente novamente mais tarde.",
    },
  });


router.get(
  "/search",

  requireAuth,
  requireVerifiedEmail,

  searchHouses
);


router.get(
  "/:houseId/management",

  requireAuth,
  requireVerifiedEmail,

  getChronicleManagement
);


router.patch(
  "/:houseId",

  requireAuth,
  requireVerifiedEmail,

  updateChronicleSettings
);


router.post(
  "/:houseId/characters/:characterId/approve",

  requireAuth,
  requireVerifiedEmail,

  approveChronicleCharacter
);


router.post(
  "/:houseId/characters/:characterId/reject",

  requireAuth,
  requireVerifiedEmail,

  rejectChronicleCharacter
);


router.patch(
  "/:houseId/members/:memberId/role",

  requireAuth,
  requireVerifiedEmail,

  updateChronicleMemberRole
);


router.get(
  "/",

  requireAuth,
  requireVerifiedEmail,

  listHouses
);


router.post(
  "/",

  requireAuth,
  requireVerifiedEmail,

  houseCreateLimiter,

  createHouse
);


module.exports =
  router;