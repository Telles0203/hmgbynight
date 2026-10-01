const jwt = require("jsonwebtoken");

const User = require("../models/User");

function getCookieName() {
  return process.env.COOKIE_NAME || "hmg_auth";
}

async function requireAuth(
  req,
  res,
  next
) {
  const jwtSecret =
    process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error(
      "[AUTH] JWT_SECRET não está configurado."
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno de autenticação.",
    });
  }

  const cookieName =
    getCookieName();

  const token =
    req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: "Não autenticado.",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      jwtSecret,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.sub
    ) {
      return res.status(401).json({
        ok: false,
        error: "Sessão inválida.",
      });
    }

    const user =
      await User.findById(
        payload.sub
      ).select(
        "email name authVersion"
      );

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Sessão inválida.",
      });
    }

    const tokenAuthVersion =
      Number(
        payload.authVersion ?? 0
      );

    const userAuthVersion =
      Number(
        user.authVersion ?? 0
      );

    if (
      tokenAuthVersion !==
      userAuthVersion
    ) {
      return res.status(401).json({
        ok: false,
        error:
          "Sessão invalidada. Entre novamente.",
      });
    }

    req.user = {
      sub: String(user._id),
      email: user.email,
      name: user.name,
      authVersion:
        userAuthVersion,
    };

    return next();
  } catch (error) {
    if (
      error?.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        ok: false,
        error: "Sessão expirada.",
      });
    }

    return res.status(401).json({
      ok: false,
      error: "Sessão inválida.",
    });
  }
}

module.exports = {
  requireAuth,
};