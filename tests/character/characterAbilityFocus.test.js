const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  abilityRequiresFocus,
  createAbilityEntryKey,
  parseAbilityEntryKey,
} = require(
  "../../backend/data/vampire/abilityFocus"
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


test(
  "focused Abilities expose canonical keys",
  () => {
    assert.equal(
      abilityRequiresFocus(
        "science"
      ),
      true
    );


    assert.equal(
      abilityRequiresFocus(
        "crafts"
      ),
      true
    );


    assert.equal(
      abilityRequiresFocus(
        "brawl"
      ),
      false
    );


    assert.equal(
      createAbilityEntryKey(
        "science",
        "biology"
      ),
      "science::biology"
    );


    assert.deepEqual(
      parseAbilityEntryKey(
        "science::physics"
      ),
      {
        ability:
          "science",

        focus:
          "physics",
      }
    );
  }
);


test(
  "payload preserves multiple focuses of the same Ability",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        abilities: {
          "science::biology":
            2,

          "science::physics":
            1,

          brawl:
            2,
        },
      });


    assert.deepEqual(
      result.abilities,
      {
        "science::biology":
          2,

        "science::physics":
          1,

        brawl:
          2,
      }
    );
  }
);


test(
  "focused Ability levels are counted independently",
  () => {
    const result =
      validateCharacterCreation({
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
          abilities: {
            "science::biology":
              2,

            "science::physics":
              1,

            brawl:
              2,
          },
        },
      });


    assert.equal(
      result
        .sections
        .abilities
        .totalLevels,
      5
    );


    assert.deepEqual(
      result
        .sections
        .abilities
        .errors,
      []
    );
  }
);


test(
  "Ability that requires focus is incomplete without one",
  () => {
    const result =
      validateCharacterCreation({
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
          abilities: {
            science:
              1,
          },
        },
      });


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
              "exige um foco"
            )
        ),
      true
    );
  }
);


test(
  "ordinary Abilities reject focused internal keys",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        abilities: {
          "brawl::boxing":
            2,

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
