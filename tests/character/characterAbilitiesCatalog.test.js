const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  CORE_ABILITIES,
  getCoreAbilities,
  getCoreAbilityLabel,
  isCoreAbility,
} = require(
  "../../backend/data/vampire/abilities"
);

const {
  sanitizeCharacterCreationPayload,
} = require(
  "../../backend/controllers/character/edit/characterCreationPayload"
);


test(
  "Laws of the Night Revised core Ability catalog is available",
  () => {
    assert.equal(
      CORE_ABILITIES.length,
      33
    );


    assert.equal(
      isCoreAbility(
        "brawl"
      ),
      true
    );


    assert.equal(
      isCoreAbility(
        "animal_ken"
      ),
      true
    );


    assert.equal(
      isCoreAbility(
        "awareness"
      ),
      true
    );


    assert.equal(
      isCoreAbility(
        "custom ability"
      ),
      false
    );


    assert.equal(
      getCoreAbilityLabel(
        "hobby_professional_expert"
      ),
      "Hobby / Professional / Expert Ability"
    );


    assert.equal(
      getCoreAbilities()
        .every(
          (
            ability
          ) =>
            Boolean(
              ability.value &&
              ability.label
            )
        ),
      true
    );
  }
);


test(
  "creation payload accepts only catalog Abilities",
  () => {
    const result =
      sanitizeCharacterCreationPayload({
        abilities: {
          brawl:
            2,

          science:
            1,

          invented_skill:
            4,
        },
      });


    assert.deepEqual(
      result.abilities,
      {
        brawl:
          2,

        science:
          1,
      }
    );
  }
);
