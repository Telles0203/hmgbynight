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
  "out-of-clan Discipline picker uses backend Discipline options",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineOutside.js"
      );


    assert.equal(
      source.includes(
        "options"
      ),
      true
    );


    assert.equal(
      source.includes(
        "disciplines"
      ),
      true
    );


    assert.equal(
      source.includes(
        "getUsedDisciplineKeys"
      ),
      true
    );


    assert.equal(
      source.includes(
        "addOutsideDiscipline"
      ),
      true
    );


    assert.equal(
      source.includes(
        "removeOutsideDiscipline"
      ),
      true
    );
  }
);


test(
  "outside Discipline rows expose Narrator approval warning",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineRows.js"
      );


    const sheet =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetDisciplines.js"
      );


    assert.equal(
      rows.includes(
        "OUT_OF_CLAN_DISCIPLINE_APPROVAL_MESSAGE"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "character-sheet-warning-inline"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "data-bs-toggle=\"popover\""
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "Aprovação da Narração"
      ),
      true
    );
  }
);


test(
  "clan Discipline rows cannot be removed",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/discipline/characterCreationDisciplineRows.js"
      );


    assert.equal(
      rows.includes(
        "data-character-creation-remove-outside-discipline"
      ),
      true
    );


    assert.equal(
      rows.includes(
        'clan\n          ? ""'
      ),
      true
    );
  }
);


test(
  "Discipline click actions live in a focused module",
  () => {
    const editor =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/characterCreationEditor.js"
      );


    const actions =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/actions/characterCreationDisciplineActions.js"
      );


    assert.equal(
      editor.includes(
        "handleCharacterCreationDisciplineActionClick"
      ),
      true
    );


    assert.equal(
      editor.includes(
        "addOutsideDisciplineButton"
      ),
      false
    );


    assert.equal(
      actions.includes(
        "addOutsideDiscipline"
      ),
      true
    );


    assert.equal(
      actions.includes(
        "removeOutsideDiscipline"
      ),
      true
    );


    assert.equal(
      actions.includes(
        "adjustCharacterCreationDisciplineLevel"
      ),
      true
    );
  }
);
