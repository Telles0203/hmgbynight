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
  "clan change recalculation lives in a focused backend module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/controllers/character/edit/characterClanDerivedSync.js"
      );


    assert.equal(
      source.includes(
        "buildClanDerivedCreation"
      ),
      true
    );


    assert.equal(
      source.includes(
        "validateCharacterCreation"
      ),
      true
    );
  }
);


test(
  "only clan update recalculates clan derived creation",
  () => {
    const source =
      assertBelowEightHundredLines(
        "backend/controllers/character/edit/characterBasicEditController.js"
      );


    const textFieldSection =
      source.slice(
        source.indexOf(
          "async function updateTextField"
        ),
        source.indexOf(
          "async function updateCharacterConcept"
        )
      );


    const clanSection =
      source.slice(
        source.indexOf(
          "async function updateCharacterClan"
        ),
        source.indexOf(
          "module.exports"
        )
      );


    assert.equal(
      textFieldSection.includes(
        "buildClanDerivedCreation"
      ),
      false
    );


    assert.equal(
      textFieldSection.includes(
        "effectiveCreation"
      ),
      false
    );


    assert.equal(
      clanSection.includes(
        "buildClanDerivedCreation"
      ),
      true
    );


    assert.equal(
      clanSection.includes(
        "effectiveCreation"
      ),
      true
    );


    assert.equal(
      clanSection.includes(
        "getEffectiveCharacterForEditing"
      ),
      true
    );
  }
);


test(
  "frontend clan rules use the effective draft clan",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/data/clanRuleCatalog.js"
      );


    assert.equal(
      source.includes(
        "getEffectiveCharacterClan"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".sheetDraft"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".changes"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".clan"
      ),
      true
    );
  }
);


test(
  "frontend applies clan derived creation immediately",
  () => {
    const state =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/identity/characterClanDerivedState.js"
      );


    const editor =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/characterIdentityEdit.js"
      );


    assert.equal(
      state.includes(
        "refreshCharacterCreationView"
      ),
      true
    );


    assert.equal(
      state.includes(
        "effectiveCreation"
      ),
      true
    );


    assert.equal(
      editor.includes(
        "applyClanDerivedSaveResult"
      ),
      true
    );
  }
);
