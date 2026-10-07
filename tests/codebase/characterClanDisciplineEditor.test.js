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
  "Discipline editor consumes automatic clan rules",
  () => {
    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationDisciplineForm.js"
      );


    const catalog =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineCatalog.js"
      );


    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineRows.js"
      );


    const progress =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineProgress.js"
      );


    const outside =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineOutside.js"
      );


    assert.equal(
      form.includes(
        "./discipline/characterCreationDisciplineCatalog.js"
      ),
      true
    );


    assert.equal(
      form.includes(
        "./discipline/characterCreationDisciplineRows.js"
      ),
      true
    );


    assert.equal(
      form.includes(
        "./discipline/characterCreationDisciplineProgress.js"
      ),
      true
    );


    assert.equal(
      catalog.includes(
        "getFixedClanDisciplines"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-discipline-key"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-character-creation-discipline-action"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "adjustCharacterCreationDisciplineLevel"
      ),
      true
    );


    assert.equal(
      outside.includes(
        "createOutsideDisciplinePicker"
      ),
      true
    );


    assert.equal(
      outside.includes(
        "addOutsideDiscipline"
      ),
      true
    );
  }
);


test(
  "clan rules have a frontend catalog module",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/data/clanRuleCatalog.js"
      );


    assert.equal(
      source.includes(
        "getCharacterClanRule"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getFixedClanDisciplines"
      ),
      true
    );
  }
);


test(
  "Discipline rule metadata comes from the backend",
  () => {
    const backend =
      readFile(
        "backend/controllers/character/characterReadController.js"
      );


    const frontend =
      readFile(
        "frontend/src/js/main/character/characterOptions.js"
      );


    assert.equal(
      backend.includes(
        "disciplineRules:"
      ),
      true
    );


    assert.equal(
      frontend.includes(
        "data.disciplineRules"
      ),
      true
    );
  }
);
