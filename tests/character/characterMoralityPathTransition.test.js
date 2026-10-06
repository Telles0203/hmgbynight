const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  buildMoralityPathVirtues,
} = require(
  "../../backend/controllers/character/edit/characterMoralityPathTransition"
);


test(
  "changing Humanity to Blood preserves shared Virtues without converting Conscience",
  () => {
    const virtues =
      buildMoralityPathVirtues({
        currentMoralityPath:
          "core:humanidade",

        nextMoralityPath:
          "core:sangue",

        currentVirtues: {
          conscience:
            3,

          conviction:
            null,

          selfControl:
            2,

          instinct:
            null,

          courage:
            4,
        },
      });


    assert.deepEqual(
      virtues,
      {
        conscience:
          null,

        conviction:
          0,

        selfControl:
          2,

        instinct:
          null,

        courage:
          4,
      }
    );
  }
);


test(
  "changing Humanity to Metamorphosis initializes new Virtues at their minimum",
  () => {
    const virtues =
      buildMoralityPathVirtues({
        currentMoralityPath:
          "core:humanidade",

        nextMoralityPath:
          "core:metamorfose",

        currentVirtues: {
          conscience:
            4,

          conviction:
            null,

          selfControl:
            3,

          instinct:
            null,

          courage:
            2,
        },
      });


    assert.deepEqual(
      virtues,
      {
        conscience:
          null,

        conviction:
          0,

        selfControl:
          null,

        instinct:
          0,

        courage:
          2,
      }
    );
  }
);


test(
  "changing between Paths with the same Virtues preserves their values",
  () => {
    const virtues =
      buildMoralityPathVirtues({
        currentMoralityPath:
          "core:sangue",

        nextMoralityPath:
          "core:ossos",

        currentVirtues: {
          conscience:
            null,

          conviction:
            3,

          selfControl:
            2,

          instinct:
            null,

          courage:
            3,
        },
      });


    assert.deepEqual(
      virtues,
      {
        conscience:
          null,

        conviction:
          3,

        selfControl:
          2,

        instinct:
          null,

        courage:
          3,
      }
    );
  }
);