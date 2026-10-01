const jwt = require("jsonwebtoken");

function getCookieName() {
  return process.env.COOKIE_NAME || "hmg_auth";
}

function requireAuth(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error(
      "[AUTH] JWT_SECRET não está configurado."
    );

    return res.status(500).json({
      ok: false,
      error: "Erro interno de autenticação.",
    });
  }

  const cookieName = getCookieName();
  const token = req.cookies?.[cookieName];

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

    req.user = {
      sub: String(payload.sub),
      email: payload.email,
      name: payload.name,
    };

    return next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
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