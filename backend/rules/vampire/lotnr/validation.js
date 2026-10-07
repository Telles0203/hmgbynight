const {
  RULESET_REFERENCE,
  createEmptyCharacterCreationState,
} = require(
  "./ruleset"
);

const {
  validateAttributes,
  validateAbilities,
  validateDisciplines,
  validateBackgrounds,
  validateVirtues,
} = require(
  "./allocationRules"
);

const {
  deriveGeneration,
  deriveMorality,
  deriveWillpower,
  deriveBlood,
} = require(
  "./derivedRules"
);

const {
  calculateFreeTraitBudget,
} = require(
  "./freeTraits"
);


function normalizeCreationState(
  value
) {
  const defaults =
    createEmptyCharacterCreationState();


  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value
    )
  ) {
    return defaults;
  }


  return {
    ...defaults,
    ...value,

    attributePriorities: {
      ...defaults
        .attributePriorities,

      ...(
        value
          .attributePriorities ||
        {}
      ),
    },

    attributes: {
      ...defaults
        .attributes,

      ...(
        value
          .attributes ||
        {}
      ),
    },

    abilities:
      value.abilities ||
      {},

    specializations:
      value.specializations ||
      {},

    disciplines:
      value.disciplines ||
      {},

    backgrounds:
      value.backgrounds ||
      {},

    freeTraitPurchases: {
      ...defaults
        .freeTraitPurchases,

      ...(
        value
          .freeTraitPurchases ||
        {}
      ),
    },

    negativeTraits: {
      ...defaults
        .negativeTraits,

      ...(
        value
          .negativeTraits ||
        {}
      ),
    },
  };
}


function createDerivedSection({
  key,
  label,
  valid,
  error,
  value,
  extra = {},
}) {
  return {
    key,

    label,

    value,

    valid,

    complete:
      valid,

    errors:
      error
        ? [
            error,
          ]
        : [],

    ...extra,
  };
}


function validateCharacterCreation(
  character = {}
) {
  const creation =
    normalizeCreationState(
      character.creation
    );


  const preliminaryBackgrounds =
    validateBackgrounds(
      character,
      creation
    );


  const generation =
    deriveGeneration(
      preliminaryBackgrounds
        .generationBackground
    );


  const attributes =
    validateAttributes(
      creation,
      generation.rules
    );


  const abilities =
    validateAbilities(
      character,
      creation,
      generation.rules
    );


  const disciplines =
    validateDisciplines(
      character,
      creation
    );


  const backgrounds =
    preliminaryBackgrounds;


  const virtues =
    validateVirtues(
      character
    );


  const morality =
    deriveMorality(
      character,
      creation
    );


  const willpower =
    deriveWillpower(
      generation.rules,
      creation
    );


  const blood =
    deriveBlood(
      generation.rules,
      creation
    );


  const freeTraits =
    calculateFreeTraitBudget({
      character,
      creation,
      attributes,
      abilities,
      disciplines,
      backgrounds,
      virtues,
      morality,
      willpower,
    });


  const generationSection =
    createDerivedSection({
      key:
        "generation",

      label:
        "Geração",

      valid:
        Boolean(
          generation.rules
        ),

      error:
        generation.rules
          ? null
          : "A Geração calculada não possui regras cadastradas.",

      value:
        generation.generation,

      extra: {
        backgroundLevel:
          generation
            .backgroundLevel,

        rules:
          generation.rules,
      },
    });


  const moralitySection =
    createDerivedSection({
      key:
        "morality",

      label:
        "Moralidade",

      valid:
        morality.valid,

      error:
        morality.error,

      value:
        morality.value,

      extra: {
        base:
          morality.base,

        adjustment:
          morality.adjustment,

        minimum:
          morality.minimum,

        maximum:
          morality.maximum,

        purchasedTraits:
          morality
            .purchasedTraits,

        sacrificedTraits:
          morality
            .sacrificedTraits,
      },
    });


  const willpowerSection =
    createDerivedSection({
      key:
        "willpower",

      label:
        "Força de Vontade",

      valid:
        willpower.valid,

      error:
        willpower.error,

      value:
        willpower.value,

      extra: {
        start:
          willpower.start,

        maximum:
          willpower.maximum,

        bonusTraits:
          willpower
            .bonusTraits,
      },
    });


  const bloodSection =
    createDerivedSection({
      key:
        "blood",

      label:
        "Sangue",

      valid:
        blood.valid,

      error:
        blood.error,

      value:
        blood.current,

      extra: {
        maximum:
          blood.maximum,

        perTurn:
          blood.perTurn,
      },
    });


  const sections = {
    attributes,
    abilities,
    disciplines,
    backgrounds,
    virtues,
    morality:
      moralitySection,

    willpower:
      willpowerSection,

    generation:
      generationSection,

    blood:
      bloodSection,

    freeTraits: {
      key:
        "freeTraits",

      label:
        "Free Traits",

      ...freeTraits,
    },
  };


  const ruleErrors =
    Object.values(
      sections
    ).flatMap(
      (
        section
      ) =>
        Array.isArray(
          section.errors
        )
          ? section.errors.map(
              (
                message
              ) => ({
                section:
                  section.key,

                message,
              })
            )
          : []
    );


  const incompleteSections =
    Object.values(
      sections
    )
      .filter(
        (
          section
        ) =>
          section.complete !==
          true
      )
      .map(
        (
          section
        ) =>
          section.key
      );


  const approvalsRequired =
    [
      ...disciplines
        .requiresApproval
        .map(
          (
            value
          ) => ({
            type:
              "discipline",

            value,
          })
        ),

      ...backgrounds
        .requiresApproval
        .map(
          (
            value
          ) => ({
            type:
              "background",

            value,
          })
        ),
    ];


  return {
    ruleset: {
      ...RULESET_REFERENCE,
    },

    creation,

    sections,

    derived: {
      generation:
        generation.generation,

      generationRules:
        generation.rules,

      morality:
        morality.value,

      willpower:
        willpower.value,

      willpowerMaximum:
        willpower.maximum,

      bloodMaximum:
        blood.maximum,

      bloodPerTurn:
        blood.perTurn,
    },

    freeTraits,

    approvalsRequired,

    validation: {
      valid:
        ruleErrors.length ===
          0,

      complete:
        ruleErrors.length ===
          0 &&
        incompleteSections.length ===
          0,

      errors:
        ruleErrors,

      incompleteSections,
    },
  };
}


function assertCharacterCreationValid(
  character
) {
  const result =
    validateCharacterCreation(
      character
    );


  if (
    !result.validation.valid
  ) {
    const error =
      new Error(
        result
          .validation
          .errors
          .map(
            (
              issue
            ) =>
              `${issue.section}: ${issue.message}`
          )
          .join(" | ")
      );


    error.code =
      "INVALID_CHARACTER_CREATION";


    error.validation =
      result;


    throw error;
  }


  return result;
}


module.exports = {
  normalizeCreationState,
  validateCharacterCreation,
  assertCharacterCreationValid,
};
