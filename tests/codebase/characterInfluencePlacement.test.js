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
  "Influences are rendered immediately after Backgrounds",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    const backgrounds =
      source.indexOf(
        'title:\n              "Antecedentes"'
      );


    const influences =
      source.indexOf(
        'title:\n              "Influências"'
      );


    const merits =
      source.indexOf(
        'title:\n              "Qualidades / Defeitos"'
      );


    assert.notEqual(
      backgrounds,
      -1
    );


    assert.notEqual(
      influences,
      -1
    );


    assert.notEqual(
      merits,
      -1
    );


    assert.equal(
      backgrounds <
        influences,
      true
    );


    assert.equal(
      influences <
        merits,
      true
    );
  }
);


test(
  "Background and Influence display uses draft creation when available",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      source.includes(
        "sharedBackgroundCreation"
      ),
      true
    );


    assert.equal(
      source.includes(
        "character?.draftCreation ||"
      ),
      true
    );


    assert.equal(
      source.includes(
        "sharedBackgroundState"
      ),
      true
    );


    assert.equal(
      source.includes(
        "sharedBackgroundSections"
      ),
      true
    );


    assert.equal(
      source.includes(
        "sharedBackgroundSpending"
      ),
      true
    );
  }
);


test(
  "Influence section is no longer a static placeholder",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      source.includes(
        'createStaticGroup(\n            "Influências"'
      ),
      false
    );


    assert.equal(
      source.includes(
        "createCharacterInfluenceContent"
      ),
      true
    );
  }
);
