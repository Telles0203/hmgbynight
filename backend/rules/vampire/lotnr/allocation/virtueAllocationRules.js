const {
  CHARACTER_CREATION_RULES,
} = require(
  "../ruleset"
);

const {
  getActiveVirtueKeys,
  getStartingVirtueValues,
} = require(
  "../../../../data/vampire/virtues"
);

const {
  createPointProgress,
} = require(
  "./allocationHelpers"
);


function validateVirtues(
  character
) {
  const moralityPath =
    character?.moralityPath;


  const virtues =
    character?.virtues ||
    {};


  const activeKeys =
    getActiveVirtueKeys(
      moralityPath
    );


  const starting =
    getStartingVirtueValues(
      moralityPath
    );


  const errors =
    [];


  let distributed =
    0;


  const values =
    {};


  activeKeys.forEach(
    (
      virtueKey
    ) => {
      const minimum =
        Number.isFinite(
          starting[
            virtueKey
          ]
        )
          ? starting[
              virtueKey
            ]
          : 0;


      const value =
        Number(
          virtues[
            virtueKey
          ]
        );


      values[
        virtueKey
      ] =
        value;


      if (
        !Number.isInteger(
          value
        ) ||
        value <
          minimum ||
        value >
          CHARACTER_CREATION_RULES
            .virtues
            .maximumPerVirtue
      ) {
        errors.push(
          `${virtueKey} deve possuir um valor entre ${minimum} e ${CHARACTER_CREATION_RULES.virtues.maximumPerVirtue}.`
        );


        return;
      }


      distributed +=
        Math.max(
          0,
          value -
            minimum
        );
    }
  );


  const initialTotal =
    CHARACTER_CREATION_RULES
      .virtues
      .total;


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        distributed,
        initialTotal
      )
    );


  return {
    key:
      "virtues",

    label:
      "Virtudes",

    activeKeys,

    values,

    distributed,

    extraTraits:
      Math.max(
        0,
        distributed -
          initialTotal
      ),

    points,

    errors,

    complete:
      points.complete &&
      errors.length ===
        0,
  };
}


module.exports = {
  validateVirtues,
};