const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  createEmptyCharacterCreationState,
} = require(
  "../../backend/rules/vampire/lotnr/ruleset"
);

const {
  sanitizeCharacterCreationPayload,
} = require(
  "../../backend/controllers/character/edit/characterCreationPayload"
);


test(
  "creation state initializes persistent Free Trait purchase markers",
  () => {
    const state =
      createEmptyCharacterCreationState();


    assert.deepEqual(
      state.freeTraitPurchases,
      {
        abilities:
          [],

        disciplines:
          [],

        backgrounds:
          [],
      }
    );
  }
);


test(
  "creation payload preserves sanitized Free Trait purchase markers",
  () => {
    const creation =
      sanitizeCharacterCreationPayload({
        abilities: {
          brawl:
            3,
        },

        disciplines: {
          celerity:
            2,
        },

        backgrounds: {
          resources:
            4,
        },

        freeTraitPurchases: {
          abilities: [
            "BRAWL",
          ],

          disciplines: [
            "CELERITY",
          ],

          backgrounds: [
            "RESOURCES",
          ],
        },
      });


    assert.deepEqual(
      creation
        .freeTraitPurchases,
      {
        abilities: [
          "brawl",
        ],

        disciplines: [
          "celerity",
        ],

        backgrounds: [
          "resources",
        ],
      }
    );
  }
);
