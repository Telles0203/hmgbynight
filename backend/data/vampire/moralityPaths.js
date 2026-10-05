// =============================================
// Vampire Morality Paths
//
// Catálogo base de Trilhas de Moralidade.
//
// As Crônicas NÃO devem copiar esta lista.
//
// Futuramente poderão armazenar somente:
// - opções padrão desativadas;
// - opções próprias;
// - regras adicionais de aprovação.
//
// OWBN:
// Moralidade utiliza escala de 10 pontos.
//
// A Moralidade INICIAL é igual à soma das
// Virtudes correspondentes:
//
// Consciência / Convicção
// +
// Autocontrole / Instinto
//
// Depois da criação, a Moralidade possui
// progressão própria e não deve continuar
// sendo recalculada automaticamente.
// =============================================


const CORE_MORALITY_PATH_PREFIX =
  "core:";


const MORALITY_MIN =
  0;

const MORALITY_MAX =
  10;


// =============================================
// Core morality paths
// =============================================

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


// =============================================
// Lookup
// =============================================

const MORALITY_PATH_BY_REF =
  new Map(
    MORALITY_PATH_OPTIONS.map(
      (option) => [
        option.ref,
        option,
      ]
    )
  );


// =============================================
// Default
// =============================================

const DEFAULT_MORALITY_PATH =
  "core:humanidade";


// =============================================
// Helpers
// =============================================

function isCoreMoralityPathRef(
  value
) {
  return MORALITY_PATH_BY_REF.has(
    String(
      value || ""
    )
  );
}


function getCoreMoralityPathByRef(
  value
) {
  return (
    MORALITY_PATH_BY_REF.get(
      String(
        value || ""
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
    (option) => ({
      ...option,

      moralityVirtues: [
        ...option
          .moralityVirtues,
      ],
    })
  );
}


// =============================================
// Starting Morality
//
// Utilizaremos quando as Virtudes forem
// implementadas.
//
// Exemplo:
//
// Consciência 3
// Autocontrole 4
//
// Moralidade inicial = 7
// =============================================

function calculateStartingMorality(
  moralityPathRef,
  virtues = {}
) {
  const path =
    getCoreMoralityPathByRef(
      moralityPathRef
    );


  if (!path) {
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


  const total =
    firstValue +
    secondValue;


  return Math.min(
    MORALITY_MAX,

    Math.max(
      MORALITY_MIN,
      total
    )
  );
}


// =============================================
// Exports
// =============================================

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