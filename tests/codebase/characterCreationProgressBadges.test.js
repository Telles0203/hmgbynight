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
  "Discipline sheet exposes creation progress badge",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetDisciplines.js"
      );


    assert.equal(
      source.includes(
        "normalizeDisciplineProgress"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createDisciplineProgress"
      ),
      true
    );


    assert.equal(
      source.includes(
        "rounded-pill"
      ),
      true
    );


    assert.equal(
      source.includes(
        "totalLevels"
      ),
      true
    );
  }
);


test(
  "Background sheet exposes creation progress badge",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetBackgrounds.js"
      );


    assert.equal(
      source.includes(
        "normalizeBackgroundProgress"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createBackgroundProgress"
      ),
      true
    );


    assert.equal(
      source.includes(
        "rounded-pill"
      ),
      true
    );


    assert.equal(
      source.includes(
        "totalLevels"
      ),
      true
    );
  }
);


test(
  "creation sheet passes validation progress to Disciplines and Backgrounds",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      source.includes(
        "sections.disciplines"
      ),
      true
    );


    assert.equal(
      source.includes(
        "sections.backgrounds"
      ),
      true
    );
  }
);
