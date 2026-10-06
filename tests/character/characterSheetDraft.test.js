const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  buildNextDraftChanges,
  applyCharacterSheetDraft,
  serializeCharacterSheetDraft,
} = require(
  "../../backend/services/characterSheetDraftService"
);


test(
  "changed field is stored in character sheet draft",
  () => {
    const changes =
      buildNextDraftChanges(
        {},
        {
          title:
            "Príncipe",
        },
        {
          title:
            "Senescal",
        }
      );


    assert.deepEqual(
      changes,
      {
        title:
          "Senescal",
      }
    );
  }
);


test(
  "returning a field to official value removes it from draft",
  () => {
    const changes =
      buildNextDraftChanges(
        {
          title:
            "Senescal",

          concept:
            "Investigador",
        },
        {
          title:
            "Príncipe",

          concept:
            "Erudito",
        },
        {
          title:
            "Príncipe",
        }
      );


    assert.deepEqual(
      changes,
      {
        concept:
          "Investigador",
      }
    );
  }
);


test(
  "character sheet draft overlays official character values",
  () => {
    const effective =
      applyCharacterSheetDraft(
        {
          _id:
            "character-1",

          motherHouse:
            "house-1",

          title:
            "Príncipe",

          clan:
            "ventrue",
        },
        {
          character:
            "character-1",

          house:
            "house-1",

          status:
            "draft",

          changes: {
            title:
              "Senescal",

            clan:
              "brujah",
          },
        }
      );


    assert.equal(
      effective.title,
      "Senescal"
    );


    assert.equal(
      effective.clan,
      "brujah"
    );
  }
);


test(
  "sheet draft serializer lists changed fields",
  () => {
    const serialized =
      serializeCharacterSheetDraft({
        status:
          "draft",

        changes: {
          title:
            "Senescal",

          virtues: {
            courage:
              4,
          },
        },

        updatedAt:
          "2026-10-06T12:00:00.000Z",
      });


    assert.equal(
      serialized.hasChanges,
      true
    );


    assert.deepEqual(
      serialized.fields,
      [
        "title",
        "virtues",
      ]
    );


    assert.equal(
      serialized.status,
      "draft"
    );
  }
);