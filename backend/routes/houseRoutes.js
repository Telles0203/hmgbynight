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