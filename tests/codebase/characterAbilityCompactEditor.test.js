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
  "Ability rows expose compact and expanded states",
  () => {
    const rows =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    assert.equal(
      rows.includes(
        "data-creation-ability-summary"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "data-creation-ability-editor"
      ),
      true
    );


    assert.equal(
      rows.includes(
        'data-character-creation-ability-row-action="edit"'
      ),
      true
    );


    assert.equal(
      rows.includes(
        'data-character-creation-ability-row-action="conclude"'
      ),
      true
    );
  }
);


test(
  "Ability row state keeps only one expanded row",
  () => {
    const state =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRowState.js"
      );


    assert.equal(
      state.includes(
        "collapseCharacterCreationAbilityRows"
      ),
      true
    );


    assert.equal(
      state.includes(
        "openCharacterCreationAbilityRow"
      ),
      true
    );


    assert.equal(
      state.includes(
        "concludeCharacterCreationAbilityRow"
      ),
      true
    );


    assert.equal(
      state
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
  "Ability specialization uses normal text styling",
  () => {
    const css =
      readFile(
        "frontend/src/css/characterCreationSheet.css"
      );


    const sheet =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetAbilities.js"
      );


    assert.equal(
      css.includes(
        "font-style: normal"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        '<span class="character-creation-specialization">'
      ),
      true
    );
  }
);
