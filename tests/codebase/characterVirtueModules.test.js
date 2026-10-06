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


const controllerPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/characterVirtues.js"
  );


const viewPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/virtues/characterVirtueView.js"
  );


test(
  "character Virtue controller is split into smaller modules",
  () => {
    const source =
      fs.readFileSync(
        controllerPath,
        "utf8"
      );


    const lines =
      source.split(
        "\n"
      ).length;


    assert.equal(
      lines < 800,
      true
    );


    assert.equal(
      source.includes(
        "./virtues/characterVirtueDraftStore.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./virtues/characterVirtueProgress.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./virtues/characterVirtueView.js"
      ),
      true
    );
  }
);


test(
  "Virtue view warns about unused creation points",
  () => {
    const source =
      fs.readFileSync(
        viewPath,
        "utf8"
      );


    assert.equal(
      source.includes(
        "character-virtue-points-warning"
      ),
      true
    );


    assert.equal(
      source.includes(
        "Você ainda possui"
      ),
      true
    );


    assert.equal(
      source.includes(
        "pontos de Virtudes para distribuir"
      ),
      true
    );
  }
);