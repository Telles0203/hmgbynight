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


const root =
  path.resolve(
    __dirname,
    "../.."
  );


function readFile(
  relativePath
) {
  return fs.readFileSync(
    path.join(
      root,
      relativePath
    ),
    "utf8"
  );
}


function assertBelowEightHundredLines(
  relativePath
) {
  const source =
    readFile(
      relativePath
    );


  const lines =
    source
      .split(
        /\r?\n/
      )
      .length;


  assert.equal(
    lines <
      800,
    true,
    `${relativePath} possui ${lines} linhas.`
  );


  return source;
}


test(
  "Background catalog lives in a focused data module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/data/vampire/backgrounds.js"
      );


    assert.equal(
      source.includes(
        "BACKGROUND_OPTIONS"
      ),
      true
    );


    assert.equal(
      source.includes(
        "INFLUENCE_AREAS"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getCoreBackgrounds"
      ),
      true
    );


    assert.equal(
      source.includes(
        "requiresNarratorApproval"
      ),
      true
    );
  }
);


test(
  "rules catalog delegates Background validation to Background data",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/catalogs.js"
      );


    assert.equal(
      source.includes(
        "../../../data/vampire/backgrounds"
      ),
      true
    );


    assert.equal(
      source.includes(
        "isCoreBackground"
      ),
      true
    );
  }
);


test(
  "character options expose Background metadata and rules",
  () => {
    const backend =
      assertBelowEightHundredLines(
        "backend/controllers/character/characterReadController.js"
      );


    const frontend =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/characterOptions.js"
      );


    assert.equal(
      backend.includes(
        "getCoreBackgrounds"
      ),
      true
    );


    assert.equal(
      backend.includes(
        "backgroundRules:"
      ),
      true
    );


    assert.equal(
      frontend.includes(
        "data.backgroundRules"
      ),
      true
    );


    assert.equal(
      frontend.includes(
        "maximumPerBackground"
      ),
      true
    );
  }
);
