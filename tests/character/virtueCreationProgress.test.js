const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../backend/data/vampire/moralityPaths"
);

const {
  getStartingVirtueValues,
  getVirtueCreationProgress,
} = require(
  "../../backend/data/vampire/virtues"
);


test(
  "new Humanity character has seven Virtue points remaining",
  () => {
    const values =
      getStartingVirtueValues(
        DEFAULT_MORALITY_PATH
      );


    const progress =
      getVirtueCreationProgress(
        DEFAULT_MORALITY_PATH,
        values
      );


    assert.equal(
      progress.total,
      7
    );


    assert.equal(
      progress.spent,
      0
    );


    assert.equal(
      progress.remaining,
      7
    );


    assert.equal(
      progress.complete,
      false
    );
  }
);


test(
  "partially distributed Virtues report remaining points",
  () => {
    const progress =
      getVirtueCreationProgress(
        DEFAULT_MORALITY_PATH,
        {
          conscience:
            3,

          selfControl:
            2,

          courage:
            1,
        }
      );


    assert.equal(
      progress.total,
      7
    );


    assert.equal(
      progress.spent,
      3
    );


    assert.equal(
      progress.remaining,
      4
    );


    assert.equal(
      progress.complete,
      false
    );
  }
);


test(
  "fully distributed Virtues have no remaining points",
  () => {
    const progress =
      getVirtueCreationProgress(
        DEFAULT_MORALITY_PATH,
        {
          conscience:
            5,

          selfControl:
            3,

          courage:
            2,
        }
      );


    assert.equal(
      progress.total,
      7
    );


    assert.equal(
      progress.spent,
      7
    );


    assert.equal(
      progress.remaining,
      0
    );


    assert.equal(
      progress.complete,
      true
    );
  }
);