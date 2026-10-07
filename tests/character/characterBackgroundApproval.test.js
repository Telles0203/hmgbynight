const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


test(
  "Generation Background requires narrator approval",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "ventrue",

        sect:
          "camarilla",

        creation: {
          backgrounds: {
            generation:
              1,
          },

          clanGrantChoices: {
            backgroundInfluence: {
              ventrue_influence:
                "influence::finance",
            },
          },
        },
      });


    assert.equal(
      result
        .sections
        .backgrounds
        .requiresApproval
        .includes(
          "generation"
        ),
      true
    );


    assert.equal(
      result
        .approvalsRequired
        .some(
          (
            approval
          ) =>
            approval.type ===
              "background" &&
            approval.value ===
              "generation"
        ),
      true
    );
  }
);


test(
  "ordinary core Background does not require narrator approval",
  () => {
    const result =
      validateCharacterCreation({
        clan:
          "caitiff",

        sect:
          "camarilla",

        creation: {
          backgrounds: {
            resources:
              1,
          },
        },
      });


    assert.equal(
      result
        .sections
        .backgrounds
        .requiresApproval
        .includes(
          "resources"
        ),
      false
    );
  }
);
