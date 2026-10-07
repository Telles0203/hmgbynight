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
  "creation payload preserves Influence areas",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        backgrounds: {
          resources:
            2,
        },

        influences: {
          Finance:
            2,

          Political:
            1,
        },

        freeTraitPurchases: {
          backgrounds: [
            "background::resources",
            "influence::finance",
          ],
        },
      });


    assert.deepEqual(
      result.influences,
      {
        finance:
          2,

        political:
          1,
      }
    );


    assert.deepEqual(
      result
        .freeTraitPurchases
        .backgrounds,
      [
        "background::resources",
        "influence::finance",
      ]
    );
  }
);
