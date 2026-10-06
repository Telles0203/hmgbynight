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


const routesPath =
  path.resolve(
    __dirname,
    "../../backend/routes/characterRoutes.js"
  );


const editControllerPath =
  path.resolve(
    __dirname,
    "../../backend/controllers/character/characterEditController.js"
  );


test(
  "character editing routes include title and clan",
  () => {
    const source =
      fs.readFileSync(
        routesPath,
        "utf8"
      );


    assert.equal(
      source.includes(
        "/:characterId/title"
      ),
      true
    );


    assert.equal(
      source.includes(
        "/:characterId/clan"
      ),
      true
    );
  }
);


test(
  "character edit controller is split into smaller modules",
  () => {
    const source =
      fs.readFileSync(
        editControllerPath,
        "utf8"
      );


    const lines =
      source.split(
        "\n"
      ).length;


    assert.equal(
      lines < 200,
      true
    );


    assert.equal(
      source.includes(
        "./edit/characterBasicEditController"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./edit/characterArchetypeEditController"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./edit/characterVirtueEditController"
      ),
      true
    );
  }
);