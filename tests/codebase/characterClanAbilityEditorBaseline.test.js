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
  "clan Ability levels are not persisted as purchased levels",
  () => {
    const effective =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityEffective.js"
      );


    const reader =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRead.js"
      );


    assert.equal(
      effective.includes(
        "effectiveLevel"
      ),
      true
    );


    assert.equal(
      effective.includes(
        "purchasedLevel"
      ),
      true
    );


    assert.equal(
      reader.includes(
        "getPurchasedAbilityLevel"
      ),
      true
    );
  }
);


test(
  "clan Ability row cannot be reduced below its grant",
  () => {
    const rows =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    const progress =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityProgress.js"
      );


    assert.equal(
      rows.includes(
        "normalizedLevel <=\n            minimum"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "level <=\n              minimum"
      ),
      true
    );


    assert.equal(
      progress.includes(
        "next <\n      minimum"
      ),
      true
    );
  }
);


test(
  "clan Ability row remains editable but cannot be removed",
  () => {
    const rows =
      readFile(
        "frontend/src/js/main/character/creation/form/ability/characterCreationAbilityRows.js"
      );


    assert.equal(
      rows.includes(
        'data-character-creation-ability-row-action="edit"'
      ),
      true
    );


    assert.equal(
      rows.includes(
        "!clanGranted"
      ),
      true
    );


    assert.equal(
      rows.includes(
        "Nível mínimo do clã"
      ),
      true
    );
  }
);
