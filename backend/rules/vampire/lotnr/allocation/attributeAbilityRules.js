const {
  ATTRIBUTE_CATEGORIES,
  CHARACTER_CREATION_RULES,
} = require(
  "../ruleset"
);

const {
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
} = require(
  "./allocationHelpers"
);

const {
  isCoreAbility,
  getCoreAbilityLabel,
} = require(
  "../../../../data/vampire/abilities"
);

const {
  parseAbilityEntryKey,
  abilityRequiresFocus,
} = require(
  "../../../../data/vampire/abilityFocus"
);


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
          generationMaximum;


        if (
          traits.length >
          absoluteMaximum
        ) {
          errors.push(
            `${category} possui ${traits.length} Traits, acima do limite de ${absoluteMaximum} para esta Geração.`
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
      const parsed =
        parseAbilityEntryKey(
          ability
        );


      if (
        !isCoreAbility(
          parsed.ability
        )
      ) {
        errors.push(
          `${ability} não pertence ao catálogo de Habilidades.`
        );


        return;
      }


      if (
        parsed.focus &&
        !abilityRequiresFocus(
          parsed.ability
        )
      ) {
        errors.push(
          `${getCoreAbilityLabel(parsed.ability)} não aceita foco nesta regra.`
        );


        return;
      }


      if (
        abilityRequiresFocus(
          parsed.ability
        ) &&
        !parsed.focus
      ) {
        errors.push(
          `${getCoreAbilityLabel(parsed.ability)} exige um foco.`
        );
      }


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


module.exports = {
  validateAttributes,
  validateAbilities,
};
