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


function assertBelowEightHundredLines(
  relativePath
) {
  const source =
    readFile(
      relativePath
    );


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
    `${relativePath} possui ${lines} linhas.`
  );


  return source;
}


test(
  "Background creation notices live in a focused module",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/background/characterCreationBackgroundNotices.js"
      );


    assert.equal(
      source.includes(
        "GENERATION_APPROVAL_MESSAGE"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createGenerationApprovalNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createPendingClanChoiceNotice"
      ),
      true
    );


    assert.equal(
      source.includes(
        "createCreationRuleErrorNotice"
      ),
      true
    );
  }
);


test(
  "Background editor warns about Generation approval",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/characterCreationBackgroundForm.js"
      );


    assert.equal(
      source.includes(
        "createGenerationApprovalNotice"
      ),
      true
    );
  }
);


test(
  "Influence clan editor highlights pending mandatory choices",
  () => {
    const source =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/creation/form/influence/characterCreationInfluenceClanGrants.js"
      );


    assert.equal(
      source.includes(
        "getPendingGroups"
      ),
      true
    );


    assert.equal(
      source.includes(
        "Benefício de clã pendente"
      ),
      true
    );


    assert.equal(
      source.includes(
        "border-danger"
      ),
      true
    );
  }
);


test(
  "Background and Influence sheets expose creation warnings",
  () => {
    const backgrounds =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetBackgrounds.js"
      );


    const influences =
      assertBelowEightHundredLines(
        "frontend/src/js/main/character/view/sheet/characterSheetInfluences.js"
      );


    assert.equal(
      backgrounds.includes(
        "createGenerationApprovalNotice"
      ),
      true
    );


    assert.equal(
      backgrounds.includes(
        "createCreationRuleErrorNotice"
      ),
      true
    );


    assert.equal(
      influences.includes(
        "createPendingClanChoiceNotice"
      ),
      true
    );


    assert.equal(
      influences.includes(
        "createCreationRuleErrorNotice"
      ),
      true
    );
  }
);
