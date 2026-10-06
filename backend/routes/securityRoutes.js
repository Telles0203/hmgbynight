const express = require(
  "express"
);


const {
  issueCsrfToken,
} = require(
  "../utils/csrfToken"
);


const router =
  express.Router();


router.get(
  "/csrf-token",
  (
    req,
    res
  ) => {
    const token =
      issueCsrfToken(
        res
      );


    res.set(
      "Cache-Control",
      "no-store"
    );


    res.set(
      "Pragma",
      "no-cache"
    );


    return res
      .status(
        200
      )
      .json({
        ok:
          true,

        csrfToken:
          token,
      });
  }
);


module.exports =
  router;