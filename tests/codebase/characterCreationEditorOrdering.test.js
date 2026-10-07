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
  "Ability editor opens existing rows alphabetically and adds new row first",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAbilityForm.js"
      );


    assert.equal(
      rows.includes(
        "getAbilityDisplayLabel"
      ),
      true
    );


    assert.equal(
      rows.includes(
        ".sort("
      ),
      true
    );


    assert.equal(
      form.includes(
        "container.prepend("
      ),
      true
    );
  }
);


test(
  "Background editor opens existing rows alphabetically and adds new row first",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundRows.js"
      );


    const picker =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundPicker.js"
      );


    assert.equal(
      rows.includes(
        "getBackgroundLabel"
      ),
      true
    );


    assert.equal(
      rows.includes(
        ".sort("
      ),
      true
    );


    assert.equal(
      picker.includes(
        "list.prepend("
      ),
      true
    );
  }
);


test(
  "Discipline editor opens existing rows alphabetically and adds new row first",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineRows.js"
      );


    const outside =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineOutside.js"
      );


    assert.equal(
      rows.includes(
        "getDisciplineLabel"
      ),
      true
    );


    assert.equal(
      rows.includes(
        ".sort("
      ),
      true
    );


    assert.equal(
      outside.includes(
        "list.prepend("
      ),
      true
    );
  }
);


test(
  "Discipline sheet displays Free Trait spending notice",
  () => {
    const disciplines =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetDisciplines.js"
      );


    const creation =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      disciplines.includes(
        "createDisciplineCostNotice"
      ),
      true
    );


    assert.equal(
      disciplines.includes(
        "character-free-trait-inline-cost"
      ),
      true
    );


    assert.equal(
      disciplines.includes(
        "disciplineFreeTraitCost"
      ),
      true
    );


    assert.equal(
      creation.includes(
        "freeTraitSpending"
      ),
      true
    );


    assert.equal(
      creation.includes(
        ".disciplines"
      ),
      true
    );
  }
);
