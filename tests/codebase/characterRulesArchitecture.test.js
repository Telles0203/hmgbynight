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


const rulesDirectory =
  path.resolve(
    __dirname,
    "../../backend/rules/vampire/lotnr"
  );


const facadePath =
  path.resolve(
    __dirname,
    "../../backend/rules/vampire/lawsOfTheNightRevised.js"
  );


const virtuesPath =
  path.resolve(
    __dirname,
    "../../backend/data/vampire/virtues.js"
  );


test(
  "Laws of the Night rules are split into focused modules",
  () => {
    const expectedFiles = [
      "ruleset.js",
      "catalogs.js",
      "allocationRules.js",
      "derivedRules.js",
      "freeTraits.js",
      "validation.js",
      "index.js",
    ];


    expectedFiles.forEach(
      (
        file
      ) => {
        const fullPath =
          path.join(
            rulesDirectory,
            file
          );


        assert.equal(
          fs.existsSync(
            fullPath
          ),
          true
        );


        const lineCount =
          fs
            .readFileSync(
              fullPath,
              "utf8"
            )
            .split(
              "\n"
            )
            .length;


        assert.equal(
          lineCount <
            800,
          true
        );
      }
    );
  }
);


test(
  "legacy ruleset module remains a compatibility facade",
  () => {
    const source =
      fs.readFileSync(
        facadePath,
        "utf8"
      );


    assert.equal(
      source.includes(
        'require(\n    "./lotnr"'
      ),
      true
    );
  }
);


test(
  "Virtue budget reads centralized rules without circular facade dependency",
  () => {
    const source =
      fs.readFileSync(
        virtuesPath,
        "utf8"
      );


    assert.equal(
      source.includes(
        "../../rules/vampire/lotnr/ruleset"
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