const fs = require(
  "fs"
);

const path = require(
  "path"
);

const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const accountControllerPath =
  path.resolve(
    __dirname,
    "../../backend/controllers/accountController.js"
  );


test(
  "account updates use the current Mongoose returnDocument option",
  () => {
    const source =
      fs.readFileSync(
        accountControllerPath,
        "utf8"
      );


    assert.equal(
      /\bnew\s*:\s*true\b/.test(
        source
      ),
      false
    );


    assert.equal(
      /returnDocument\s*:\s*[\r\n\s]*["']after["']/.test(
        source
      ),
      true
    );
  }
);