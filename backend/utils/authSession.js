const jwt = require("jsonwebtoken");


const COOKIE_DEFAULT_NAME = "bn_session";

const SESSION_MAX_AGE_MS =
  7 * 24 * 60 * 60 * 1000;

const JWT_ALGORITHM = "HS256";
const JWT_EXPIRATION = "7d";


// ==============================
// JWT configuration
// ==============================

function isJwtConfigured() {
  return Boolean(
    String(
      process.env.JWT_SECRET || ""
    ).trim()
  );
}


function getJwtSecret() {
  const secret = String(
    process.env.JWT_SECRET || ""
  ).trim();


  if (!secret) {
    throw new Error(
      "JWT_SECRET não configurado."
    );
  }


  return secret;
}


// ==============================
// Cookie configuration
// ==============================

function getCookieName() {
  return (
    process.env.COOKIE_NAME ||
    COOKIE_DEFAULT_NAME
  );
}


function getCookieOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";


  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  };
}


function getCookieClearOptions() {
  const cookieOptions =
    getCookieOptions();


  return {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  };
}


// ==============================
// JWT
// ==============================

function signAuthToken(user) {
  if (!user?._id) {
    throw new Error(
      "Usuário inválido para criação da sessão."
    );
  }


  /*
   * Payload mínimo.
   *
   * Não armazenamos nome ou e-mail
   * dentro do JWT. Esses dados são
   * recuperados diretamente do banco
   * em cada autenticação protegida.
   */
  const payload = {
    sub: String(user._id),

    authVersion: Number(
      user.authVersion ?? 0
    ),
  };


  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRATION,
    }
  );
}


function verifyAuthToken(token) {
  if (
    !token ||
    typeof token !== "string"
  ) {
    throw new Error(
      "Token de autenticação inválido."
    );
  }


  return jwt.verify(
    token,
    getJwtSecret(),
    {
      algorithms: [
        JWT_ALGORITHM,
      ],
    }
  );
}


// ==============================
// Response helpers
// ==============================

function setAuthCookie(
  res,
  token
) {
  res.cookie(
    getCookieName(),
    token,
    getCookieOptions()
  );
}


function clearAuthCookie(res) {
  res.clearCookie(
    getCookieName(),
    getCookieClearOptions()
  );
}


module.exports = {
  isJwtConfigured,
  getCookieName,
  signAuthToken,
  verifyAuthToken,
  setAuthCookie,
  clearAuthCookie,
};