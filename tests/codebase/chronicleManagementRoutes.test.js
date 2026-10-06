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
    "../../backend/routes/houseRoutes.js"
  );


test(
  "Chronicle management routes are registered",
  () => {
    const source =
      fs.readFileSync(
        routesPath,
        "utf8"
      );


    const expectedRoutes = [
      "/:houseId/management",
      "/:houseId/characters/:characterId/approve",
      "/:houseId/characters/:characterId/reject",
      "/:houseId/members/:memberId/role",
    ];


    for (
      const route
      of expectedRoutes
    ) {
      assert.equal(
        source.includes(
          route
        ),
        true,
        `Missing Chronicle route: ${route}`
      );
    }
  }
);


test(
  "Chronicle updates use current Mongoose returnDocument option",
  () => {
    const controllerPath =
      path.resolve(
        __dirname,
        "../../backend/controllers/chronicle/chronicleManagementController.js"
      );


    const source =
      fs.readFileSync(
        controllerPath,
        "utf8"
      );


    assert.equal(
      /\bnew\s*:\s*true\b/.test(
        source
      ),
      false
    );


    assert.equal(
      source.includes(
        "returnDocument"
      ),
      true
    );
  }
);