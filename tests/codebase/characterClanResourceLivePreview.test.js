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
  "clan Influence live preview lives in a focused module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanPreview.js"
      );


    assert.equal(
      source.includes(
        "handleCharacterCreationInfluenceClanChoiceChange"
      ),
      true
    );


    assert.equal(
      source.includes(
        "resolveCharacterClanResourceGrants"
      ),
      true
    );


    assert.equal(
      source.includes(
        "readInfluences"
      ),
      true
    );


    assert.equal(
      source.includes(
        "refreshInfluencePicker"
      ),
      true
    );


    assert.equal(
      source.includes(
        "refreshCharacterCreationInfluenceEditor"
      ),
      true
    );
  }
);


test(
  "live preview resolves the character from the sheet",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanPreview.js"
      );


    assert.equal(
      source.includes(
        "getCharacterFromSelect"
      ),
      true
    );


    assert.equal(
      source.includes(
        'closest(\n      "[data-character-id]"'
      ),
      true
    );


    assert.equal(
      source.includes(
        "getCharacterById"
      ),
      true
    );
  }
);


test(
  "live preview listens directly for clan choice changes",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanPreview.js"
      );


    assert.equal(
      source.includes(
        "document.addEventListener"
      ),
      true
    );


    assert.equal(
      source.includes(
        '"change"'
      ),
      true
    );


    assert.equal(
      source.includes(
        "[data-creation-clan-background-influence-choice]"
      ),
      true
    );
  }
);


test(
  "live preview protects the maximum effective level",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanPreview.js"
      );


    assert.equal(
      source.includes(
        "findChoiceOverflow"
      ),
      true
    );


    assert.equal(
      source.includes(
        "effectiveLevel >\n      maximum"
      ),
      true
    );


    assert.equal(
      source.includes(
        "restorePreviousSelection"
      ),
      true
    );
  }
);


test(
  "clan choice editor stores the last applied preview value",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanGrants.js"
      );


    assert.equal(
      source.includes(
        "data-creation-clan-resource-choices"
      ),
      true
    );


    assert.equal(
      source.includes(
        "data-creation-clan-choice-preview-value"
      ),
      true
    );


    assert.equal(
      source.includes(
        "readClanInfluenceChoiceSelections"
      ),
      true
    );
  }
);


test(
  "character editor loads the autonomous clan preview module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/characterCreationEditor.js"
      );


    assert.equal(
      source.includes(
        'import "./form/influence/characterCreationInfluenceClanPreview.js";'
      ),
      true
    );


    assert.equal(
      source.includes(
        "handleCharacterCreationInfluenceClanChoiceChange("
      ),
      false
    );
  }
);
