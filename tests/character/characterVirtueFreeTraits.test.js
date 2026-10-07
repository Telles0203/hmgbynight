const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getVirtueCreationProgress,
} = require(
  "../../backend/data/vampire/virtues"
);

const {
  validateSubmittedVirtues,
} = require(
  "../../backend/controllers/character/edit/characterVirtueValidation"
);

const {
  buildCharacterCreationAfterVirtueChange,
} = require(
  "../../backend/controllers/character/edit/characterVirtueCreationSync"
);


const MORALITY_PATH =
  "core:humanidade";


test(
  "extra Virtue points cost two Free Traits each",
  () => {
    const progress =
      getVirtueCreationProgress(
        MORALITY_PATH,
        {
          conscience:
            5,

          selfControl:
            3,

          courage:
            3,
        }
      );


    assert.equal(
      progress.total,
      7
    );


    assert.equal(
      progress.spent,
      8
    );


    assert.equal(
      progress.extra,
      1
    );


    assert.equal(
      progress.freeTraitCostPerPoint,
      2
    );


    assert.equal(
      progress.freeTraitCost,
      2
    );
  }
);


test(
  "Virtues may exceed the normal seven-point budget",
  () => {
    const result =
      validateSubmittedVirtues(
        MORALITY_PATH,
        {
          conscience:
            5,

          selfControl:
            3,

          courage:
            3,
        },
        {
          conscience:
            4,

          selfControl:
            3,

          courage:
            3,
        }
      );


    assert.equal(
      result.ok,
      true
    );
  }
);


test(
  "extra Virtues may leave Free Traits negative",
  () => {
    const creation =
      buildCharacterCreationAfterVirtueChange(
        {
          moralityPath:
            MORALITY_PATH,

          virtues: {
            conscience:
              4,

            selfControl:
              3,

            courage:
              3,
          },

          creation: {
            meritPoints:
              5,
          },
        },
        {
          conscience:
            5,

          selfControl:
            3,

          courage:
            3,
        }
      );


    assert.equal(
      creation
        .freeTraits
        .spending
        .virtues,
      2
    );


    assert.equal(
      creation
        .freeTraits
        .remaining,
      -2
    );


    assert.equal(
      creation
        .freeTraits
        .overSpent,
      true
    );
  }
);


test(
  "reducing an extra Virtue refunds its Free Trait cost",
  () => {
    const creation =
      buildCharacterCreationAfterVirtueChange(
        {
          moralityPath:
            MORALITY_PATH,

          virtues: {
            conscience:
              5,

            selfControl:
              3,

            courage:
              3,
          },

          creation: {
            meritPoints:
              3,
          },
        },
        {
          conscience:
            4,

          selfControl:
            3,

          courage:
            3,
        }
      );


    assert.equal(
      creation
        .freeTraits
        .spending
        .virtues,
      0
    );


    assert.equal(
      creation
        .freeTraits
        .remaining,
      2
    );
  }
);
