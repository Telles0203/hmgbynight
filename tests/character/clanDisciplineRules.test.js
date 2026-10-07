const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getClanDisciplines,
  isClanDiscipline,
} = require(
  "../../backend/rules/vampire/lotnr/clanRules"
);

const {
  validateDisciplines,
} = require(
  "../../backend/rules/vampire/lotnr/allocation/disciplineBackgroundRules"
);


test(
  "Nosferatu exposes its fixed clan Disciplines",
  () => {
    assert.deepEqual(
      getClanDisciplines(
        "nosferatu"
      ),
      [
        "animalism",
        "obfuscate",
        "potence",
      ]
    );


    assert.equal(
      isClanDiscipline(
        "nosferatu",
        "obfuscate"
      ),
      true
    );


    assert.equal(
      isClanDiscipline(
        "nosferatu",
        "presence"
      ),
      false
    );
  }
);


test(
  "clan Disciplines do not require Narrator approval",
  () => {
    const result =
      validateDisciplines(
        {
          clan:
            "nosferatu",

          sect:
            "camarilla",
        },
        {
          disciplines: {
            animalism:
              1,

            obfuscate:
              1,

            potence:
              1,
          },
        }
      );


    assert.deepEqual(
      result.requiresApproval,
      []
    );


    assert.equal(
      result.totalLevels,
      3
    );


    assert.equal(
      result.points.complete,
      true
    );
  }
);


test(
  "out-of-clan Discipline still requires approval",
  () => {
    const result =
      validateDisciplines(
        {
          clan:
            "nosferatu",

          sect:
            "camarilla",
        },
        {
          disciplines: {
            presence:
              1,
          },
        }
      );


    assert.deepEqual(
      result.requiresApproval,
      [
        "presence",
      ]
    );
  }
);
