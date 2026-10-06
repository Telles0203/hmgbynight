const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getCreationBlockingError,
} = require(
  "../../backend/controllers/character/edit/characterCreationValidation"
);


test(
  "valid Willpower does not block character creation persistence",
  () => {
    const error =
      getCreationBlockingError({
        sections: {
          willpower: {
            valid:
              true,

            errors:
              [],
          },
        },
      });


    assert.equal(
      error,
      ""
    );
  }
);


test(
  "Willpower above generation maximum blocks persistence",
  () => {
    const error =
      getCreationBlockingError({
        sections: {
          willpower: {
            valid:
              false,

            errors: [
              "A Força de Vontade não pode ultrapassar 6 nesta Geração.",
            ],
          },
        },
      });


    assert.equal(
      error,
      "A Força de Vontade não pode ultrapassar 6 nesta Geração."
    );
  }
);


test(
  "invalid Willpower has a safe fallback error",
  () => {
    const error =
      getCreationBlockingError({
        sections: {
          willpower: {
            valid:
              false,

            errors:
              [],
          },
        },
      });


    assert.equal(
      error,
      "A Força de Vontade ultrapassa o limite permitido pela Geração."
    );
  }
);