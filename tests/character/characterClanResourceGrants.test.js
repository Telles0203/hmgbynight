const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  INFLUENCE_AREAS,
} = require(
  "../../backend/data/vampire/backgrounds"
);

const {
  getFixedClanResourceGrants,
  getClanResourceChoiceGrants,
  resolveClanResourceGrants,
} = require(
  "../../backend/rules/vampire/lotnr/clanBackgroundInfluenceGrants"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


test(
  "Tremere receive free Occult Influence",
  () => {
    const grants =
      getFixedClanResourceGrants(
        "tremere"
      );


    assert.deepEqual(
      grants,
      {
        backgrounds:
          {},

        influences: {
          occult:
            1,
        },
      }
    );


    const result =
      validateCharacterCreation({
        clan:
          "tremere",

        sect:
          "camarilla",

        creation: {
          backgrounds: {
            resources:
              5,
          },
        },
      });


    assert.equal(
      result
        .sections
        .backgrounds
        .totalLevels,
      5
    );


    assert.equal(
      result
        .sections
        .backgrounds
        .effectiveTotalLevels,
      6
    );


    assert.equal(
      result
        .sections
        .backgrounds
        .grantedInfluences
        .occult,
      1
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .backgrounds,
      0
    );
  }
);


test(
  "Ventrue receive free Resources and may choose any Influence",
  () => {
    const groups =
      getClanResourceChoiceGrants(
        "ventrue"
      );


    assert.equal(
      groups.length,
      1
    );


    assert.equal(
      groups[
        0
      ].options.length,
      INFLUENCE_AREAS.length
    );


    INFLUENCE_AREAS.forEach(
      (
        influence
      ) => {
        assert.equal(
          groups[
            0
          ].options.some(
            (
              option
            ) =>
              option.key ===
              `influence::${influence}`
          ),
          true
        );
      }
    );


    const resolved =
      resolveClanResourceGrants(
        "ventrue",
        {
          ventrue_influence:
            "influence::media",
        }
      );


    assert.equal(
      resolved
        .backgrounds
        .resources,
      1
    );


    assert.equal(
      resolved
        .influences
        .media,
      1
    );


    assert.equal(
      resolved
        .pendingChoices
        .length,
      0
    );
  }
);


test(
  "Brujah Influence choice grants associated Ability",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "brujah",

        sect:
          "camarilla",

        creation: {
          clanGrantChoices: {
            backgroundInfluence: {
              revolution_influence:
                "influence::university",
            },
          },

          backgrounds: {
            resources:
              5,
          },
        },
      });


    assert.equal(
      result
        .sections
        .backgrounds
        .grantedInfluences
        .university,
      1
    );


    assert.equal(
      result
        .sections
        .abilities
        .grantedAbilities
        .academics,
      1
    );


    assert.equal(
      result
        .freeTraits
        .spending
        .backgrounds,
      0
    );
  }
);


test(
  "Giovanni second clan benefit may grant Retainers",
  () => {
    const resolved =
      resolveClanResourceGrants(
        "giovanni",
        {
          giovanni_family_influence:
            "influence::finance",

          giovanni_family_asset:
            "background::retainers",
        }
      );


    assert.equal(
      resolved
        .influences
        .finance,
      1
    );


    assert.equal(
      resolved
        .backgrounds
        .retainers,
      1
    );
  }
);


test(
  "resource choice groups remain pending until selected",
  () => {
    assert.equal(
      getClanResourceChoiceGrants(
        "ravnos"
      ).length,
      1
    );


    const resolved =
      resolveClanResourceGrants(
        "ravnos",
        {}
      );


    assert.deepEqual(
      resolved.pendingChoices,
      [
        "ravnos_influence",
      ]
    );
  }
);
