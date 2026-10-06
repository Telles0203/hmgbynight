const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const {
  signAuthToken,
  verifyAuthToken,
  setAuthCookie,
  clearAuthCookie,
} = require(
  "../../backend/utils/authSession"
);


const ORIGINAL_JWT_SECRET =
  process.env.JWT_SECRET;

const ORIGINAL_NODE_ENV =
  process.env.NODE_ENV;


test.beforeEach(
  () => {
    process.env.JWT_SECRET =
      "bynight-test-secret-with-enough-random-content";

    process.env.NODE_ENV =
      "test";
  }
);


test.after(
  () => {
    if (
      typeof ORIGINAL_JWT_SECRET ===
      "undefined"
    ) {
      delete process.env.JWT_SECRET;

    } else {
      process.env.JWT_SECRET =
        ORIGINAL_JWT_SECRET;
    }


    if (
      typeof ORIGINAL_NODE_ENV ===
      "undefined"
    ) {
      delete process.env.NODE_ENV;

    } else {
      process.env.NODE_ENV =
        ORIGINAL_NODE_ENV;
    }
  }
);


test(
  "creates a minimal authentication token",
  () => {
    const token =
      signAuthToken({
        _id:
          "507f1f77bcf86cd799439011",

        authVersion:
          4,

        name:
          "Should not be stored",

        email:
          "should-not-be-stored@example.com",
      });


    const payload =
      verifyAuthToken(
        token
      );


    assert.equal(
      payload.sub,
      "507f1f77bcf86cd799439011"
    );


    assert.equal(
      payload.authVersion,
      4
    );


    assert.equal(
      payload.name,
      undefined
    );


    assert.equal(
      payload.email,
      undefined
    );
  }
);


test(
  "rejects a token signed with another secret",
  () => {
    const token =
      signAuthToken({
        _id:
          "507f1f77bcf86cd799439011",

        authVersion:
          1,
      });


    process.env.JWT_SECRET =
      "another-secret-used-only-for-this-test";


    assert.throws(
      () =>
        verifyAuthToken(
          token
        )
    );
  }
);


test(
  "sets the authentication cookie as HttpOnly",
  () => {
    let cookieData =
      null;


    const response = {
      cookie(
        name,
        value,
        options
      ) {
        cookieData = {
          name,
          value,
          options,
        };
      },
    };


    setAuthCookie(
      response,
      "test-token"
    );


    assert.ok(
      cookieData
    );


    assert.equal(
      cookieData.value,
      "test-token"
    );


    assert.equal(
      cookieData.options.httpOnly,
      true
    );


    assert.equal(
      cookieData.options.sameSite,
      "lax"
    );


    assert.equal(
      cookieData.options.path,
      "/"
    );
  }
);


test(
  "clears the authentication cookie using compatible options",
  () => {
    let clearData =
      null;


    const response = {
      clearCookie(
        name,
        options
      ) {
        clearData = {
          name,
          options,
        };
      },
    };


    clearAuthCookie(
      response
    );


    assert.ok(
      clearData
    );


    assert.equal(
      clearData.options.httpOnly,
      true
    );


    assert.equal(
      clearData.options.sameSite,
      "lax"
    );


    assert.equal(
      clearData.options.path,
      "/"
    );
  }
);