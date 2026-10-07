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

    publicationNumber:
      "WW 05013",

    isbn:
      "1-56504-589-0",

    references: {
      characterCreation: {
        chapter:
          "Chapter Three: Character Creation and Traits",

        pages:
          "62-71",
      },

      generation: {
        section:
          "Generation",

        page:
          95,
      },

      backgrounds: {
        section:
          "Backgrounds",

        startsAtPage:
          93,
      },

      freeTraits: {
        section:
          "Free Traits",

        page:
          71,
      },
    },
  });


const ATTRIBUTE_CATEGORIES =
  Object.freeze([
    "physical",
    "social",
    "mental",
  ]);


const ATTRIBUTE_PRIORITY_POOLS =
  Object.freeze({
    primary:
      7,

    secondary:
      5,

    tertiary:
      3,
  });


const CHARACTER_CREATION_RULES =
  Object.freeze({
    attributes:
      Object.freeze({
        primary:
          ATTRIBUTE_PRIORITY_POOLS
            .primary,

        secondary:
          ATTRIBUTE_PRIORITY_POOLS
            .secondary,

        tertiary:
          ATTRIBUTE_PRIORITY_POOLS
            .tertiary,

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

        maximumLevelDuringCreation:
          2,
      }),

    backgrounds:
      Object.freeze({
        default:
          5,

        sabbat:
          0,

        maximumPerBackground:
          5,
      }),

    virtues:
      Object.freeze({
        total:
          7,

        maximumPerVirtue:
          5,
      }),

    morality:
      Object.freeze({
        minimum:
          0,

        maximum:
          10,
      }),

    generation:
      Object.freeze({
        initial:
          13,

        generationBackgroundMaximum:
          5,

        lowestStandardCreation:
          8,
      }),

    freeTraits:
      Object.freeze({
        base:
          5,

        maximumNegativeTraits:
          5,

        maximumNegativeTraitsPerCategory:
          3,

        maximumFlawPoints:
          7,

        derangementBonus:
          2,

        moralitySacrificeBonus:
          2,

        costs:
          Object.freeze({
            attribute:
              1,

            ability:
              1,

            specialization:
              1,

            background:
              1,

            virtue:
              2,

            morality:
              3,

            willpower:
              3,

            discipline:
              3,
          }),
      }),
  });


const GENERATION_TABLE =
  Object.freeze({
    13:
      Object.freeze({
        generation:
          13,

        maximumAttributeTraits:
          10,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          10,

        bloodPerTurn:
          1,

        willpowerStart:
          2,

        willpowerMaximum:
          6,
      }),

    12:
      Object.freeze({
        generation:
          12,

        maximumAttributeTraits:
          10,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          11,

        bloodPerTurn:
          1,

        willpowerStart:
          2,

        willpowerMaximum:
          8,
      }),

    11:
      Object.freeze({
        generation:
          11,

        maximumAttributeTraits:
          11,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          12,

        bloodPerTurn:
          1,

        willpowerStart:
          4,

        willpowerMaximum:
          8,
      }),

    10:
      Object.freeze({
        generation:
          10,

        maximumAttributeTraits:
          12,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          13,

        bloodPerTurn:
          1,

        willpowerStart:
          4,

        willpowerMaximum:
          10,
      }),

    9:
      Object.freeze({
        generation:
          9,

        maximumAttributeTraits:
          13,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          14,

        bloodPerTurn:
          2,

        willpowerStart:
          6,

        willpowerMaximum:
          10,
      }),

    8:
      Object.freeze({
        generation:
          8,

        maximumAttributeTraits:
          14,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          15,

        bloodPerTurn:
          3,

        willpowerStart:
          6,

        willpowerMaximum:
          12,
      }),

    7:
      Object.freeze({
        generation:
          7,

        maximumAttributeTraits:
          16,

        maximumAbilityLevel:
          6,

        bloodMaximum:
          20,

        bloodPerTurn:
          5,

        willpowerStart:
          7,

        willpowerMaximum:
          14,
      }),

    6:
      Object.freeze({
        generation:
          6,

        maximumAttributeTraits:
          18,

        maximumAbilityLevel:
          7,

        bloodMaximum:
          30,

        bloodPerTurn:
          6,

        willpowerStart:
          8,

        willpowerMaximum:
          16,
      }),

    5:
      Object.freeze({
        generation:
          5,

        maximumAttributeTraits:
          20,

        maximumAbilityLevel:
          8,

        bloodMaximum:
          40,

        bloodPerTurn:
          8,

        willpowerStart:
          9,

        willpowerMaximum:
          18,
      }),

    4:
      Object.freeze({
        generation:
          4,

        maximumAttributeTraits:
          25,

        maximumAbilityLevel:
          9,

        bloodMaximum:
          50,

        bloodPerTurn:
          10,

        willpowerStart:
          10,

        willpowerMaximum:
          20,
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


function getGenerationRules(
  generation
) {
  const normalized =
    Number(
      generation
    );


  if (
    !Number.isInteger(
      normalized
    )
  ) {
    return null;
  }


  return (
    GENERATION_TABLE[
      normalized
    ] ||
    null
  );
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

      maximumLevelDuringCreation:
        CHARACTER_CREATION_RULES
          .disciplines
          .maximumLevelDuringCreation,
    },

    backgrounds: {
      total:
        getInitialBackgroundTotal(
          sect
        ),

      maximumPerBackground:
        CHARACTER_CREATION_RULES
          .backgrounds
          .maximumPerBackground,
    },

    virtues: {
      ...CHARACTER_CREATION_RULES
        .virtues,
    },

    morality: {
      ...CHARACTER_CREATION_RULES
        .morality,
    },

    generation: {
      ...CHARACTER_CREATION_RULES
        .generation,
    },

    freeTraits: {
      ...CHARACTER_CREATION_RULES
        .freeTraits,

      costs: {
        ...CHARACTER_CREATION_RULES
          .freeTraits
          .costs,
      },
    },
  };
}


function createEmptyCharacterCreationState() {
  return {
    attributePriorities: {
      primary:
        "",

      secondary:
        "",

      tertiary:
        "",
    },

    attributes: {
      physical:
        [],

      social:
        [],

      mental:
        [],
    },

    abilities:
      {},

    specializations:
      {},

    disciplines:
      {},

    backgrounds:
      {},

    influences:
      {},

    freeTraitPurchases: {
      abilities:
        [],

      disciplines:
        [],

      backgrounds:
        [],
    },

    clanGrantChoices: {
      backgroundInfluence:
        {},
    },

    moralityAdjustment:
      0,

    willpowerBonus:
      0,

    negativeTraits: {
      physical:
        [],

      social:
        [],

      mental:
        [],
    },

    flawPoints:
      0,

    derangement:
      false,

    meritPoints:
      0,

    bloodCurrent:
      null,
  };
}


module.exports = {
  RULESET_ID,
  RULESET_REFERENCE,
  ATTRIBUTE_CATEGORIES,
  ATTRIBUTE_PRIORITY_POOLS,
  CHARACTER_CREATION_RULES,
  GENERATION_TABLE,
  normalizeSect,
  isSabbatSect,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
  getGenerationRules,
  getCharacterCreationRuleSummary,
  createEmptyCharacterCreationState,
};
