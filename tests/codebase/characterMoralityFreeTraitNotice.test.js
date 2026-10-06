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


const sheetPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/view/sheet/characterSheetCreation.js"
  );


const resourcesPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/view/sheet/characterSheetCreationResources.js"
  );


function readFile(
  file
) {
  return fs.readFileSync(
    file,
    "utf8"
  );
}


test(
  "morality resource exposes Free Trait sacrifice gain",
  () => {
    const sheet =
      readFile(
        sheetPath
      );


    const resources =
      readFile(
        resourcesPath
      );


    assert.equal(
      sheet.includes(
        "moralitySacrifice"
      ),
      true
    );


    assert.equal(
      resources.includes(
        "createFreeTraitGainNotice"
      ),
      true
    );


    assert.equal(
      resources.includes(
        "Sacrifício da criação:"
      ),
      true
    );


    assert.equal(
      resources.includes(
        "character-free-trait-inline-gain"
      ),
      true
    );
  }
);