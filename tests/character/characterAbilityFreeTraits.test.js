const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


function createCharacter(
  abilities
) {
  return {
    moralityPath:
      "core:humanidade",

    virtues: {
      conscience:
        1,

      selfControl:
        1,

      courage:
        1,
    },

    creation: {
      abilities,
    },
  };
}


test(
  "five Ability levels use the normal creation budget",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter({
          brawl:
            2,

          alertness:
            1,

          athletics:
            1,

          dodge:
            1,
        })
      );


    assert.equal(
      result
        .sections
        .abilities
        .totalLevels,
      5
    );


    assert.equal(
      result
        .sections
        .abilities
        .extraTraits,
      0
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .abilities,
      0
    );
  }
);


test(
  "Ability levels above five cost one Free Trait each",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter({
          brawl:
            2,

          alertness:
            1,

          athletics:
            1,

          dodge:
            1,

          firearms:
            2,
        })
      );


    assert.equal(
      result
        .sections
        .abilities
        .totalLevels,
      7
    );


    assert.equal(
      result
        .sections
        .abilities
        .extraTraits,
      2
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .abilities,
      2
    );
  }
);


test(
  "Ability overspending may leave Free Traits negative",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter({
          brawl:
            5,

          firearms:
            5,

          athletics:
            1,
        })
      );


    assert.equal(
      result
        .sections
        .abilities
        .totalLevels,
      11
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .abilities,
      6
    );


    assert.equal(
      result
        .freeTraits
        .remaining,
      -1
    );


    assert.equal(
      result
        .freeTraits
        .overSpent,
      true
    );
  }
);
