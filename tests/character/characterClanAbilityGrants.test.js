const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
  getClanAbilityGrantStatus,
} = require(
  "../../backend/rules/vampire/lotnr/clanAbilityGrants"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


test(
  "fixed clan Ability grants are exposed",
  () => {
    assert.deepEqual(
      getFixedClanAbilityGrants(
        "nosferatu"
      ),
      {
        stealth:
          1,

        survival:
          1,
      }
    );


    assert.deepEqual(
      getFixedClanAbilityGrants(
        "assamite"
      ),
      {
        brawl:
          1,

        melee:
          1,
      }
    );


    assert.deepEqual(
      getFixedClanAbilityGrants(
        "malkavian"
      ),
      {
        awareness:
          1,
      }
    );
  }
);


test(
  "choice based clan Ability grants remain explicit",
  () => {
    assert.equal(
      getClanAbilityGrantStatus(
        "brujah"
      ),
      "choice"
    );


    assert.equal(
      getClanAbilityGrantStatus(
        "toreador"
      ),
      "choice"
    );


    assert.equal(
      getClanAbilityChoiceGrants(
        "brujah"
      ).length,
      1
    );


    assert.equal(
      getClanAbilityChoiceGrants(
        "toreador"
      )[0].total,
      2
    );
  }
);


test(
  "clan Ability grants do not consume the five creation points",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "nosferatu",

        sect:
          "camarilla",

        creation: {
          abilities: {
            alertness:
              1,

            brawl:
              1,

            dodge:
              1,

            investigation:
              1,

            streetwise:
              1,
          },
        },
      });


    const abilities =
      result
        .sections
        .abilities;


    assert.equal(
      abilities.totalLevels,
      5
    );


    assert.equal(
      abilities
        .effectiveTotalLevels,
      7
    );


    assert.deepEqual(
      abilities.grantedAbilities,
      {
        stealth:
          1,

        survival:
          1,
      }
    );


    assert.equal(
      abilities.extraTraits,
      0
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .abilities,
      0
    );
  }
);


test(
  "purchased levels stack with clan Ability grants",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "nosferatu",

        sect:
          "camarilla",

        creation: {
          abilities: {
            stealth:
              2,
          },
        },
      });


    assert.equal(
      result
        .sections
        .abilities
        .effectiveAbilities
        .stealth,
      3
    );


    assert.equal(
      result
        .sections
        .abilities
        .totalLevels,
      2
    );
  }
);


test(
  "Malkavian Awareness is a valid clan Ability",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "malkavian",

        sect:
          "camarilla",

        creation: {},
      });


    assert.deepEqual(
      result
        .sections
        .abilities
        .grantedAbilities,
      {
        awareness:
          1,
      }
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
              "awareness"
            )
        ),
      false
    );
  }
);
