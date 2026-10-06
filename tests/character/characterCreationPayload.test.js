const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  sanitizeCharacterCreationPayload,
} = require(
  "../../backend/controllers/character/edit/characterCreationPayload"
);


test(
  "creation payload keeps supported sheet fields",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        attributePriorities: {
          primary:
            "physical",

          secondary:
            "social",

          tertiary:
            "mental",
        },

        attributes: {
          physical: [
            "Brawny",
          ],

          social: [
            "Charming",
          ],

          mental: [
            "Alert",
          ],
        },

        abilities: {
          Brawl:
            2,
        },

        disciplines: {
          Celerity:
            1,
        },

        backgrounds: {
          Generation:
            2,
        },

        moralityAdjustment:
          -1,

        willpowerBonus:
          2,

        flawPoints:
          3,

        meritPoints:
          4,

        derangement:
          true,

        bloodCurrent:
          7,
      });


    assert.equal(
      result
        .attributePriorities
        .primary,
      "physical"
    );


    assert.equal(
      result
        .abilities
        .brawl,
      2
    );


    assert.equal(
      result
        .disciplines
        .celerity,
      1
    );


    assert.equal(
      result
        .backgrounds
        .generation,
      2
    );


    assert.equal(
      result
        .bloodCurrent,
      7
    );


    assert.equal(
      result.derangement,
      true
    );
  }
);


test(
  "creation payload removes unsupported object keys",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        abilities: {
          constructor:
            5,

          prototype:
            5,

          brawl:
            1,
        },
      });


    assert.deepEqual(
      result.abilities,
      {
        brawl:
          1,
      }
    );
  }
);


test(
  "creation payload normalizes arrays and integer maps",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        attributes: {
          physical: [
            "",
            "Brawny",
            "  Quick  ",
          ],
        },

        abilities: {
          brawl:
            "2",

          dodge:
            0,

          invalid:
            "abc",
        },
      });


    assert.deepEqual(
      result
        .attributes
        .physical,
      [
        "Brawny",
        "Quick",
      ]
    );


    assert.deepEqual(
      result.abilities,
      {
        brawl:
          2,
      }
    );
  }
);