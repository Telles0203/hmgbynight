const {
  getCoreMoralityPathByRef,
} = require(
  "./moralityPaths"
);

const {
  CHARACTER_CREATION_RULES,
} = require(
  "../../rules/vampire/lawsOfTheNightRevised"
);


const VIRTUE_MIN =
  0;


const VIRTUE_MAX =
  5;


const VIRTUE_CREATION_BUDGET =
  CHARACTER_CREATION_RULES
    .virtues
    .total;


const VIRTUE_OPTIONS = [
  {
    key:
      "conscience",

    label:
      "Consciência",

    group:
      "moralityFirst",
  },

  {
    key:
      "conviction",

    label:
      "Convicção",

    group:
      "moralityFirst",
  },

  {
    key:
      "selfControl",

    label:
      "Autocontrole",

    group:
      "moralitySecond",
  },

  {
    key:
      "instinct",

    label:
      "Instinto",

    group:
      "moralitySecond",
  },

  {
    key:
      "courage",

    label:
      "Coragem",

    group:
      "courage",
  },
];


const VIRTUE_BY_KEY =
  new Map(
    VIRTUE_OPTIONS.map(
      (
        virtue
      ) => [
        virtue.key,
        virtue,
      ]
    )
  );


function getVirtueByKey(
  key
) {
  return (
    VIRTUE_BY_KEY.get(
      String(
        key ||
        ""
      )
    ) ||
    null
  );
}


function getVirtueLabel(
  key
) {
  return (
    getVirtueByKey(
      key
    )?.label ||
    ""
  );
}


function getCoreVirtues() {
  return VIRTUE_OPTIONS.map(
    (
      virtue
    ) => ({
      ...virtue,
    })
  );
}


function getActiveVirtueKeys(
  moralityPathRef
) {
  const moralityPath =
    getCoreMoralityPathByRef(
      moralityPathRef
    );


  if (
    !moralityPath
  ) {
    return [];
  }


  return [
    ...moralityPath
      .moralityVirtues,

    "courage",
  ];
}


function getActiveVirtues(
  moralityPathRef
) {
  return getActiveVirtueKeys(
    moralityPathRef
  )
    .map(
      (
        key
      ) =>
        getVirtueByKey(
          key
        )
    )
    .filter(
      Boolean
    )
    .map(
      (
        virtue
      ) => ({
        ...virtue,
      })
    );
}


function isActiveVirtueKey(
  moralityPathRef,
  virtueKey
) {
  return getActiveVirtueKeys(
    moralityPathRef
  ).includes(
    String(
      virtueKey ||
      ""
    )
  );
}


function getStartingVirtueValues(
  moralityPathRef
) {
  const activeKeys =
    getActiveVirtueKeys(
      moralityPathRef
    );


  const values = {
    conscience:
      null,

    conviction:
      null,

    selfControl:
      null,

    instinct:
      null,

    courage:
      1,
  };


  if (
    activeKeys.includes(
      "conscience"
    )
  ) {
    values.conscience =
      1;
  }


  if (
    activeKeys.includes(
      "selfControl"
    )
  ) {
    values.selfControl =
      1;
  }


  return values;
}


function getVirtueMinimumValue(
  moralityPathRef,
  virtueKey
) {
  if (
    !isActiveVirtueKey(
      moralityPathRef,
      virtueKey
    )
  ) {
    return null;
  }


  const startingValues =
    getStartingVirtueValues(
      moralityPathRef
    );


  const startingValue =
    startingValues[
      virtueKey
    ];


  return Number.isFinite(
    startingValue
  )
    ? startingValue
    : 0;
}


function getVirtueCreationProgress(
  moralityPathRef,
  virtues = {}
) {
  const activeKeys =
    getActiveVirtueKeys(
      moralityPathRef
    );


  const startingValues =
    getStartingVirtueValues(
      moralityPathRef
    );


  let spent =
    0;


  for (
    const virtueKey
    of activeKeys
  ) {
    const startingValue =
      Number.isFinite(
        startingValues[
          virtueKey
        ]
      )
        ? startingValues[
            virtueKey
          ]
        : 0;


    const currentValue =
      Number.isFinite(
        virtues?.[
          virtueKey
        ]
      )
        ? virtues[
            virtueKey
          ]
        : startingValue;


    spent +=
      Math.max(
        0,
        currentValue -
          startingValue
      );
  }


  const remaining =
    Math.max(
      0,
      VIRTUE_CREATION_BUDGET -
        spent
    );


  return {
    total:
      VIRTUE_CREATION_BUDGET,

    spent,

    remaining,

    complete:
      spent ===
      VIRTUE_CREATION_BUDGET,
  };
}


module.exports = {
  VIRTUE_MIN,
  VIRTUE_MAX,
  VIRTUE_CREATION_BUDGET,
  VIRTUE_OPTIONS,
  getVirtueByKey,
  getVirtueLabel,
  getCoreVirtues,
  getActiveVirtueKeys,
  getActiveVirtues,
  isActiveVirtueKey,
  getStartingVirtueValues,
  getVirtueMinimumValue,
  getVirtueCreationProgress,
};