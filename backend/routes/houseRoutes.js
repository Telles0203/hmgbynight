const express = require(
  "express"
);

const {
  rateLimit,
} = require(
  "express-rate-limit"
);


const {
  createHouse,
  listHouses,
} = require(
  "../controllers/houseController"
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
// Create House limiter
// ==============================

const houseCreateLimiter =
  rateLimit({
    windowMs:
      60 * 60 * 1000,

    limit:
      10,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    message: {
      ok: false,

      error:
        "Muitas tentativas de criação de House. Tente novamente mais tarde.",
    },
  });


// ==============================
// List Houses
// ==============================

router.get(
  "/",

  requireAuth,
  requireVerifiedEmail,

  listHouses
);


// ==============================
// Create House
// ==============================

router.post(
  "/",

  requireAuth,
  requireVerifiedEmail,

  houseCreateLimiter,

  createHouse
);


module.exports =
  router;