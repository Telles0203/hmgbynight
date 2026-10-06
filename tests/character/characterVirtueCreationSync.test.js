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
  createEmptyCharacterCreationState,
} = require(
  "../../backend/rules/vampire/lotnr/ruleset"
);

const {
  buildCharacterCreationAfterVirtueChange,
} = require(
  "../../backend/controllers/character/edit/characterVirtueCreationSync"
);


function createCharacter() {
  return {
    sect:
      "camarilla",

    clan:
      "nosferatu",

    moralityPath:
      DEFAULT_MORALITY_PATH,

    virtues: {
      conscience:
        2,

      selfControl:
        4,

      courage:
        3,

      conviction:
        null,

      instinct:
        null,
    },

    creation:
      createEmptyCharacterCreationState(),
  };
}


test(
  "Humanity is recalculated after a Virtue change",
  () => {
    const character =
      createCharacter();


    const before =
      buildCharacterCreationAfterVirtueChange(
        character,
        character.virtues
      );


    assert.equal(
      before
        .derived
        .morality,
      6
    );


    const after =
      buildCharacterCreationAfterVirtueChange(
        character,
        {
          ...character.virtues,

          selfControl:
            5,
        }
      );


    assert.equal(
      after
        .derived
        .morality,
      7
    );
  }
);