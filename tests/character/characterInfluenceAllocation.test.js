const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  validateBackgrounds,
} = require(
  "../../backend/rules/vampire/lotnr/allocationRules"
);


test(
  "Influences share the Background creation pool",
  () => {
    const result =
      validateBackgrounds(
        {
          sect:
            "camarilla",
        },
        {
          backgrounds: {
            resources:
              2,

            generation:
              1,
          },

          influences: {
            finance:
              1,

            political:
              1,
          },
        }
      );


    assert.equal(
      result.backgroundLevels,
      3
    );


    assert.equal(
      result.influenceLevels,
      2
    );


    assert.equal(
      result.totalLevels,
      5
    );


    assert.equal(
      result.extraTraits,
      0
    );


    assert.equal(
      result.errors.length,
      0
    );
  }
);


test(
  "Influence above the shared pool becomes a Free Trait extra",
  () => {
    const result =
      validateBackgrounds(
        {
          sect:
            "camarilla",
        },
        {
          backgrounds: {
            resources:
              2,

            generation:
              1,
          },

          influences: {
            finance:
              1,

            political:
              1,

            street:
              1,
          },
        }
      );


    assert.equal(
      result.totalLevels,
      6
    );


    assert.equal(
      result.extraTraits,
      1
    );
  }
);


test(
  "Influence accepts only canonical Influence areas",
  () => {
    const result =
      validateBackgrounds(
        {
          sect:
            "camarilla",
        },
        {
          backgrounds:
            {},

          influences: {
            invalid_area:
              1,
          },
        }
      );


    assert.equal(
      result.errors.some(
        (
          error
        ) =>
          error.includes(
            "não é uma área válida de Influência"
          )
      ),
      true
    );
  }
);
