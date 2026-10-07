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
  "Ability sheet exposes clan grants",
  () => {
    const sheet =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetAbilities.js"
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


    assert.equal(
      sheet.includes(
        "character-creation-clan-grant-badge"
      ),
      true
    );
  }
);


test(
  "Ability editor uses clan grants as minimum effective levels",
  () => {
    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAbilityForm.js"
      );


    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    const reader =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRead.js"
      );


    const progress =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityProgress.js"
      );


    const freeTraits =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityFreeTraits.js"
      );


    const effective =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityEffective.js"
      );


    assert.equal(
      form.includes(
        "getFixedClanAbilityGrants"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-grant"
      ),
      true
    );


    assert.equal(
      reader.includes(
        "getPurchasedAbilityLevel"
      ),
      true
    );


    assert.equal(
      reader.includes(
        "readAbilityMap"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "getAbilityRowGrantLevel"
      ),
      true
    );


    assert.equal(
      freeTraits.includes(
        "creationAbilityGrant"
      ),
      true
    );


    assert.equal(
      freeTraits.includes(
        "getAbilityRowGrantLevel"
      ),
      true
    );


    assert.equal(
      effective.includes(
        "createEffectiveAbilityRows"
      ),
      true
    );
  }
);
