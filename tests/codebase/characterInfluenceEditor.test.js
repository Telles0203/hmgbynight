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
  "Influence editor is split into focused modules",
  () => {
    [
      "frontend/src/js/main/character/creation/form/characterCreationInfluenceForm.js",
      "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceCatalog.js",
      "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceRows.js",
      "frontend/src/js/main/character/creation/form/influence/characterCreationInfluencePicker.js",
      "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceProgress.js",
      "frontend/src/js/main/character/creation/actions/characterCreationInfluenceActions.js",
      "frontend/src/js/main/character/view/sheet/characterSheetInfluences.js",
      "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundAllocation.js",
    ].forEach(
      assertBelowEightHundredLines
    );
  }
);


test(
  "Influence uses a dedicated creation field",
  () => {
    const form =
      readFile(
        "frontend/src/js/main/character/creation/characterCreationForm.js"
      );


    const rules =
      readFile(
        "backend/rules/vampire/lotnr/ruleset.js"
      );


    const payload =
      readFile(
        "backend/controllers/character/edit/characterCreationPayload.js"
      );


    assert.equal(
      form.includes(
        '"influences"'
      ),
      true
    );


    assert.equal(
      rules.includes(
        "influences:"
      ),
      true
    );


    assert.equal(
      payload.includes(
        "source.influences"
      ),
      true
    );
  }
);


test(
  "Backgrounds and Influences share one creation allocation",
  () => {
    const allocation =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundAllocation.js"
      );


    const backend =
      readFile(
        "backend/rules/vampire/lotnr/allocation/disciplineBackgroundRules.js"
      );


    assert.equal(
      allocation.includes(
        "background::"
      ),
      true
    );


    assert.equal(
      allocation.includes(
        "influence::"
      ),
      true
    );


    assert.equal(
      backend.includes(
        "backgroundLevels +"
      ),
      true
    );


    assert.equal(
      backend.includes(
        "influenceLevels"
      ),
      true
    );
  }
);


test(
  "Influence sheet replaces the static placeholder",
  () => {
    const creation =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    const influence =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetInfluences.js"
      );


    assert.equal(
      creation.includes(
        "createCharacterInfluenceContent"
      ),
      true
    );


    assert.equal(
      creation.includes(
        'section:\n              "influences"'
      ),
      true
    );


    assert.equal(
      influence.includes(
        "Pool compartilhado com Antecedentes."
      ),
      true
    );


    assert.equal(
      influence.includes(
        "is-free-trait-spend"
      ),
      true
    );
  }
);
