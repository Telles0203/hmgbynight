const crypto = require(
  "crypto"
);


const DEFAULT_COOKIE_NAME =
  "bn_csrf";

const HEADER_NAME =
  "x-csrf-token";

const TOKEN_BYTES =
  32;

const TOKEN_MAX_AGE_MS =
  2 * 60 * 60 * 1000;


function getCsrfCookieName() {
  return (
    process.env.CSRF_COOKIE_NAME ||
    DEFAULT_COOKIE_NAME
  );
}


function getCsrfCookieOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";


  return {
    httpOnly:
      true,

    secure:
      isProduction,

    sameSite:
      "strict",

    path:
      "/",

    maxAge:
      TOKEN_MAX_AGE_MS,
  };
}


function createCsrfToken() {
  return crypto
    .randomBytes(
      TOKEN_BYTES
    )
    .toString(
      "hex"
    );
}


function issueCsrfToken(
  res
) {
  const token =
    createCsrfToken();


  res.cookie(
    getCsrfCookieName(),
    token,
    getCsrfCookieOptions()
  );


  return token;
}


function readCsrfCookie(
  req
) {
  return String(
    req.cookies?.[
      getCsrfCookieName()
    ] || ""
  ).trim();
}


function readCsrfHeader(
  req
) {
  return String(
    req.get(
      HEADER_NAME
    ) || ""
  ).trim();
}


function tokensMatch(
  firstToken,
  secondToken
) {
  if (
    !firstToken ||
    !secondToken
  ) {
    return false;
  }


  const firstBuffer =
    Buffer.from(
      firstToken,
      "utf8"
    );


  const secondBuffer =
    Buffer.from(
      secondToken,
      "utf8"
    );


  if (
    firstBuffer.length !==
    secondBuffer.length
  ) {
    return false;
  }


  return crypto.timingSafeEqual(
    firstBuffer,
    secondBuffer
  );
}


module.exports = {
  HEADER_NAME,
  TOKEN_MAX_AGE_MS,
  getCsrfCookieName,
  getCsrfCookieOptions,
  createCsrfToken,
  issueCsrfToken,
  readCsrfCookie,
  readCsrfHeader,
  tokensMatch,
};