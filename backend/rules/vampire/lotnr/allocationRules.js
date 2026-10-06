const {
  ATTRIBUTE_CATEGORIES,
  ATTRIBUTE_PRIORITY_POOLS,
  CHARACTER_CREATION_RULES,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
} = require(
  "./ruleset"
);

const {
  isCoreDiscipline,
  isCoreBackground,
  isClanDiscipline,
} = require(
  "./catalogs"
);

const {
  getActiveVirtueKeys,
  getStartingVirtueValues,
} = require(
  "../../../data/vampire/virtues"
);


function normalizeInteger(
  value,
  fallback = 0
) {
  const normalized =
    Number(
      value
    );


  return Number.isInteger(
    normalized
  )
    ? normalized
    : fallback;
}


function normalizeLevelMap(
  value
) {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value
    )
  ) {
    return {};
  }


  const normalized =
    {};


  Object.entries(
    value
  ).forEach(
    ([
      key,
      level,
    ]) => {
      const normalizedKey =
        String(
          key ||
          ""
        )
          .trim()
          .toLowerCase();


      const normalizedLevel =
        Number(
          level
        );


      if (
        normalizedKey &&
        Number.isInteger(
          normalizedLevel
        )
      ) {
        normalized[
          normalizedKey
        ] =
          normalizedLevel;
      }
    }
  );


  return normalized;
}


function createPointProgress(
  total,
  spent
) {
  const normalizedTotal =
    Math.max(
      0,
      normalizeInteger(
        total
      )
    );


  const normalizedSpent =
    Math.max(
      0,
      normalizeInteger(
        spent
      )
    );


  return {
    total:
      normalizedTotal,

    spent:
      normalizedSpent,

    remaining:
      Math.max(
        0,
        normalizedTotal -
          normalizedSpent
      ),

    complete:
      normalizedSpent >=
      normalizedTotal,

    overSpent:
      normalizedSpent >
      normalizedTotal,
  };
}


function getPriorityTargets(
  priorities
) {
  const normalized = {
    primary:
      String(
        priorities?.primary ||
        ""
      )
        .trim()
        .toLowerCase(),

    secondary:
      String(
        priorities?.secondary ||
        ""
      )
        .trim()
        .toLowerCase(),

    tertiary:
      String(
        priorities?.tertiary ||
        ""
      )
        .trim()
        .toLowerCase(),
  };


  const values =
    Object.values(
      normalized
    );


  const valid =
    values.every(
      (
        category
      ) =>
        ATTRIBUTE_CATEGORIES
          .includes(
            category
          )
    ) &&
    new Set(
      values
    ).size ===
      ATTRIBUTE_CATEGORIES.length;


  if (
    !valid
  ) {
    return {
      valid:
        false,

      priorities:
        normalized,

      targets:
        {},
    };
  }


  return {
    valid:
      true,

    priorities:
      normalized,

    targets: {
      [
        normalized.primary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .primary,

      [
        normalized.secondary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .secondary,

      [
        normalized.tertiary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .tertiary,
    },
  };
}


function validateAttributes(
  creation,
  generationRules
) {
  const priority =
    getPriorityTargets(
      creation
        ?.attributePriorities
    );


  const errors =
    [];


  const categories =
    {};


  let requiredSpent =
    0;


  let extraTraits =
    0;


  if (
    !priority.valid
  ) {
    errors.push(
      "Defina uma prioridade única para os Atributos Físicos, Sociais e Mentais."
    );
  }


  ATTRIBUTE_CATEGORIES
    .forEach(
      (
        category
      ) => {
        const rawTraits =
          creation
            ?.attributes
            ?.[
              category
            ];


        const traits =
          Array.isArray(
            rawTraits
          )
            ? rawTraits
                .map(
                  (
                    trait
                  ) =>
                    String(
                      trait ||
                      ""
                    ).trim()
                )
                .filter(
                  Boolean
                )
            : [];


        const target =
          priority.targets[
            category
          ] ||
          0;


        const baseSpent =
          Math.min(
            traits.length,
            target
          );


        const extra =
          Math.max(
            0,
            traits.length -
              target
          );


        const generationMaximum =
          generationRules
            ?.maximumAttributeTraits ||
          10;


        const absoluteMaximum =
          generationMaximum *
          2;


        if (
          traits.length >
          absoluteMaximum
        ) {
          errors.push(
            `${category} possui ${traits.length} Traits, acima do limite absoluto de ${absoluteMaximum}.`
          );
        }


        requiredSpent +=
          baseSpent;


        extraTraits +=
          extra;


        categories[
          category
        ] = {
          traits,

          target,

          spent:
            baseSpent,

          missing:
            Math.max(
              0,
              target -
                traits.length
            ),

          extra,

          generationMaximum,

          absoluteMaximum,

          complete:
            target >
              0 &&
            traits.length >=
              target &&
            traits.length <=
              absoluteMaximum,
        };
      }
    );


  const points =
    createPointProgress(
      CHARACTER_CREATION_RULES
        .attributes
        .total,
      requiredSpent
    );


  return {
    key:
      "attributes",

    label:
      "Atributos",

    points,

    categories,

    priorities:
      priority.priorities,

    extraTraits,

    errors,

    complete:
      priority.valid &&
      points.complete &&
      errors.length ===
        0,
  };
}


function validateAbilities(
  creation,
  generationRules
) {
  const abilities =
    normalizeLevelMap(
      creation?.abilities
    );


  const specializations =
    creation
      ?.specializations &&
    typeof creation
      .specializations ===
      "object" &&
    !Array.isArray(
      creation.specializations
    )
      ? creation.specializations
      : {};


  const errors =
    [];


  let totalLevels =
    0;


  Object.entries(
    abilities
  ).forEach(
    ([
      ability,
      level,
    ]) => {
      if (
        level <
        0
      ) {
        errors.push(
          `${ability} possui nível inválido.`
        );


        return;
      }


      const maximum =
        generationRules
          ?.maximumAbilityLevel ||
        5;


      if (
        level >
        maximum
      ) {
        errors.push(
          `${ability} está acima do máximo de ${maximum} para esta Geração.`
        );
      }


      totalLevels +=
        Math.max(
          0,
          level
        );
    }
  );


  let specializationCount =
    0;


  Object.entries(
    specializations
  ).forEach(
    ([
      ability,
      specialization,
    ]) => {
      const value =
        String(
          specialization ||
          ""
        ).trim();


      if (
        !value
      ) {
        return;
      }


      specializationCount +=
        1;


      if (
        !abilities[
          String(
            ability
          )
            .trim()
            .toLowerCase()
        ]
      ) {
        errors.push(
          `A especialização de ${ability} exige que a Habilidade possua ao menos um nível.`
        );
      }
    }
  );


  const initialTotal =
    CHARACTER_CREATION_RULES
      .abilities
      .total;


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        totalLevels,
        initialTotal
      )
    );


  return {
    key:
      "abilities",

    label:
      "Habilidades",

    abilities,

    specializations,

    specializationCount,

    totalLevels,

    extraTraits:
      Math.max(
        0,
        totalLevels -
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


function validateDisciplines(
  character,
  creation
) {
  const disciplines =
    normalizeLevelMap(
      creation?.disciplines
    );


  const errors =
    [];


  const requiresApproval =
    [];


  let totalLevels =
    0;


  Object.entries(
    disciplines
  ).forEach(
    ([
      discipline,
      level,
    ]) => {
      if (
        level <
          0 ||
        level >
          CHARACTER_CREATION_RULES
            .disciplines
            .maximumLevelDuringCreation
      ) {
        errors.push(
          `${discipline} deve possuir entre 0 e ${CHARACTER_CREATION_RULES.disciplines.maximumLevelDuringCreation} níveis durante a criação.`
        );
      }


      if (
        level >
        0
      ) {
        if (
          !isCoreDiscipline(
            discipline
          ) ||
          !isClanDiscipline(
            character?.clan,
            discipline
          )
        ) {
          requiresApproval.push(
            discipline
          );
        }
      }


      totalLevels +=
        Math.max(
          0,
          level
        );
    }
  );


  const initialTotal =
    getInitialDisciplineTotal(
      character?.sect
    );


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        totalLevels,
        initialTotal
      )
    );


  return {
    key:
      "disciplines",

    label:
      "Disciplinas",

    disciplines,

    totalLevels,

    initialTotal,

    extraTraits:
      Math.max(
        0,
        totalLevels -
          initialTotal
      ),

    requiresApproval: [
      ...new Set(
        requiresApproval
      ),
    ],

    points,

    errors,

    complete:
      points.complete &&
      errors.length ===
        0,
  };
}


function validateBackgrounds(
  character,
  creation
) {
  const backgrounds =
    normalizeLevelMap(
      creation?.backgrounds
    );


  const errors =
    [];


  const requiresApproval =
    [];


  let totalLevels =
    0;


  Object.entries(
    backgrounds
  ).forEach(
    ([
      background,
      level,
    ]) => {
      if (
        level <
          0 ||
        level >
          CHARACTER_CREATION_RULES
            .backgrounds
            .maximumPerBackground
      ) {
        errors.push(
          `${background} deve possuir entre 0 e ${CHARACTER_CREATION_RULES.backgrounds.maximumPerBackground} níveis.`
        );
      }


      if (
        level >
          0 &&
        !isCoreBackground(
          background
        )
      ) {
        requiresApproval.push(
          background
        );
      }


      totalLevels +=
        Math.max(
          0,
          level
        );
    }
  );


  const initialTotal =
    getInitialBackgroundTotal(
      character?.sect
    );


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        totalLevels,
        initialTotal
      )
    );


  return {
    key:
      "backgrounds",

    label:
      "Antecedentes",

    backgrounds,

    totalLevels,

    initialTotal,

    extraTraits:
      Math.max(
        0,
        totalLevels -
          initialTotal
      ),

    generationBackground:
      Math.max(
        0,
        normalizeInteger(
          backgrounds.generation
        )
      ),

    requiresApproval: [
      ...new Set(
        requiresApproval
      ),
    ],

    points,

    errors,

    complete:
      points.complete &&
      errors.length ===
        0,
  };
}


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
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
  validateAttributes,
  validateAbilities,
  validateDisciplines,
  validateBackgrounds,
  validateVirtues,
};