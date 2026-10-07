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

const {
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
} = require(
  "../clanAbilityGrants"
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
  character,
  creation,
  generationRules
) {
  const abilities =
    normalizeLevelMap(
      creation?.abilities
    );


  const grantedAbilities =
    getFixedClanAbilityGrants(
      character?.clan
    );


  const pendingClanAbilityChoices =
    getClanAbilityChoiceGrants(
      character?.clan
    );


  const effectiveAbilities =
    {
      ...grantedAbilities,
    };


  Object.entries(
    abilities
  ).forEach(
    ([
      ability,
      level,
    ]) => {
      effectiveAbilities[
        ability
      ] =
        (
          effectiveAbilities[
            ability
          ] ||
          0
        ) +
        level;
    }
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


      const effectiveLevel =
        Number(
          effectiveAbilities[
            ability
          ] ||
          0
        );


      if (
        effectiveLevel >
        maximum
      ) {
        errors.push(
          `${ability} está acima do máximo de ${maximum} para esta Geração após aplicar os bônus do clã.`
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
        !effectiveAbilities[
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


  Object.entries(
    grantedAbilities
  ).forEach(
    ([
      ability,
      level,
    ]) => {
      if (
        !isCoreAbility(
          ability
        )
      ) {
        errors.push(
          `${ability} concedida pelo clã não pertence ao catálogo de Habilidades.`
        );


        return;
      }


      const maximum =
        generationRules
          ?.maximumAbilityLevel ||
        5;


      const effectiveLevel =
        Number(
          effectiveAbilities[
            ability
          ] ||
          0
        );


      if (
        level >
        0 &&
        effectiveLevel >
        maximum &&
        !Object.prototype
          .hasOwnProperty
          .call(
            abilities,
            ability
          )
      ) {
        errors.push(
          `${ability} está acima do máximo de ${maximum} para esta Geração após aplicar os bônus do clã.`
        );
      }
    }
  );


  const effectiveTotalLevels =
    Object.values(
      effectiveAbilities
    ).reduce(
      (
        total,
        level
      ) =>
        total +
        Math.max(
          0,
          Number(
            level
          ) ||
          0
        ),
      0
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

    grantedAbilities,

    effectiveAbilities,

    pendingClanAbilityChoices,

    specializations,

    specializationCount,

    totalLevels,

    effectiveTotalLevels,

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
