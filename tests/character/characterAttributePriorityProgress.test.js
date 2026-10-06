const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getPriorityTargets,
} = require(
  "../../backend/rules/vampire/lotnr/allocationRules"
);


test(
  "selected attribute priority keeps its target before all priorities are assigned",
  () => {
    const result =
      getPriorityTargets({
        primary:
          "physical",

        secondary:
          "",

        tertiary:
          "",
      });


    assert.equal(
      result.valid,
      false
    );


    assert.deepEqual(
      result.targets,
      {
        physical:
          7,
      }
    );
  }
);


test(
  "two selected attribute priorities keep both targets",
  () => {
    const result =
      getPriorityTargets({
        primary:
          "physical",

        secondary:
          "social",

        tertiary:
          "",
      });


    assert.equal(
      result.valid,
      false
    );


    assert.deepEqual(
      result.targets,
      {
        physical:
          7,

        social:
          5,
      }
    );
  }
);


test(
  "complete attribute priorities expose seven five three targets",
  () => {
    const result =
      getPriorityTargets({
        primary:
          "physical",

        secondary:
          "social",

        tertiary:
          "mental",
      });


    assert.equal(
      result.valid,
      true
    );


    assert.deepEqual(
      result.targets,
      {
        physical:
          7,

        social:
          5,

        mental:
          3,
      }
    );
  }
);