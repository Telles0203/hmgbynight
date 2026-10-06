const RULESET_ID =
  "laws_of_the_night_revised";


const RULESET_REFERENCE =
  Object.freeze({
    id:
      RULESET_ID,

    system:
      "Vampire: The Masquerade",

    format:
      "Mind's Eye Theatre",

    edition:
      "Revised",

    book:
      "Laws of the Night Revised Edition",

    publisher:
      "White Wolf Publishing",

    publicationYear:
      1999,

    chapter:
      "Chapter Three: Character Creation and Traits",

    pages:
      "62-71",
  });


const CHARACTER_CREATION_RULES =
  Object.freeze({
    attributes:
      Object.freeze({
        primary:
          7,

        secondary:
          5,

        tertiary:
          3,

        total:
          15,
      }),

    abilities:
      Object.freeze({
        total:
          5,
      }),

    disciplines:
      Object.freeze({
        default:
          3,

        sabbat:
          4,
      }),

    backgrounds:
      Object.freeze({
        default:
          5,

        sabbat:
          0,
      }),

    virtues:
      Object.freeze({
        total:
          7,
      }),

    freeTraits:
      Object.freeze({
        base:
          5,
      }),
  });


function normalizeSect(
  sect
) {
  return String(
    sect ||
    ""
  )
    .trim()
    .toLowerCase();
}


function isSabbatSect(
  sect
) {
  return (
    normalizeSect(
      sect
    ) ===
    "sabbat"
  );
}


function getInitialDisciplineTotal(
  sect
) {
  return isSabbatSect(
    sect
  )
    ? CHARACTER_CREATION_RULES
        .disciplines
        .sabbat
    : CHARACTER_CREATION_RULES
        .disciplines
        .default;
}


function getInitialBackgroundTotal(
  sect
) {
  return isSabbatSect(
    sect
  )
    ? CHARACTER_CREATION_RULES
        .backgrounds
        .sabbat
    : CHARACTER_CREATION_RULES
        .backgrounds
        .default;
}


function getCharacterCreationRuleSummary(
  sect
) {
  return {
    ruleset: {
      ...RULESET_REFERENCE,
    },

    attributes: {
      ...CHARACTER_CREATION_RULES
        .attributes,
    },

    abilities: {
      ...CHARACTER_CREATION_RULES
        .abilities,
    },

    disciplines: {
      total:
        getInitialDisciplineTotal(
          sect
        ),
    },

    backgrounds: {
      total:
        getInitialBackgroundTotal(
          sect
        ),
    },

    virtues: {
      ...CHARACTER_CREATION_RULES
        .virtues,
    },

    freeTraits: {
      ...CHARACTER_CREATION_RULES
        .freeTraits,
    },
  };
}


module.exports = {
  RULESET_ID,
  RULESET_REFERENCE,
  CHARACTER_CREATION_RULES,
  normalizeSect,
  isSabbatSect,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
  getCharacterCreationRuleSummary,
};