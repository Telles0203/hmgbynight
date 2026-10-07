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
  "clan Negative Trait display expands repeated Traits",
  () => {
    const form =
      readFile(
        "frontend/src/js/main/character/creation/form/characterCreationClanNegativeTraits.js"
      );


    const sheet =
      readFile(
        "frontend/src/js/main/character/view/sheet/characterSheetNegativeTraits.js"
      );


    assert.equal(
      form.includes(
        "expandClanNegativeTraits"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "expandClanNegativeTraits"
      ),
      true
    );


    assert.equal(
      form.includes(
        "×"
      ),
      false
    );


    assert.equal(
      sheet.includes(
        "×"
      ),
      false
    );
  }
);
