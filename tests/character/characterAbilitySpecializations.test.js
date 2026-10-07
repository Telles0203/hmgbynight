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

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


function createCharacter(
  abilities,
  specializations
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
      specializations,
    },
  };
}


test(
  "specializations remain tied to focused Abilities",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        abilities: {
          "science::biology":
            2,

          brawl:
            2,
        },

        specializations: {
          "science::biology":
            "Genetics",

          brawl:
            "Boxing",

          firearms:
            "Pistols",
        },
      });


    assert.deepEqual(
      result.specializations,
      {
        "science::biology":
          "Genetics",

        brawl:
          "Boxing",
      }
    );
  }
);


test(
  "each specialization costs one Free Trait",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter(
          {
            "science::biology":
              2,

            brawl:
              2,

            alertness:
              1,
          },
          {
            "science::biology":
              "Genetics",

            brawl:
              "Boxing",
          }
        )
      );


    assert.equal(
      result
        .sections
        .abilities
        .specializationCount,
      2
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .specializations,
      2
    );
  }
);


test(
  "specialization without its Ability is rejected",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter(
          {
            brawl:
              1,
          },
          {
            firearms:
              "Pistols",
          }
        )
      );


    assert.equal(
      result
        .sections
        .abilities
        .errors
        .some(
          (
            error
          ) =>
            error.includes(
              "exige que a Habilidade possua"
            )
        ),
      true
    );
  }
);
