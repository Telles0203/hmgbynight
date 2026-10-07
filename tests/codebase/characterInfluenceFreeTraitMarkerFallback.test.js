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
  "shared Background allocation prefers Influence when rebuilding missing purchase markers",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundAllocation.js"
      );


    const valuesFunctionStart =
      source.indexOf(
        "export function getBackgroundAllocationValues"
      );


    const spentFunctionStart =
      source.indexOf(
        "export function getBackgroundAllocationSpent"
      );


    assert.notEqual(
      valuesFunctionStart,
      -1
    );


    assert.notEqual(
      spentFunctionStart,
      -1
    );


    const valuesFunction =
      source.slice(
        valuesFunctionStart,
        spentFunctionStart
      );


    const influencePosition =
      valuesFunction.indexOf(
        "normalizeLevelMap(\n      influences"
      );


    const backgroundPosition =
      valuesFunction.indexOf(
        "normalizeLevelMap(\n      backgrounds"
      );


    assert.notEqual(
      influencePosition,
      -1
    );


    assert.notEqual(
      backgroundPosition,
      -1
    );


    assert.equal(
      influencePosition <
        backgroundPosition,
      true
    );
  }
);


test(
  "Influence editor marks purchased levels with Free Trait class",
  () => {
    const progress =
      readFile(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceProgress.js"
      );


    assert.equal(
      progress.includes(
        "creationFreeTraitLevel"
      ),
      true
    );


    assert.equal(
      progress.includes(
        '"is-free-trait-spend"'
      ),
      true
    );


    assert.equal(
      progress.includes(
        "createInfluenceAllocationKey"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "preferredRow"
      ),
      true
    );
  }
);


test(
  "Influence sheet renders saved Free Trait purchases in red",
  () => {
    const sheet =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetInfluences.js"
      );


    const css =
      readFile(
        "frontend/src/css/characterCreationSpending.css"
      );


    assert.equal(
      sheet.includes(
        "getBackgroundAllocationPurchaseCounts"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "is-free-trait-spend"
      ),
      true
    );


    assert.equal(
      css.includes(
        ".character-influence-sheet-row.is-free-trait-spend"
      ),
      true
    );


    assert.equal(
      css.includes(
        ".character-creation-influence-row.is-free-trait-spend"
      ),
      true
    );
  }
);
