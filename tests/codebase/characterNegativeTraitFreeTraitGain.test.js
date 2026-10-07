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
  "Negative Trait gain lives in a focused frontend module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationNegativeTraitGain.js"
      );


    assert.equal(
      source.includes(
        "createNegativeTraitGainNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "refreshNegativeTraitGain"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createSavedNegativeTraitGainNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "character-free-trait-inline-gain"
      ),
      true
    );
  }
);


test(
  "Attribute editor displays voluntary Negative Trait Free Trait gain",
  () => {
    const form =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAttributeForm.js"
      );


    const actions =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationAttributeTraitActions.js"
      );


    assert.equal(
      form.includes(
        "createNegativeTraitGainNotice"
      ),
      true
    );


    assert.equal(
      actions.includes(
        "refreshNegativeTraitGain"
      ),
      true
    );
  }
);


test(
  "saved Negative Trait display exposes voluntary gain",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetNegativeTraits.js"
      );


    assert.equal(
      source.includes(
        "createSavedNegativeTraitGainNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "regular.length"
      ),
      true
    );
  }
);


test(
  "clan Negative Traits remain excluded from displayed Free Trait gain",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetNegativeTraits.js"
      );


    assert.equal(
      source.includes(
        "createSavedNegativeTraitGainNotice(\n      regular.length"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createSavedNegativeTraitGainNotice(\n      clan.length"
      ),
      false
    );
  }
);
