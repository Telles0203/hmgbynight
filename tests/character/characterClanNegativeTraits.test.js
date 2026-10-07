const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getFixedClanNegativeTraitGrants,
} = require(
  "../../backend/rules/vampire/lotnr/clanNegativeTraitGrants"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


function createCharacter(
  clan,
  negativeTraits = {}
) {
  return {
    clan,

    sect:
      "camarilla",

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

      abilities:
        {},

      specializations:
        {},

      disciplines:
        {},

      backgrounds:
        {},

      negativeTraits: {
        physical:
          [],

        social:
          [],

        mental:
          [],

        ...negativeTraits,
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
  "Nosferatu receives three locked Repugnant Social Traits",
  () => {
    assert.deepEqual(
      getFixedClanNegativeTraitGrants(
        "nosferatu"
      ),
      {
        physical:
          [],

        social: [
          {
            value:
              "Repugnant",

            count:
              3,

            locked:
              true,

            grantsFreeTraits:
              false,
          },
        ],

        mental:
          [],
      }
    );
  }
);


test(
  "Nosferatu clan penalty does not grant Free Traits",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter(
          "nosferatu"
        )
      );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .grantedTotal,
      3
    );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .effectiveTotal,
      3
    );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .grantedFreeTraits,
      0
    );


    assert.equal(
      result
        .freeTraits
        .sources
        .negativeTraits,
      0
    );
  }
);


test(
  "voluntary Negative Traits still grant Free Traits separately",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter(
          "nosferatu",
          {
            social: [
              "Shy",
            ],
          }
        )
      );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .total,
      1
    );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .grantedTotal,
      3
    );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .effectiveTotal,
      4
    );


    assert.equal(
      result
        .freeTraits
        .sources
        .negativeTraits,
      1
    );
  }
);


test(
  "changing away from Nosferatu removes the derived penalty",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter(
          "brujah"
        )
      );


    assert.equal(
      result
        .freeTraits
        .negativeTraits
        .grantedTotal,
      0
    );


    assert.deepEqual(
      result
        .freeTraits
        .negativeTraits
        .granted
        .social,
      []
    );
  }
);
