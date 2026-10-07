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
  "Discipline sheet renders clan Disciplines even at zero",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetDisciplines.js"
      );


    assert.equal(
      source.includes(
        "getFixedClanDisciplines"
      ),
      true
    );


    assert.equal(
      source.includes(
        "character-discipline-clan-badge"
      ),
      true
    );


    assert.equal(
      source.includes(
        "entry.level"
      ),
      true
    );


    assert.equal(
      source
        .split(
          /\r?\n/
        )
        .length <
        800,
      true
    );
  }
);


test(
  "character creation sheet uses dedicated Discipline renderer",
  () => {
    const source =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      source.includes(
        "createCharacterDisciplineContent"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./characterSheetDisciplines.js"
      ),
      true
    );
  }
);
