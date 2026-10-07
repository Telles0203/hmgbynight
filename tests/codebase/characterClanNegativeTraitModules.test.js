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
  "clan Negative Traits use a focused rules module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/clanNegativeTraitGrants.js"
      );


    assert.equal(
      source.includes(
        "Repugnant"
      ),
      true
    );


    assert.equal(
      source.includes(
        "grantsFreeTraits"
      ),
      true
    );


    assert.equal(
      source.includes(
        "locked"
      ),
      true
    );
  }
);


test(
  "Free Trait calculation separates clan penalties",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/rules/vampire/lotnr/freeTraits.js"
      );


    assert.equal(
      source.includes(
        "grantedTotal"
      ),
      true
    );


    assert.equal(
      source.includes(
        "grantedFreeTraits"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getFixedClanNegativeTraitGrants"
      ),
      true
    );
  }
);


test(
  "attribute editor displays locked clan Negative Traits",
  () => {
    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAttributeForm.js"
      );


    const grants =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationClanNegativeTraits.js"
      );


    assert.equal(
      form.includes(
        "createClanNegativeTraitSummary"
      ),
      true
    );


    assert.equal(
      form.includes(
        "excludedValues"
      ),
      true
    );


    assert.equal(
      grants.includes(
        "Clã · bloqueado"
      ),
      true
    );
  }
);


test(
  "attribute sheet renders clan Negative Traits separately",
  () => {
    const attributes =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreationAttributes.js"
      );


    const negatives =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetNegativeTraits.js"
      );


    assert.equal(
      attributes.includes(
        "createCharacterNegativeTraitList"
      ),
      true
    );


    assert.equal(
      negatives.includes(
        "getFixedClanNegativeTraitGrants"
      ),
      true
    );


    assert.equal(
      negatives.includes(
        "Clã · bloqueado"
      ),
      true
    );
  }
);
