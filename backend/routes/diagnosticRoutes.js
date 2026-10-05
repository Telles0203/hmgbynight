const express = require(
  "express"
);

const {
  requireAuth,
} = require(
  "../Middlewares/auth"
);


const router =
  express.Router();


// =============================================
// Proxy diagnostics
// TEMPORARY ROUTE
// =============================================

router.get(
  "/proxy",

  requireAuth,

  (
    req,
    res
  ) => {
    res.set(
      "Cache-Control",
      "no-store"
    );


    const diagnostics = {
      trustProxy:
        req.app.get(
          "trust proxy"
        ),

      socketRemoteAddress:
        req.socket
          ?.remoteAddress ||
        null,

      requestIp:
        req.ip ||
        null,

      requestIps:
        Array.isArray(
          req.ips
        )
          ? req.ips
          : [],

      xForwardedFor:
        req.get(
          "x-forwarded-for"
        ) ||
        null,

      xForwardedProto:
        req.get(
          "x-forwarded-proto"
        ) ||
        null,

      xForwardedHost:
        req.get(
          "x-forwarded-host"
        ) ||
        null,

      cfConnectingIp:
        req.get(
          "cf-connecting-ip"
        ) ||
        null,

      forwarded:
        req.get(
          "forwarded"
        ) ||
        null,

      protocol:
        req.protocol,

      hostname:
        req.hostname,
    };


    return res.json({
      ok: true,
      diagnostics,
    });
  }
);


module.exports =
  router;