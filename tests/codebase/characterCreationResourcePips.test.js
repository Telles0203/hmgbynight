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
  "creation resource pips live in a focused shared module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/resource/characterCreationResourcePips.js"
      );


    assert.equal(
      source.includes(
        "createCreationResourcePips"
      ),
      true
    );


    assert.equal(
      source.includes(
        "is-creation-sacrificed"
      ),
      true
    );


    assert.equal(
      source.includes(
        "is-creation-purchased"
      ),
      true
    );
  }
);


test(
  "Morality editor uses shared creation resource pips",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationMoralityForm.js"
      );


    assert.equal(
      source.includes(
        "createCreationResourcePips"
      ),
      true
    );


    assert.equal(
      source.includes(
        "base,"
      ),
      true
    );
  }
);


test(
  "Willpower editor marks purchased creation pips",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationWillpowerForm.js"
      );


    assert.equal(
      source.includes(
        "createCreationResourcePips"
      ),
      true
    );


    assert.equal(
      source.includes(
        "base:"
      ),
      true
    );


    assert.equal(
      source.includes(
        "start"
      ),
      true
    );


    assert.equal(
      source.includes(
        "showSacrificed:"
      ),
      true
    );


    assert.equal(
      source.includes(
        "false"
      ),
      true
    );
  }
);


test(
  "saved Morality and Willpower resources preserve creation markers",
  () => {
    const resources =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreationResources.js"
      );


    const sheet =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
      );


    assert.equal(
      resources.includes(
        "createCreationResourcePips"
      ),
      true
    );


    assert.equal(
      resources.includes(
        "moralityBase"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "createCreationResourcePips"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "willpowerStart"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "showFreeTraitMarkers"
      ),
      true
    );
  }
);


test(
  "creation resource markers use gain and spending colors",
  () => {
    const source =
      readFile(
        "frontend/src/css/characterCreationSpending.css"
      );


    assert.equal(
      source.includes(
        ".is-creation-sacrificed"
      ),
      true
    );


    assert.equal(
      source.includes(
        "#73d99a"
      ),
      true
    );


    assert.equal(
      source.includes(
        ".is-creation-purchased"
      ),
      true
    );


    assert.equal(
      source.includes(
        "#ff6b6b"
      ),
      true
    );
  }
);
