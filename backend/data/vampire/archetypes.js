// =============================================
// Vampire Archetypes
//
// Catálogo padrão do livro.
//
// A mesma lista é utilizada para:
// - Natureza
// - Comportamento
//
// As Crônicas NÃO devem copiar esta lista.
// Futuramente elas armazenarão somente:
// - opções padrão desativadas;
// - opções personalizadas.
// =============================================


const CORE_ARCHETYPE_PREFIX =
  "core:";


// =============================================
// Core archetypes
// =============================================

const ARCHETYPE_OPTIONS = [
  {
    key:
      "arquiteto",

    ref:
      "core:arquiteto",

    label:
      "Arquiteto",
  },

  {
    key:
      "autocrata",

    ref:
      "core:autocrata",

    label:
      "Autocrata",
  },

  {
    key:
      "bon-vivant",

    ref:
      "core:bon-vivant",

    label:
      "Bon Vivant",
  },

  {
    key:
      "cacador-de-emocoes",

    ref:
      "core:cacador-de-emocoes",

    label:
      "Caçador de Emoções",
  },

  {
    key:
      "celebrante",

    ref:
      "core:celebrante",

    label:
      "Celebrante",
  },

  {
    key:
      "crianca",

    ref:
      "core:crianca",

    label:
      "Criança",
  },

  {
    key:
      "competidor",

    ref:
      "core:competidor",

    label:
      "Competidor",
  },

  {
    key:
      "conformista",

    ref:
      "core:conformista",

    label:
      "Conformista",
  },

  {
    key:
      "diretor",

    ref:
      "core:diretor",

    label:
      "Diretor",
  },

  {
    key:
      "malandro",

    ref:
      "core:malandro",

    label:
      "Malandro",
  },

  {
    key:
      "esperto",

    ref:
      "core:esperto",

    label:
      "Esperto",
  },

  {
    key:
      "excentrico",

    ref:
      "core:excentrico",

    label:
      "Excêntrico",
  },

  {
    key:
      "fanatico",

    ref:
      "core:fanatico",

    label:
      "Fanático",
  },

  {
    key:
      "filantropo",

    ref:
      "core:filantropo",

    label:
      "Filantropo",
  },

  {
    key:
      "galante",

    ref:
      "core:galante",

    label:
      "Galante",
  },

  {
    key:
      "comediante",

    ref:
      "core:comediante",

    label:
      "Comediante",
  },

  {
    key:
      "juiz",

    ref:
      "core:juiz",

    label:
      "Juiz",
  },

  {
    key:
      "martir",

    ref:
      "core:martir",

    label:
      "Mártir",
  },

  {
    key:
      "masoquista",

    ref:
      "core:masoquista",

    label:
      "Masoquista",
  },

  {
    key:
      "monstro",

    ref:
      "core:monstro",

    label:
      "Monstro",
  },

  {
    key:
      "pedagogo",

    ref:
      "core:pedagogo",

    label:
      "Pedagogo",
  },

  {
    key:
      "penitente",

    ref:
      "core:penitente",

    label:
      "Penitente",
  },

  {
    key:
      "perfeccionista",

    ref:
      "core:perfeccionista",

    label:
      "Perfeccionista",
  },

  {
    key:
      "ranzinza",

    ref:
      "core:ranzinza",

    label:
      "Ranzinza",
  },

  {
    key:
      "rebelde",

    ref:
      "core:rebelde",

    label:
      "Rebelde",
  },

  {
    key:
      "sobrevivente",

    ref:
      "core:sobrevivente",

    label:
      "Sobrevivente",
  },

  {
    key:
      "solitario",

    ref:
      "core:solitario",

    label:
      "Solitário",
  },

  {
    key:
      "tradicionalista",

    ref:
      "core:tradicionalista",

    label:
      "Tradicionalista",
  },

  {
    key:
      "valentao",

    ref:
      "core:valentao",

    label:
      "Valentão",
  },

  {
    key:
      "visionario",

    ref:
      "core:visionario",

    label:
      "Visionário",
  },
];


// =============================================
// Lookup map
// =============================================

const ARCHETYPE_BY_REF =
  new Map(
    ARCHETYPE_OPTIONS.map(
      (option) => [
        option.ref,
        option,
      ]
    )
  );


// =============================================
// Helpers
// =============================================

function isCoreArchetypeRef(
  value
) {
  return ARCHETYPE_BY_REF.has(
    String(
      value || ""
    )
  );
}


function getCoreArchetypeByRef(
  value
) {
  return (
    ARCHETYPE_BY_REF.get(
      String(
        value || ""
      )
    ) ||
    null
  );
}


function getCoreArchetypeLabel(
  value
) {
  return (
    getCoreArchetypeByRef(
      value
    )?.label ||
    ""
  );
}


function getCoreArchetypes() {
  return ARCHETYPE_OPTIONS.map(
    (option) => ({
      ...option,
    })
  );
}


// =============================================
// Exports
// =============================================

module.exports = {
  CORE_ARCHETYPE_PREFIX,
  ARCHETYPE_OPTIONS,
  isCoreArchetypeRef,
  getCoreArchetypeByRef,
  getCoreArchetypeLabel,
  getCoreArchetypes,
};