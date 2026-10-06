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


const characterRoot =
  path.resolve(
    __dirname,
    "../../frontend/src/js/main/character"
  );


const sheetDirectory =
  path.resolve(
    characterRoot,
    "view/sheet"
  );


const creationDirectory =
  path.resolve(
    characterRoot,
    "creation"
  );


const creationFormDirectory =
  path.resolve(
    creationDirectory,
    "form"
  );


const sheetPath =
  path.resolve(
    characterRoot,
    "view/characterSheet.js"
  );


const identityPath =
  path.resolve(
    sheetDirectory,
    "characterSheetIdentity.js"
  );


const creationSheetPath =
  path.resolve(
    sheetDirectory,
    "characterSheetCreation.js"
  );


const creationResourcesPath =
  path.resolve(
    sheetDirectory,
    "characterSheetCreationResources.js"
  );


const editorPath =
  path.resolve(
    creationDirectory,
    "characterCreationEditor.js"
  );


const formPath =
  path.resolve(
    creationDirectory,
    "characterCreationForm.js"
  );


const routesPath =
  path.resolve(
    __dirname,
    "../../backend/routes/characterRoutes.js"
  );


function readFile(
  file
) {
  return fs.readFileSync(
    file,
    "utf8"
  );
}


function assertFileBelowEightHundredLines(
  file
) {
  assert.equal(
    fs.existsSync(
      file
    ),
    true,
    `Arquivo não encontrado: ${file}`
  );


  const lineCount =
    readFile(
      file
    )
      .split(
        /\r?\n/
      )
      .length;


  assert.equal(
    lineCount <
      800,
    true,
    `${file} possui ${lineCount} linhas.`
  );
}


test(
  "character sheet is split into focused modules",
  () => {
    [
      sheetPath,

      path.join(
        sheetDirectory,
        "characterSheetCommon.js"
      ),

      identityPath,

      path.join(
        sheetDirectory,
        "characterSheetVirtues.js"
      ),

      creationSheetPath,

      path.join(
        sheetDirectory,
        "characterSheetCreationLists.js"
      ),

      creationResourcesPath,

      editorPath,

      formPath,

      path.join(
        creationFormDirectory,
        "characterCreationFormCommon.js"
      ),

      path.join(
        creationFormDirectory,
        "characterCreationAttributeForm.js"
      ),

      path.join(
        creationFormDirectory,
        "characterCreationMapForm.js"
      ),

      path.join(
        creationFormDirectory,
        "characterCreationAdjustmentForm.js"
      ),
    ].forEach(
      assertFileBelowEightHundredLines
    );
  }
);


test(
  "character creation form is split into focused modules",
  () => {
    const source =
      readFile(
        formPath
      );


    assert.equal(
      source.includes(
        "./form/characterCreationFormCommon.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./form/characterCreationAttributeForm.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./form/characterCreationMapForm.js"
      ),
      true
    );


    assert.equal(
      source.includes(
        "./form/characterCreationAdjustmentForm.js"
      ),
      true
    );
  }
);


test(
  "top sheet keeps Vampire Personality and Virtues as direct grid sections",
  () => {
    const sheet =
      readFile(
        sheetPath
      );


    assert.equal(
      sheet.includes(
        "createVampireSection"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "createPersonalitySection"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "createCharacterVirtuesSection"
      ),
      true
    );
  }
);


test(
  "Generation is rendered in the Vampire section with rule help",
  () => {
    const source =
      readFile(
        identityPath
      );


    assert.equal(
      source.includes(
        "Geração"
      ),
      true
    );


    assert.equal(
      source.includes(
        "GENERATION_HELP_TEXT"
      ),
      true
    );


    assert.equal(
      source.includes(
        "character-generation-help"
      ),
      true
    );


    assert.equal(
      source.includes(
        'data-bs-toggle="popover"'
      ),
      true
    );


    assert.equal(
      source.includes(
        'data-bs-title="Geração"'
      ),
      true
    );
  }
);


test(
  "blood and Willpower resources expose rule help",
  () => {
    const source =
      readFile(
        creationResourcesPath
      );


    assert.equal(
      source.includes(
        "BLOOD_HELP_TEXT"
      ),
      true
    );


    assert.equal(
      source.includes(
        "WILLPOWER_HELP_TEXT"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createHelpButton"
      ),
      true
    );
  }
);


test(
  "blood and Willpower titles expose generation limits",
  () => {
    const source =
      readFile(
        creationSheetPath
      );


    assert.equal(
      source.includes(
        "createGenerationResourceTitle"
      ),
      true
    );


    assert.equal(
      source.includes(
        "derived.bloodMaximum"
      ),
      true
    );


    assert.equal(
      source.includes(
        "derived.bloodPerTurn"
      ),
      true
    );


    assert.equal(
      source.includes(
        "willpowerStart"
      ),
      true
    );


    assert.equal(
      source.includes(
        "derived.willpowerMaximum"
      ),
      true
    );
  }
);


test(
  "Humanity resource renders ten pips from current value",
  () => {
    const source =
      readFile(
        creationResourcesPath
      );


    assert.equal(
      source.includes(
        "createMoralityResourceContent"
      ),
      true
    );


    assert.equal(
      source.includes(
        "normalizedValue"
      ),
      true
    );


    assert.match(
      source,
      /createSheetPips\s*\(\s*normalizedValue\s*,\s*10\s*\)/
    );
  }
);


test(
  "character creation uses inline section editing instead of a modal",
  () => {
    const editor =
      readFile(
        editorPath
      );


    const sheet =
      readFile(
        creationSheetPath
      );


    assert.equal(
      editor.includes(
        "characterCreationEditModal"
      ),
      false
    );


    assert.equal(
      editor.includes(
        "bootstrap.Modal"
      ),
      false
    );


    assert.equal(
      editor.includes(
        "data-character-creation-inline-form"
      ),
      true
    );


    assert.equal(
      sheet.includes(
        "data-character-creation-section"
      ),
      true
    );
  }
);


test(
  "character sheet exposes creation sections",
  () => {
    const source =
      readFile(
        creationSheetPath
      );


    [
      "Habilidades",
      "Disciplinas",
      "Antecedentes",
      "Qualidades / Defeitos",
      "Free Traits",
    ].forEach(
      (
        label
      ) => {
        assert.equal(
          source.includes(
            label
          ),
          true
        );
      }
    );
  }
);


test(
  "character routes expose creation persistence endpoint",
  () => {
    const source =
      readFile(
        routesPath
      );


    assert.equal(
      source.includes(
        '"/:characterId/creation"'
      ),
      true
    );


    assert.equal(
      source.includes(
        "updateCharacterCreation"
      ),
      true
    );
  }
);