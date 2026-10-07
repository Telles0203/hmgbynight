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


test(
  "clan rule module remains focused and below eight hundred lines",
  () => {
    const source =
      readFile(
        "backend/rules/vampire/lotnr/clanRules.js"
      );


    assert.equal(
      source
        .split(
          /\r?\n/
        )
        .length <
        800,
      true
    );


    assert.equal(
      source.includes(
        "CLAN_RULES"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getClanRule"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getClanRuleCoverage"
      ),
      true
    );
  }
);


test(
  "catalogs consume clan Disciplines from the clan rule registry",
  () => {
    const source =
      readFile(
        "backend/rules/vampire/lotnr/catalogs.js"
      );


    assert.equal(
      source.includes(
        'require(\n  "./clanRules"\n)'
      ),
      true
    );


    assert.equal(
      source.includes(
        "assamite:"
      ),
      false
    );


    assert.equal(
      source.includes(
        "getClanDisciplines"
      ),
      true
    );
  }
);


test(
  "character options expose clan rules to the frontend",
  () => {
    const backend =
      readFile(
        "backend/controllers/character/characterReadController.js"
      );


    const frontend =
      readFile(
        "frontend/src/js/main/character/characterOptions.js"
      );


    assert.equal(
      backend.includes(
        "getAllClanRules"
      ),
      true
    );


    assert.equal(
      backend.includes(
        "clanRules:"
      ),
      true
    );


    assert.equal(
      frontend.includes(
        "data.clanRules"
      ),
      true
    );
  }
);
