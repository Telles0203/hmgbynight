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


    const creationForm =
      readFile(
        "frontend/src/js/main/character/creation/characterCreationForm.js"
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
      progress.includes(
        "data-creation-ability-points"
      ),
      true
    );


    assert.equal(
      rows.includes(
        'type="number"'
      ),
      false
    );


    assert.equal(
      creationForm.includes(
        "./form/characterCreationAbilityForm.js"
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
        "createFreeTraitCostNotice"
      ),
      true
    );
  }
);


test(
  "Ability options and creation rules come from the backend",
  () => {
    const readController =
      readFile(
        "backend/controllers/character/characterReadController.js"
      );


    const frontendOptions =
      readFile(
        "frontend/src/js/main/character/characterOptions.js"
      );


    assert.equal(
      readController.includes(
        "getCoreAbilities"
      ),
      true
    );


    assert.equal(
      readController.includes(
        "abilityRules"
      ),
      true
    );


    assert.equal(
      frontendOptions.includes(
        "data.abilities"
      ),
      true
    );


    assert.equal(
      frontendOptions.includes(
        "data.abilityRules"
      ),
      true
    );
  }
);
