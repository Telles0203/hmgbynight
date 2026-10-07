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
  "Ability editor uses a focused catalog-backed module",
  () => {
    const abilityForm =
      readFile(
        "frontend/src/js/main/character/creation/form/characterCreationAbilityForm.js"
      );


    const creationForm =
      readFile(
        "frontend/src/js/main/character/creation/characterCreationForm.js"
      );


    assert.equal(
      abilityForm
        .split(
          /\r?\n/
        )
        .length <
        800,
      true
    );


    assert.equal(
      abilityForm.includes(
        "data-creation-ability-key"
      ),
      true
    );


    assert.equal(
      abilityForm.includes(
        "form-select"
      ),
      true
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
  "Ability options come from the backend catalog",
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
      frontendOptions.includes(
        "data.abilities"
      ),
      true
    );
  }
);
