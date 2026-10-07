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


const file =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character/creation/form/characterCreationDisciplineForm.js"
  );


const source =
  fs.readFileSync(
    file,
    "utf8"
  );


test(
  "Discipline editor explains the creation level limit",
  () => {
    assert.equal(
      source.includes(
        "Limite na criação:"
      ),
      true
    );


    assert.equal(
      source.includes(
        "Níveis Intermediate e Advanced são adquiridos após a criação."
      ),
      true
    );


    assert.equal(
      source.includes(
        "createDisciplineCreationLimitNotice"
      ),
      true
    );
  }
);


test(
  "Discipline creation limit exposes its rulebook reference",
  () => {
    assert.equal(
      source.includes(
        "Referência: Laws of the Night Revised, p. 67."
      ),
      true
    );
  }
);


test(
  "Discipline limit notice uses backend rule maximum",
  () => {
    assert.equal(
      source.includes(
        "rules.maximum"
      ),
      true
    );


    assert.equal(
      source.includes(
        "data-discipline-maximum"
      ),
      true
    );
  }
);


test(
  "Discipline form remains below eight hundred lines",
  () => {
    const lines =
      source
        .split(
          /\r?\n/
        )
        .length;


    assert.equal(
      lines <
      800,
      true,
      `characterCreationDisciplineForm.js possui ${lines} linhas.`
    );
  }
);
