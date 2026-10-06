const nativeFetch =
  window.fetch.bind(
    window
  );


const SAFE_METHODS =
  new Set([
    "GET",
    "HEAD",
    "OPTIONS",
  ]);


let csrfToken =
  null;

let csrfRequest =
  null;


function getRequestMethod(
  input,
  init
) {
  const method =
    init?.method ||
    (
      input instanceof Request
        ? input.method
        : "GET"
    );


  return String(
    method
  ).toUpperCase();
}


function isSameOriginApiRequest(
  input
) {
  try {
    const rawUrl =
      input instanceof Request
        ? input.url
        : input;


    const url =
      new URL(
        rawUrl,
        window.location.href
      );


    return (
      url.origin ===
        window.location.origin &&
      (
        url.pathname ===
          "/api" ||
        url.pathname.startsWith(
          "/api/"
        )
      )
    );

  } catch {
    return false;
  }
}


async function requestCsrfToken(
  forceRefresh = false
) {
  if (
    !forceRefresh &&
    csrfToken
  ) {
    return csrfToken;
  }


  if (csrfRequest) {
    return csrfRequest;
  }


  csrfRequest =
    (
      async () => {
        const response =
          await nativeFetch(
            "/api/security/csrf-token",
            {
              method:
                "GET",

              credentials:
                "include",

              cache:
                "no-store",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );


        const data =
          await response
            .json()
            .catch(
              () => ({})
            );


        if (
          !response.ok ||
          !data?.ok ||
          !data?.csrfToken
        ) {
          throw new Error(
            "Não foi possível obter o token de segurança."
          );
        }


        csrfToken =
          String(
            data.csrfToken
          );


        return csrfToken;
      }
    )();


  try {
    return await csrfRequest;

  } finally {
    csrfRequest =
      null;
  }
}


async function sendProtectedRequest(
  input,
  init,
  forceTokenRefresh
) {
  const token =
    await requestCsrfToken(
      forceTokenRefresh
    );


  const headers =
    new Headers(
      init?.headers ||
      (
        input instanceof Request
          ? input.headers
          : undefined
      )
    );


  headers.set(
    "X-CSRF-Token",
    token
  );


  return nativeFetch(
    input,
    {
      ...init,

      headers,

      credentials:
        init?.credentials ||
        "include",
    }
  );
}


async function apiFetch(
  input,
  init = {}
) {
  const method =
    getRequestMethod(
      input,
      init
    );


  if (
    SAFE_METHODS.has(
      method
    ) ||
    !isSameOriginApiRequest(
      input
    )
  ) {
    return nativeFetch(
      input,
      init
    );
  }


  let response =
    await sendProtectedRequest(
      input,
      init,
      false
    );


  if (
    response.status !==
    403
  ) {
    return response;
  }


  const errorData =
    await response
      .clone()
      .json()
      .catch(
        () => ({})
      );


  if (
    errorData?.code !==
    "CSRF_TOKEN_INVALID"
  ) {
    return response;
  }


  csrfToken =
    null;


  response =
    await sendProtectedRequest(
      input,
      init,
      true
    );


  return response;
}


function clearCsrfToken() {
  csrfToken =
    null;
}


window.fetch =
  apiFetch;

window.apiFetch =
  apiFetch;

window.refreshCsrfToken =
  () =>
    requestCsrfToken(
      true
    );

window.clearCsrfToken =
  clearCsrfToken;