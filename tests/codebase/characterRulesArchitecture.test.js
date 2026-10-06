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


const allocationDirectory =
  path.resolve(
    rulesDirectory,
    "allocation"
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


function assertFileBelowEightHundredLines(
  file
) {
  assert.equal(
    fs.existsSync(
      file
    ),
    true,
    `Arquivo não encontrado: ${file}`
  );


  const lineCount =
    fs
      .readFileSync(
        file,
        "utf8"
      )
      .split(
        /\r?\n/
      )
      .length;


  assert.equal(
    lineCount <
      800,
    true,
    `${file} possui ${lineCount} linhas.`
  );
}


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
        assertFileBelowEightHundredLines(
          path.join(
            rulesDirectory,
            file
          )
        );
      }
    );


    [
      "allocationHelpers.js",
      "attributeAbilityRules.js",
      "disciplineBackgroundRules.js",
      "virtueAllocationRules.js",
    ].forEach(
      (
        file
      ) => {
        assertFileBelowEightHundredLines(
          path.join(
            allocationDirectory,
            file
          )
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


    assert.match(
      source,
      /require\s*\(\s*["']\.\/lotnr["']\s*\)/
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