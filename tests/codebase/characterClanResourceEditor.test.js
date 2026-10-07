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
  "Background clan grants expose minimum levels",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundRows.js"
      );


    const progress =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundProgress.js"
      );


    assert.equal(
      rows.includes(
        "creationBackgroundGrant"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "Clã +"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "grantedLevel"
      ),
      true
    );
  }
);


test(
  "Influence clan grants expose minimum levels and choices",
  () => {
    const rows =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceRows.js"
      );


    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationInfluenceForm.js"
      );


    const choices =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanGrants.js"
      );


    assert.equal(
      rows.includes(
        "creationInfluenceGrant"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "Clã +"
      ),
      true
    );


    assert.equal(
      form.includes(
        "createClanInfluenceChoiceEditor"
      ),
      true
    );


    assert.equal(
      form.includes(
        "readClanInfluenceChoices"
      ),
      true
    );


    assert.equal(
      choices.includes(
        "data-creation-clan-background-influence-choice"
      ),
      true
    );
  }
);


test(
  "Background and Influence sheets render clan grants",
  () => {
    const backgrounds =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetBackgrounds.js"
      );


    const influences =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetInfluences.js"
      );


    assert.equal(
      backgrounds.includes(
        "grantedBackgrounds"
      ),
      true
    );


    assert.equal(
      backgrounds.includes(
        "Clã +"
      ),
      true
    );


    assert.equal(
      influences.includes(
        "grantedInfluences"
      ),
      true
    );


    assert.equal(
      influences.includes(
        "Clã +"
      ),
      true
    );
  }
);


test(
  "Ability editor resolves linked clan grants",
  () => {
    const abilities =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAbilityForm.js"
      );


    assert.equal(
      abilities.includes(
        "getResolvedClanAbilityGrants"
      ),
      true
    );


    assert.equal(
      abilities.includes(
        "createClanAbilityGrantSummary"
      ),
      true
    );
  }
);
