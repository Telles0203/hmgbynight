const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  deriveMorality,
} = require(
  "../../backend/rules/vampire/lotnr/derivedRules"
);


function createCharacter() {
  return {
    moralityPath:
      "core:humanidade",

    virtues: {
      conscience:
        3,

      selfControl:
        2,

      courage:
        1,
    },
  };
}


test(
  "Humanity can be reduced to zero",
  () => {
    const morality =
      deriveMorality(
        createCharacter(),
        {
          moralityAdjustment:
            -5,
        }
      );


    assert.equal(
      morality.base,
      5
    );


    assert.equal(
      morality.value,
      0
    );


    assert.equal(
      morality.valid,
      true
    );
  }
);


test(
  "Humanity below zero is invalid",
  () => {
    const morality =
      deriveMorality(
        createCharacter(),
        {
          moralityAdjustment:
            -6,
        }
      );


    assert.equal(
      morality.value,
      -1
    );


    assert.equal(
      morality.valid,
      false
    );
  }
);


test(
  "Humanity can be increased to ten",
  () => {
    const morality =
      deriveMorality(
        createCharacter(),
        {
          moralityAdjustment:
            5,
        }
      );


    assert.equal(
      morality.value,
      10
    );


    assert.equal(
      morality.valid,
      true
    );
  }
);


test(
  "Humanity above ten is invalid",
  () => {
    const morality =
      deriveMorality(
        createCharacter(),
        {
          moralityAdjustment:
            6,
        }
      );


    assert.equal(
      morality.value,
      11
    );


    assert.equal(
      morality.valid,
      false
    );
  }
);