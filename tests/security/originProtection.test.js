const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const originProtection = require(
  "../../backend/Middlewares/originProtection"
);


const ORIGINAL_APP_URL =
  process.env.APP_URL;

const ORIGINAL_APP_URL_LOCAL =
  process.env.APP_URL_LOCAL;


function createResponse() {
  return {
    statusCode:
      200,

    body:
      null,

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
  };
}


function createRequest({
  method = "POST",
  origin = "",
  referer = "",
  secFetchSite = "",
  hostname = "bynight.com.br",
} = {}) {
  return {
    method,
    hostname,

    get(
      headerName
    ) {
      switch (
        String(
          headerName
        ).toLowerCase()
      ) {
        case "origin":
          return origin;

        case "referer":
          return referer;

        case "sec-fetch-site":
          return secFetchSite;

        default:
          return undefined;
      }
    },
  };
}


test.beforeEach(
  () => {
    process.env.APP_URL =
      "https://bynight.com.br";

    process.env.APP_URL_LOCAL =
      "http://localhost:8080";
  }
);


test.after(
  () => {
    if (
      typeof ORIGINAL_APP_URL ===
      "undefined"
    ) {
      delete process.env.APP_URL;

    } else {
      process.env.APP_URL =
        ORIGINAL_APP_URL;
    }


    if (
      typeof ORIGINAL_APP_URL_LOCAL ===
      "undefined"
    ) {
      delete process.env.APP_URL_LOCAL;

    } else {
      process.env.APP_URL_LOCAL =
        ORIGINAL_APP_URL_LOCAL;
    }
  }
);


test(
  "allows safe methods",
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


    originProtection(
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
  }
);


test(
  "allows production origin",
  () => {
    const request =
      createRequest({
        origin:
          "https://bynight.com.br",

        secFetchSite:
          "same-origin",
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    originProtection(
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
  "allows configured localhost origin for local requests",
  () => {
    const request =
      createRequest({
        origin:
          "http://localhost:8080",

        secFetchSite:
          "same-origin",

        hostname:
          "localhost",
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    originProtection(
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
  }
);


test(
  "rejects cross-site requests",
  () => {
    const request =
      createRequest({
        origin:
          "https://example.com",

        secFetchSite:
          "cross-site",
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    originProtection(
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
  "rejects an unknown origin",
  () => {
    const request =
      createRequest({
        origin:
          "https://example.com",

        secFetchSite:
          "same-site",
      });


    const response =
      createResponse();


    let nextCalled =
      false;


    originProtection(
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
  "rejects unsafe requests without origin or referer",
  () => {
    const request =
      createRequest();


    const response =
      createResponse();


    let nextCalled =
      false;


    originProtection(
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