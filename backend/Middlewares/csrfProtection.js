const {
  readCsrfCookie,
  readCsrfHeader,
  tokensMatch,
} = require(
  "../utils/csrfToken"
);


const SAFE_METHODS =
  new Set([
    "GET",
    "HEAD",
    "OPTIONS",
  ]);


function denyCsrfRequest(
  res
) {
  return res
    .status(
      403
    )
    .json({
      ok:
        false,

      code:
        "CSRF_TOKEN_INVALID",

      error:
        "Token de segurança inválido ou ausente.",
    });
}


function csrfProtection(
  req,
  res,
  next
) {
  if (
    SAFE_METHODS.has(
      req.method
    )
  ) {
    return next();
  }


  const cookieToken =
    readCsrfCookie(
      req
    );


  const headerToken =
    readCsrfHeader(
      req
    );


  if (
    !tokensMatch(
      cookieToken,
      headerToken
    )
  ) {
    return denyCsrfRequest(
      res
    );
  }


  return next();
}


module.exports =
  csrfProtection;