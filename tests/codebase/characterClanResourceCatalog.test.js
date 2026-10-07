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
  "clan grant composition lives in a focused module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/clanRuleGrants.js"
      );


    assert.equal(
      source.includes(
        "getFixedClanResourceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getClanResourceChoiceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "backgroundInfluenceChoices"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createClanGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "cloneClanGrants"
      ),
      true
    );
  }
);


test(
  "clan rules remain below the module size limit",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/clanRules.js"
      );


    assert.equal(
      source.includes(
        "createClanGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "cloneClanGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "backgroundInfluenceGrants"
      ),
      true
    );
  }
);


test(
  "frontend clan catalog resolves resource grants",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/data/clanRuleCatalog.js"
      );


    assert.equal(
      source.includes(
        "getFixedClanBackgroundGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getFixedClanInfluenceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getClanBackgroundInfluenceChoiceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "resolveCharacterClanResourceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getResolvedClanAbilityGrants"
      ),
      true
    );
  }
);
