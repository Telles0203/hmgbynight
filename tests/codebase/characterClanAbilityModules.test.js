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
  "clan Ability grants live in a focused rules module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/clanAbilityGrants.js"
      );


    assert.equal(
      source.includes(
        "FIXED_CLAN_ABILITY_GRANTS"
      ),
      true
    );


    assert.equal(
      source.includes(
        "CLAN_ABILITY_CHOICE_GRANTS"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getFixedClanAbilityGrants"
      ),
      true
    );
  }
);


test(
  "Ability validation separates purchased and granted levels",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/allocation/attributeAbilityRules.js"
      );


    assert.equal(
      source.includes(
        "grantedAbilities"
      ),
      true
    );


    assert.equal(
      source.includes(
        "effectiveAbilities"
      ),
      true
    );


    assert.equal(
      source.includes(
        "effectiveTotalLevels"
      ),
      true
    );
  }
);


test(
  "Ability UI exposes clan grants without making them creation spending",
  () => {
    const grants =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityGrants.js"
      );


    const sheet =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetAbilities.js"
      );


    assert.equal(
      grants.includes(
        "Concedidas pelo clã"
      ),
      true
    );


    assert.equal(
      grants.includes(
        "character-creation-clan-grant-badge"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "grantedAbilities"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "entry.grantedLevel"
      ),
      true
    );
  }
);
