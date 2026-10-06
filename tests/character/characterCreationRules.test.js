const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  RULESET_ID,
  CHARACTER_CREATION_RULES,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
  getCharacterCreationRuleSummary,
} = require(
  "../../backend/rules/vampire/lawsOfTheNightRevised"
);

const {
  createPointProgress,
  createUntrackedPointProgress,
} = require(
  "../../backend/rules/characterCreation/pointTracker"
);

const {
  getCharacterCreationProgress,
} = require(
  "../../backend/rules/characterCreation/characterCreationProgress"
);

const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../backend/data/vampire/moralityPaths"
);

const {
  getStartingVirtueValues,
} = require(
  "../../backend/data/vampire/virtues"
);


test(
  "Laws of the Night Revised ruleset defines core creation pools",
  () => {
    assert.equal(
      RULESET_ID,
      "laws_of_the_night_revised"
    );


    assert.deepEqual(
      CHARACTER_CREATION_RULES
        .attributes,
      {
        primary:
          7,

        secondary:
          5,

        tertiary:
          3,

        total:
          15,
      }
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .abilities
        .total,
      5
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .virtues
        .total,
      7
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .freeTraits
        .base,
      5
    );
  }
);


test(
  "Sabbat uses different initial Discipline and Background totals",
  () => {
    assert.equal(
      getInitialDisciplineTotal(
        "camarilla"
      ),
      3
    );


    assert.equal(
      getInitialDisciplineTotal(
        "sabbat"
      ),
      4
    );


    assert.equal(
      getInitialBackgroundTotal(
        "camarilla"
      ),
      5
    );


    assert.equal(
      getInitialBackgroundTotal(
        "sabbat"
      ),
      0
    );
  }
);


test(
  "rule summary resolves sect-specific creation values",
  () => {
    const rules =
      getCharacterCreationRuleSummary(
        "sabbat"
      );


    assert.equal(
      rules.ruleset.id,
      RULESET_ID
    );


    assert.equal(
      rules.disciplines.total,
      4
    );


    assert.equal(
      rules.backgrounds.total,
      0
    );
  }
);


test(
  "point tracker reports remaining and overspending",
  () => {
    assert.deepEqual(
      createPointProgress({
        total:
          7,

        spent:
          4,
      }),
      {
        total:
          7,

        spent:
          4,

        remaining:
          3,

        complete:
          false,

        overSpent:
          false,
      }
    );


    assert.deepEqual(
      createPointProgress({
        total:
          5,

        spent:
          6,
      }),
      {
        total:
          5,

        spent:
          6,

        remaining:
          0,

        complete:
          false,

        overSpent:
          true,
      }
    );
  }
);


test(
  "unimplemented point sections do not pretend to have progress",
  () => {
    assert.deepEqual(
      createUntrackedPointProgress(
        15
      ),
      {
        total:
          15,

        spent:
          null,

        remaining:
          null,

        complete:
          false,

        overSpent:
          false,
      }
    );
  }
);


test(
  "character creation progress tracks Virtues without faking unfinished sections",
  () => {
    const virtues =
      getStartingVirtueValues(
        DEFAULT_MORALITY_PATH
      );


    const progress =
      getCharacterCreationProgress({
        sect:
          "camarilla",

        moralityPath:
          DEFAULT_MORALITY_PATH,

        virtues,
      });


    assert.equal(
      progress.ruleset.id,
      RULESET_ID
    );


    assert.equal(
      progress.sections
        .attributes
        .implemented,
      false
    );


    assert.equal(
      progress.sections
        .attributes
        .points
        .total,
      15
    );


    assert.equal(
      progress.sections
        .virtues
        .implemented,
      true
    );


    assert.equal(
      progress.sections
        .virtues
        .points
        .total,
      7
    );


    assert.equal(
      progress.sections
        .virtues
        .points
        .spent,
      0
    );


    assert.equal(
      progress.summary
        .implementedSections,
      1
    );
  }
);