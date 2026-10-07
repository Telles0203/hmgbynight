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
  "Background editor is split into focused modules",
  () => {
    const files = [
      "frontend/src/js/main/character/creation/form/characterCreationBackgroundForm.js",
      "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundCatalog.js",
      "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundRows.js",
      "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundPicker.js",
      "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundProgress.js",
      "frontend/src/js/main/character/creation/actions/characterCreationBackgroundActions.js",
      "frontend/src/js/main/character/view/sheet/characterSheetBackgrounds.js",
    ];


    files.forEach(
      assertBelowEightHundredLines
    );
  }
);


test(
  "Background editor uses the canonical catalog instead of free text",
  () => {
    const form =
      readFile(
        "frontend/src/js/main/character/creation/form/characterCreationBackgroundForm.js"
      );


    const picker =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundPicker.js"
      );


    assert.equal(
      form.includes(
        "createBackgroundPicker"
      ),
      true
    );


    assert.equal(
      picker.includes(
        "getSelectableBackgroundOptions"
      ),
      true
    );


    assert.equal(
      picker.includes(
        "data-creation-background-choice"
      ),
      true
    );


    assert.equal(
      picker.includes(
        'type="text"'
      ),
      false
    );
  }
);


test(
  "Background editor exposes level controls and maximum",
  () => {
    const rows =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundRows.js"
      );


    const progress =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundProgress.js"
      );


    assert.equal(
      rows.includes(
        'data-character-creation-background-action="decrease"'
      ),
      true
    );


    assert.equal(
      rows.includes(
        'data-character-creation-background-action="increase"'
      ),
      true
    );


    assert.equal(
      progress.includes(
        "backgroundMaximum"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "refreshCharacterCreationBackgroundEditor"
      ),
      true
    );
  }
);


test(
  "Background editor tracks creation pool and Free Trait extras",
  () => {
    const form =
      readFile(
        "frontend/src/js/main/character/creation/form/characterCreationBackgroundForm.js"
      );


    const progress =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundProgress.js"
      );


    assert.equal(
      form.includes(
        "data-creation-background-points"
      ),
      true
    );


    assert.equal(
      form.includes(
        "data-creation-background-free-trait-cost"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "freeTraitCost"
      ),
      true
    );
  }
);


test(
  "Influence is reserved for its dedicated section",
  () => {
    const catalog =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundCatalog.js"
      );


    const picker =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundPicker.js"
      );


    assert.equal(
      catalog.includes(
        '===\n        "standard"'
      ),
      true
    );


    assert.equal(
      picker.includes(
        "Influence será configurada separadamente na seção Influências."
      ),
      true
    );
  }
);


test(
  "character creation form uses dedicated Background editor",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/characterCreationForm.js"
      );


    assert.equal(
      source.includes(
        "createBackgroundCreationEditor"
      ),
      true
    );


    assert.equal(
      source.includes(
        "readBackgroundCreationSection"
      ),
      true
    );


    assert.equal(
      source.includes(
        'mapName:\n          "backgrounds"'
      ),
      false
    );
  }
);
