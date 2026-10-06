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


const charactersPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/characters.js"
  );


const cardPath =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/view/characterCard.js"
  );


test(
  "character list controller stays below eight hundred lines",
  () => {
    const source =
      fs.readFileSync(
        charactersPath,
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
        "./view/characterCard.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./characterCreationNotice.js"
      ),
      true
    );
  }
);


test(
  "character card renders separate sheet and Chronicle statuses",
  () => {
    const source =
      fs.readFileSync(
        cardPath,
        "utf8"
      );


    assert.equal(
      source.includes(
        "data-character-sheet-status"
      ),
      true
    );


    assert.equal(
      source.includes(
        "data-character-chronicle-status"
      ),
      true
    );


    assert.equal(
      source.includes(
        "PONTOS DE ATENÇÃO"
      ),
      true
    );


    assert.equal(
      source.includes(
        "Ficha aguardando distribuição inicial de pontos"
      ),
      true
    );


    assert.equal(
      source.includes(
        "CRÔNICA VINCULADA"
      ),
      true
    );
  }
);