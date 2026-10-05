const SAFE_METHODS =
  new Set([
    "GET",
    "HEAD",
    "OPTIONS",
  ]);


function normalizeConfiguredOrigin(
  value,
  variableName,
  options = {}
) {
  const {
    required = true,
  } = options;


  const rawValue =
    String(
      value || ""
    ).trim();


  if (!rawValue) {
    if (!required) {
      return null;
    }

    throw new Error(
      `${variableName} não configurado.`
    );
  }


  let url;

  try {
    url =
      new URL(
        rawValue
      );

  } catch {
    throw new Error(
      `${variableName} inválido.`
    );
  }


  return url.origin;
}


function normalizeRequestOrigin(
  value
) {
  const rawValue =
    String(
      value || ""
    ).trim();


  if (!rawValue) {
    return null;
  }


  try {
    return new URL(
      rawValue
    ).origin;

  } catch {
    return null;
  }
}


function getProductionOrigin() {
  return normalizeConfiguredOrigin(
    process.env.APP_URL,
    "APP_URL"
  );
}


function getLocalOrigin() {
  return normalizeConfiguredOrigin(
    process.env.APP_URL_LOCAL,
    "APP_URL_LOCAL",
    {
      required: false,
    }
  );
}


function isLocalRequest(req) {
  const hostname =
    String(
      req.hostname || ""
    )
      .trim()
      .toLowerCase();


  return (
    hostname ===
      "localhost" ||
    hostname ===
      "127.0.0.1" ||
    hostname ===
      "::1"
  );
}


function getRequestOrigin(req) {
  const originHeader =
    String(
      req.get(
        "origin"
      ) || ""
    ).trim();


  if (originHeader) {
    return normalizeRequestOrigin(
      originHeader
    );
  }


  const refererHeader =
    String(
      req.get(
        "referer"
      ) || ""
    ).trim();


  if (refererHeader) {
    return normalizeRequestOrigin(
      refererHeader
    );
  }


  return null;
}


function denyRequest(res) {
  return res
    .status(403)
    .json({
      ok: false,

      error:
        "Origem da requisição não permitida.",
    });
}


function originProtection(
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


  const secFetchSite =
    String(
      req.get(
        "sec-fetch-site"
      ) || ""
    )
      .trim()
      .toLowerCase();


  if (
    secFetchSite ===
    "cross-site"
  ) {
    return denyRequest(
      res
    );
  }


  const requestOrigin =
    getRequestOrigin(
      req
    );


  if (!requestOrigin) {
    return denyRequest(
      res
    );
  }


  let productionOrigin;
  let localOrigin;

  try {
    productionOrigin =
      getProductionOrigin();

    localOrigin =
      getLocalOrigin();

  } catch (error) {
    console.error(
      "[SECURITY] Erro ao carregar origens permitidas:",
      error
    );

    return res
      .status(500)
      .json({
        ok: false,

        error:
          "Erro interno de segurança.",
      });
  }


  if (
    requestOrigin ===
    productionOrigin
  ) {
    return next();
  }


  if (
    localOrigin &&
    isLocalRequest(req) &&
    requestOrigin ===
      localOrigin
  ) {
    return next();
  }


  return denyRequest(
    res
  );
}


module.exports =
  originProtection;