const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  buildClanDerivedCreation,
} = require(
  "../../backend/controllers/character/edit/characterClanDerivedSync"
);


function createCharacter(
  clan
) {
  return {
    sect:
      "camarilla",

    clan,

    moralityPath:
      "core:humanidade",

    virtues: {
      conscience:
        3,

      selfControl:
        3,

      courage:
        4,
    },

    creation: {
      attributePriorities: {
        primary:
          "physical",

        secondary:
          "social",

        tertiary:
          "mental",
      },

      attributes: {
        physical: [],
        social: [],
        mental: [],
      },

      abilities: {
        alertness:
          1,
      },

      specializations:
        {},

      disciplines: {
        animalism:
          1,
      },

      backgrounds:
        {},

      negativeTraits: {
        physical: [],
        social: [],
        mental: [],
      },

      moralityAdjustment:
        0,

      willpowerBonus:
        0,

      flawPoints:
        0,

      meritPoints:
        0,

      derangement:
        false,

      bloodCurrent:
        null,
    },
  };
}


test(
  "changing clan recalculates fixed Ability grants",
  () => {
    const character =
      createCharacter(
        "nosferatu"
      );


    const nosferatu =
      buildClanDerivedCreation(
        character,
        "nosferatu"
      );


    const gangrel =
      buildClanDerivedCreation(
        character,
        "gangrel"
      );


    assert.deepEqual(
      nosferatu
        .sections
        .abilities
        .grantedAbilities,
      {
        stealth:
          1,

        survival:
          1,
      }
    );


    assert.deepEqual(
      gangrel
        .sections
        .abilities
        .grantedAbilities,
      {
        animal_ken:
          1,

        survival:
          1,
      }
    );
  }
);


test(
  "changing clan preserves purchased Ability state",
  () => {
    const character =
      createCharacter(
        "nosferatu"
      );


    const result =
      buildClanDerivedCreation(
        character,
        "gangrel"
      );


    assert.deepEqual(
      result
        .state
        .abilities,
      {
        alertness:
          1,
      }
    );
  }
);


test(
  "old Discipline levels remain available for out of clan handling",
  () => {
    const character =
      createCharacter(
        "nosferatu"
      );


    const result =
      buildClanDerivedCreation(
        character,
        "brujah"
      );


    assert.equal(
      result
        .state
        .disciplines
        .animalism,
      1
    );


    assert.equal(
      result
        .sections
        .disciplines
        .requiresApproval
        .includes(
          "animalism"
        ),
      true
    );
  }
);
