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


const identityPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/characterIdentityEdit.js"
  );


const inlinePath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/characterInlineEdit.js"
  );


const basicControllerPath =
  path.resolve(
    __dirname,
    "../../backend/controllers/character/edit/characterBasicEditController.js"
  );


const archetypeControllerPath =
  path.resolve(
    __dirname,
    "../../backend/controllers/character/edit/characterArchetypeEditController.js"
  );


const virtueControllerPath =
  path.resolve(
    __dirname,
    "../../backend/controllers/character/edit/characterVirtueEditController.js"
  );


test(
  "character edit frontends are split below eight hundred lines",
  () => {
    const identity =
      fs.readFileSync(
        identityPath,
        "utf8"
      );


    const inline =
      fs.readFileSync(
        inlinePath,
        "utf8"
      );


    assert.equal(
      identity.split(
        "\n"
      ).length <
        800,
      true
    );


    assert.equal(
      inline.split(
        "\n"
      ).length <
        800,
      true
    );


    assert.equal(
      identity.includes(
        "./identity/characterIdentityView.js"
      ),
      true
    );


    assert.equal(
      inline.includes(
        "./inline/characterInlineView.js"
      ),
      true
    );
  }
);


test(
  "editable character controllers use shared draft persistence",
  () => {
    const files = [
      basicControllerPath,
      archetypeControllerPath,
      virtueControllerPath,
    ];


    files.forEach(
      (
        file
      ) => {
        const source =
          fs.readFileSync(
            file,
            "utf8"
          );


        assert.equal(
          source.includes(
            "persistCharacterChanges"
          ),
          true
        );
      }
    );
  }
);