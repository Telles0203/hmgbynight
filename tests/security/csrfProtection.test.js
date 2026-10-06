const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const csrfProtection = require(
  "../../backend/Middlewares/csrfProtection"
);


const {
  createCsrfToken,
  getCsrfCookieName,
  issueCsrfToken,
} = require(
  "../../backend/utils/csrfToken"
);


function createResponse() {
  return {
    statusCode:
      200,

    body:
      null,

    cookies:
      [],

    status(
      statusCode
    ) {
      this.statusCode =
        statusCode;

      return this;
    },

    json(
      body
    ) {
      this.body =
        body;

      return this;
    },

    cookie(
      name,
      value,
      options
    ) {
      this.cookies.push({
        name,
        value,
        options,
      });

      return this;
    },
  };
}


function createRequest({
  method = "POST",
  cookieToken = "",
  headerToken = "",
} = {}) {
  return {
    method,

    cookies: {
      [getCsrfCookieName()]:
        cookieToken,
    },

    get(
      headerName
    ) {
      if (
        String(
          headerName
        ).toLowerCase() ===
        "x-csrf-token"
      ) {
        return headerToken;
      }

      return undefined;
    },
  };
}


test(
  "creates a random CSRF token",
  () => {
    const firstToken =
      createCsrfToken();

    const secondToken =
      createCsrfToken();


    assert.equal(
      firstToken.length,
      64
    );


    assert.equal(
      secondToken.length,
      64
    );


    assert.notEqual(
      firstToken,
      secondToken
    );
  }
);


test(
  "issues an HttpOnly strict CSRF cookie",
  () => {
    const response =
      createResponse();


    const token =
      issueCsrfToken(
        response
      );


    assert.equal(
      response.cookies.length,
      1
    );


    const cookie =
      response.cookies[
        0
      ];


    assert.equal(
      cookie.name,
      getCsrfCookieName()
    );


    assert.equal(
      cookie.value,
      token
    );


    assert.equal(
      cookie.options.httpOnly,
      true
    );


    assert.equal(
      cookie.options.sameSite,
      "strict"
    );


    assert.equal(
      cookie.options.path,
      "/"
    );
  }
);


test(
  "allows safe methods without a CSRF token",
  () => {
    const request =
      createRequest({
        method:
          "GET",
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    csrfProtection(
      request,
      response,
      () => {
        nextCalled =
          true;
      }
    );


    assert.equal(
      nextCalled,
      true
    );


    assert.equal(
      response.statusCode,
      200
    );
  }
);


test(
  "rejects unsafe requests without a CSRF token",
  () => {
    const request =
      createRequest();


    const response =
      createResponse();


    let nextCalled =
      false;


    csrfProtection(
      request,
      response,
      () => {
        nextCalled =
          true;
      }
    );


    assert.equal(
      nextCalled,
      false
    );


    assert.equal(
      response.statusCode,
      403
    );


    assert.equal(
      response.body.code,
      "CSRF_TOKEN_INVALID"
    );
  }
);


test(
  "rejects different cookie and header tokens",
  () => {
    const request =
      createRequest({
        cookieToken:
          createCsrfToken(),

        headerToken:
          createCsrfToken(),
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    csrfProtection(
      request,
      response,
      () => {
        nextCalled =
          true;
      }
    );


    assert.equal(
      nextCalled,
      false
    );


    assert.equal(
      response.statusCode,
      403
    );
  }
);


test(
  "allows unsafe requests with matching tokens",
  () => {
    const token =
      createCsrfToken();


    const request =
      createRequest({
        cookieToken:
          token,

        headerToken:
          token,
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    csrfProtection(
      request,
      response,
      () => {
        nextCalled =
          true;
      }
    );


    assert.equal(
      nextCalled,
      true
    );


    assert.equal(
      response.statusCode,
      200
    );
  }
);