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
  "Free Trait purchase tracking lives in a focused frontend module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/freeTraits/characterCreationFreeTraitPurchases.js"
      );


    assert.equal(
      source.includes(
        "normalizeFreeTraitPurchaseOrder"
      ),
      true
    );


    assert.equal(
      source.includes(
        "reconcileFormFreeTraitPurchases"
      ),
      true
    );


    assert.equal(
      source.includes(
        "isInitialCreationLifecycle"
      ),
      true
    );
  }
);


test(
  "Ability Discipline and Background sheets render Free Trait markers",
  () => {
    [
      "frontend/src/js/main/character/view/sheet/characterSheetAbilities.js",
      "frontend/src/js/main/character/view/sheet/characterSheetDisciplines.js",
      "frontend/src/js/main/character/view/sheet/characterSheetBackgrounds.js",
    ].forEach(
      (
        file
      ) => {
        const source =
          assertBelowEightHundredLines(
            file
          );


        assert.equal(
          source.includes(
            "is-free-trait-spend"
          ),
          true
        );


        assert.equal(
          source.includes(
            "normalizeFreeTraitPurchaseOrder"
          ),
          true
        );
      }
    );
  }
);


test(
  "Free Trait purchase markers are hidden after initial creation",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      source.includes(
        '!==\n    "active"'
      ),
      true
    );


    assert.equal(
      source.includes(
        "showFreeTraitMarkers"
      ),
      true
    );
  }
);


test(
  "creation spending stylesheet covers all tracked pools",
  () => {
    const source =
      readFile(
        "frontend/src/css/characterCreationSpending.css"
      );


    assert.equal(
      source.includes(
        ".character-ability-sheet-row.is-free-trait-spend"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".character-discipline-sheet-row.is-free-trait-spend"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".character-background-sheet-row.is-free-trait-spend"
      ),
      true
    );
  }
);


test(
  "Ability Free Trait row tracking is split into a focused module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityFreeTraits.js"
      );


    assert.equal(
      source.includes(
        "reconcileAbilityFreeTraitRows"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getAbilityRowGrantLevel"
      ),
      true
    );


    assert.equal(
      source.includes(
        "is-free-trait-spend"
      ),
      true
    );
  }
);
