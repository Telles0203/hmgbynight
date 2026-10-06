const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../../data/vampire/moralityPaths"
);

const {
  getActiveVirtueKeys,
  getVirtueMinimumValue,
} = require(
  "../../../data/vampire/virtues"
);


const VIRTUE_KEYS = [
  "conscience",
  "conviction",
  "selfControl",
  "instinct",
  "courage",
];


function getFiniteVirtueValue(
  virtues,
  key
) {
  const value =
    Number(
      virtues?.[
        key
      ]
    );


  return Number.isFinite(
    value
  )
    ? value
    : null;
}


function getStartingValue(
  moralityPath,
  virtueKey
) {
  const minimum =
    getVirtueMinimumValue(
      moralityPath,
      virtueKey
    );


  return Number.isFinite(
    minimum
  )
    ? minimum
    : 0;
}


function buildMoralityPathVirtues({
  currentMoralityPath,
  nextMoralityPath,
  currentVirtues,
}) {
  const currentPath =
    String(
      currentMoralityPath ||
      DEFAULT_MORALITY_PATH
    );


  const nextPath =
    String(
      nextMoralityPath ||
      DEFAULT_MORALITY_PATH
    );


  const currentActive =
    new Set(
      getActiveVirtueKeys(
        currentPath
      )
    );


  const nextActive =
    new Set(
      getActiveVirtueKeys(
        nextPath
      )
    );


  const virtues =
    {};


  VIRTUE_KEYS.forEach(
    (
      virtueKey
    ) => {
      if (
        !nextActive.has(
          virtueKey
        )
      ) {
        virtues[
          virtueKey
        ] =
          null;


        return;
      }


      const currentValue =
        getFiniteVirtueValue(
          currentVirtues,
          virtueKey
        );


      if (
        currentActive.has(
          virtueKey
        ) &&
        currentValue !==
          null
      ) {
        virtues[
          virtueKey
        ] =
          currentValue;


        return;
      }


      virtues[
        virtueKey
      ] =
        getStartingValue(
          nextPath,
          virtueKey
        );
    }
  );


  return virtues;
}


module.exports = {
  buildMoralityPathVirtues,
};