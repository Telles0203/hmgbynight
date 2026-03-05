const jwt = require("jsonwebtoken");

function getCookieName() {
  return process.env.COOKIE_NAME || "hmg_auth";
}

function requireAuth(req, res, next) {
  try {
    const cookieName = getCookieName();
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ ok: false, error: "Não autenticado" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, name }
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
}

module.exports = { requireAuth };