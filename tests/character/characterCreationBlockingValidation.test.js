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


test(
  "Humanity zero is allowed",
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

          morality: {
            valid:
              true,

            value:
              0,

            minimum:
              0,

            maximum:
              10,

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
  "Humanity ten is allowed",
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

          morality: {
            valid:
              true,

            value:
              10,

            minimum:
              0,

            maximum:
              10,

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
  "Humanity above ten blocks persistence",
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

          morality: {
            valid:
              false,

            value:
              11,

            minimum:
              0,

            maximum:
              10,

            errors: [
              "A Moralidade deve permanecer entre 0 e 10.",
            ],
          },
        },
      });


    assert.equal(
      error,
      "A Moralidade deve permanecer entre 0 e 10."
    );
  }
);


test(
  "Humanity below zero blocks persistence",
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

          morality: {
            valid:
              false,

            value:
              -1,

            minimum:
              0,

            maximum:
              10,

            errors: [
              "A Moralidade deve permanecer entre 0 e 10.",
            ],
          },
        },
      });


    assert.equal(
      error,
      "A Moralidade deve permanecer entre 0 e 10."
    );
  }
);


test(
  "uncalculated morality does not block editing other creation sections",
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

          morality: {
            valid:
              false,

            value:
              null,

            minimum:
              0,

            maximum:
              10,

            errors: [
              "Não foi possível calcular a Moralidade a partir das Virtudes.",
            ],
          },
        },
      });


    assert.equal(
      error,
      ""
    );
  }
);