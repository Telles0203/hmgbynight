const CORE_MORALITY_PATH_PREFIX =
  "core:";


const MORALITY_MIN =
  1;


const MORALITY_MAX =
  5;


const MORALITY_PATH_OPTIONS = [
  {
    key:
      "humanidade",

    ref:
      "core:humanidade",

    label:
      "Humanidade",

    requiresNarratorApproval:
      false,

    moralityVirtues: [
      "conscience",
      "selfControl",
    ],
  },

  {
    key:
      "sangue",

    ref:
      "core:sangue",

    label:
      "Trilha do Sangue",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "selfControl",
    ],
  },

  {
    key:
      "ossos",

    ref:
      "core:ossos",

    label:
      "Trilha dos Ossos",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "selfControl",
    ],
  },

  {
    key:
      "metamorfose",

    ref:
      "core:metamorfose",

    label:
      "Trilha da Metamorfose",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "instinct",
    ],
  },

  {
    key:
      "noite",

    ref:
      "core:noite",

    label:
      "Trilha da Noite",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "instinct",
    ],
  },

  {
    key:
      "paradoxo",

    ref:
      "core:paradoxo",

    label:
      "Trilha do Paradoxo",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "selfControl",
    ],
  },

  {
    key:
      "typhon",

    ref:
      "core:typhon",

    label:
      "Trilha de Typhon",

    requiresNarratorApproval:
      true,

    moralityVirtues: [
      "conviction",
      "selfControl",
    ],
  },
];


const MORALITY_PATH_BY_REF =
  new Map(
    MORALITY_PATH_OPTIONS.map(
      (
        option
      ) => [
        option.ref,
        option,
      ]
    )
  );


const DEFAULT_MORALITY_PATH =
  "core:humanidade";


function isCoreMoralityPathRef(
  value
) {
  return MORALITY_PATH_BY_REF.has(
    String(
      value ||
      ""
    )
  );
}


function getCoreMoralityPathByRef(
  value
) {
  return (
    MORALITY_PATH_BY_REF.get(
      String(
        value ||
        ""
      )
    ) ||
    null
  );
}


function getCoreMoralityPathLabel(
  value
) {
  return (
    getCoreMoralityPathByRef(
      value
    )?.label ||
    ""
  );
}


function getCoreMoralityPaths() {
  return MORALITY_PATH_OPTIONS.map(
    (
      option
    ) => ({
      ...option,

      moralityVirtues: [
        ...option
          .moralityVirtues,
      ],
    })
  );
}


function calculateStartingMorality(
  moralityPathRef,
  virtues = {}
) {
  const path =
    getCoreMoralityPathByRef(
      moralityPathRef
    );


  if (
    !path
  ) {
    return null;
  }


  const [
    firstVirtue,
    secondVirtue,
  ] =
    path.moralityVirtues;


  const firstValue =
    Number(
      virtues[
        firstVirtue
      ]
    );


  const secondValue =
    Number(
      virtues[
        secondVirtue
      ]
    );


  if (
    !Number.isFinite(
      firstValue
    ) ||
    !Number.isFinite(
      secondValue
    )
  ) {
    return null;
  }


  const average =
    Math.ceil(
      (
        firstValue +
        secondValue
      ) /
      2
    );


  return Math.min(
    MORALITY_MAX,

    Math.max(
      MORALITY_MIN,
      average
    )
  );
}


module.exports = {
  CORE_MORALITY_PATH_PREFIX,
  DEFAULT_MORALITY_PATH,
  MORALITY_MIN,
  MORALITY_MAX,
  MORALITY_PATH_OPTIONS,
  isCoreMoralityPathRef,
  getCoreMoralityPathByRef,
  getCoreMoralityPathLabel,
  getCoreMoralityPaths,
  calculateStartingMorality,
};