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
  "character editing routes include identity fields",
  () => {
    const source =
      fs.readFileSync(
        routesPath,
        "utf8"
      );


    [
      "/:characterId/title",
      "/:characterId/clan",
      "/:characterId/morality-path",
    ].forEach(
      (
        route
      ) => {
        assert.equal(
          source.includes(
            route
          ),
          true
        );
      }
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
      lines <
        200,
      true
    );


    [
      "./edit/characterBasicEditController",
      "./edit/characterArchetypeEditController",
      "./edit/characterMoralityPathEditController",
      "./edit/characterVirtueEditController",
    ].forEach(
      (
        modulePath
      ) => {
        assert.equal(
          source.includes(
            modulePath
          ),
          true
        );
      }
    );
  }
);