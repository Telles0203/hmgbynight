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


const virtuesPath =
  path.resolve(
    __dirname,
    "../../backend/data/vampire/virtues.js"
  );


const rulesPath =
  path.resolve(
    __dirname,
    "../../backend/rules/vampire/lawsOfTheNightRevised.js"
  );


const progressPath =
  path.resolve(
    __dirname,
    "../../backend/rules/characterCreation/characterCreationProgress.js"
  );


test(
  "Virtue creation budget comes from centralized rules",
  () => {
    const source =
      fs.readFileSync(
        virtuesPath,
        "utf8"
      );


    assert.equal(
      source.includes(
        "../../rules/vampire/lawsOfTheNightRevised"
      ),
      true
    );


    assert.equal(
      source.includes(
        "CHARACTER_CREATION_RULES"
      ),
      true
    );
  }
);


test(
  "character creation rules are separated from progress calculation",
  () => {
    const rules =
      fs.readFileSync(
        rulesPath,
        "utf8"
      );


    const progress =
      fs.readFileSync(
        progressPath,
        "utf8"
      );


    assert.equal(
      rules.includes(
        "Laws of the Night Revised Edition"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "./pointTracker"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "not_implemented"
      ),
      true
    );
  }
);