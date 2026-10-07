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
    source.split(
      /\r?\n/
    ).length;


  assert.equal(
    lines <
      800,
    true,
    `${relativePath} possui ${lines} linhas.`
  );


  return source;
}


test(
  "Ability editor uses focused catalog-backed modules",
  () => {
    const abilityForm =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAbilityForm.js"
      );


    const catalog =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityCatalog.js"
      );


    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    const progress =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityProgress.js"
      );


    const data =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/data/abilityCatalog.js"
      );


    assert.equal(
      abilityForm.includes(
        "./ability/characterCreationAbilityCatalog.js"
      ),
      true
    );


    assert.equal(
      catalog.includes(
        "getAbilityCreationRules"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-key"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-focus"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-custom-focus"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-specialization"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "data-creation-ability-points"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "data-creation-specialization-free-trait-cost"
      ),
      true
    );


    assert.equal(
      data.includes(
        "getAbilityDisplayLabel"
      ),
      true
    );
  }
);


test(
  "Ability sheet exposes creation progress and Free Trait spending",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetAbilities.js"
      );


    assert.equal(
      source.includes(
        "createCharacterAbilityContent"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createCostNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getAbilityDisplayLabel"
      ),
      true
    );


    assert.equal(
      source.includes(
        "character-creation-specialization"
      ),
      true
    );


    assert.equal(
      source.includes(
        "specializationFreeTraitCost"
      ),
      true
    );
  }
);


test(
  "Ability options and focus rules come from the backend",
  () => {
    const abilities =
      readFile(
        "backend/data/vampire/abilities.js"
      );


    const focus =
      readFile(
        "backend/data/vampire/abilityFocus.js"
      );


    const readController =
      readFile(
        "backend/controllers/character/characterReadController.js"
      );


    assert.equal(
      abilities.includes(
        "abilityRequiresFocus"
      ),
      true
    );


    assert.equal(
      abilities.includes(
        "focusOptions"
      ),
      true
    );


    assert.equal(
      focus.includes(
        "ABILITY_FOCUS_OPTIONS"
      ),
      true
    );


    assert.equal(
      readController.includes(
        "specializationFreeTraitCost"
      ),
      true
    );
  }
);
