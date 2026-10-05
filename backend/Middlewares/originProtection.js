const SAFE_METHODS =
  new Set([
    "GET",
    "HEAD",
    "OPTIONS",
  ]);


function normalizeOrigin(
  value,
  variableName
) {
  const rawValue =
    String(
      value || ""
    ).trim();


  if (!rawValue) {
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


function getProductionOrigin() {
  return normalizeOrigin(
    process.env.APP_URL,
    "APP_URL"
  );
}


function getLocalOrigin() {
  return normalizeOrigin(
    process.env.APP_URL_LOCAL,
    "APP_URL_LOCAL"
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
    return res
      .status(403)
      .json({
        ok: false,

        error:
          "Origem da requisição não permitida.",
      });
  }


  const origin =
    String(
      req.get(
        "origin"
      ) || ""
    ).trim();


  /*
   * Alguns clientes HTTP e chamadas
   * internas podem não enviar Origin.
   *
   * Navegadores modernos normalmente
   * enviam Origin nas requisições
   * relevantes que alteram dados.
   */
  if (!origin) {
    return next();
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
    origin ===
    productionOrigin
  ) {
    return next();
  }


  if (
    isLocalRequest(req) &&
    origin ===
      localOrigin
  ) {
    return next();
  }


  return res
    .status(403)
    .json({
      ok: false,

      error:
        "Origem da requisição não permitida.",
    });
}


module.exports =
  originProtection;