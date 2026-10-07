const {
  ATTRIBUTE_CATEGORIES,
  CHARACTER_CREATION_RULES,
} = require(
  "./ruleset"
);

const {
  getFixedClanNegativeTraitGrants,
} = require(
  "./clanNegativeTraitGrants"
);


function normalizeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}


function normalizeGrantedEntries(
  value
) {
  return normalizeArray(
    value
  )
    .map(
      (
        entry
      ) => {
        const count =
          Number(
            entry?.count
          );


        return {
          value:
            String(
              entry?.value ||
              ""
            ).trim(),

          count:
            Number.isInteger(
              count
            )
              ? Math.max(
                  0,
                  count
                )
              : 0,

          locked:
            entry?.locked ===
            true,

          grantsFreeTraits:
            entry?.grantsFreeTraits ===
            true,
        };
      }
    )
    .filter(
      (
        entry
      ) =>
        entry.value &&
        entry.count >
          0
    );
}


function validateNegativeTraits(
  character,
  creation
) {
  const errors =
    [];


  const counts =
    {};


  const grantedCounts =
    {};


  const effectiveCounts =
    {};


  const granted =
    {};


  let total =
    0;


  let grantedTotal =
    0;


  let grantedFreeTraits =
    0;


  const clanGrants =
    getFixedClanNegativeTraitGrants(
      character?.clan
    );


  ATTRIBUTE_CATEGORIES
    .forEach(
      (
        category
      ) => {
        const traits =
          normalizeArray(
            creation
              ?.negativeTraits
              ?.[
                category
              ]
          )
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
            );


        const categoryGrants =
          normalizeGrantedEntries(
            clanGrants[
              category
            ]
          );


        const categoryGrantedCount =
          categoryGrants.reduce(
            (
              sum,
              entry
            ) =>
              sum +
              entry.count,
            0
          );


        const categoryGrantedFreeTraits =
          categoryGrants.reduce(
            (
              sum,
              entry
            ) =>
              sum +
              (
                entry.grantsFreeTraits
                  ? entry.count
                  : 0
              ),
            0
          );


        counts[
          category
        ] =
          traits.length;


        grantedCounts[
          category
        ] =
          categoryGrantedCount;


        effectiveCounts[
          category
        ] =
          traits.length +
          categoryGrantedCount;


        granted[
          category
        ] =
          categoryGrants;


        total +=
          traits.length;


        grantedTotal +=
          categoryGrantedCount;


        grantedFreeTraits +=
          categoryGrantedFreeTraits;


        if (
          traits.length >
          CHARACTER_CREATION_RULES
            .freeTraits
            .maximumNegativeTraitsPerCategory
        ) {
          errors.push(
            `Há mais de ${CHARACTER_CREATION_RULES.freeTraits.maximumNegativeTraitsPerCategory} Traits Negativos em ${category}.`
          );
        }
      }
    );


  if (
    total >
    CHARACTER_CREATION_RULES
      .freeTraits
      .maximumNegativeTraits
  ) {
    errors.push(
      `Um personagem pode receber no máximo ${CHARACTER_CREATION_RULES.freeTraits.maximumNegativeTraits} Free Traits por Traits Negativos.`
    );
  }


  return {
    total,

    counts,

    granted,

    grantedTotal,

    grantedCounts,

    grantedFreeTraits,

    effectiveTotal:
      total +
      grantedTotal,

    effectiveCounts,

    errors,

    valid:
      errors.length ===
      0,
  };
}


function calculateFreeTraitBudget({
  character = {},
  creation,
  attributes,
  abilities,
  disciplines,
  backgrounds,
  virtues,
  morality,
  willpower,
}) {
  const negativeTraits =
    validateNegativeTraits(
      character,
      creation
    );


  const flawPointsRaw =
    Number(
      creation
        ?.flawPoints
    );


  const flawPoints =
    Number.isInteger(
      flawPointsRaw
    )
      ? Math.max(
          0,
          flawPointsRaw
        )
      : 0;


  const meritPointsRaw =
    Number(
      creation
        ?.meritPoints
    );


  const meritPoints =
    Number.isInteger(
      meritPointsRaw
    )
      ? Math.max(
          0,
          meritPointsRaw
        )
      : 0;


  const errors = [
    ...negativeTraits
      .errors,
  ];


  if (
    flawPoints >
    CHARACTER_CREATION_RULES
      .freeTraits
      .maximumFlawPoints
  ) {
    errors.push(
      `Flaws podem conceder no máximo ${CHARACTER_CREATION_RULES.freeTraits.maximumFlawPoints} Free Traits.`
    );
  }


  if (
    meritPoints >
    7
  ) {
    errors.push(
      "Merits não podem consumir mais de 7 Traits durante a criação padrão."
    );
  }


  const derangementBonus =
    creation
      ?.derangement ===
      true
      ? CHARACTER_CREATION_RULES
          .freeTraits
          .derangementBonus
      : 0;


  const moralitySacrificeBonus =
    morality
      .sacrificedTraits *
    CHARACTER_CREATION_RULES
      .freeTraits
      .moralitySacrificeBonus;


  const available =
    CHARACTER_CREATION_RULES
      .freeTraits
      .base +
    negativeTraits.total +
    negativeTraits
      .grantedFreeTraits +
    Math.min(
      flawPoints,
      CHARACTER_CREATION_RULES
        .freeTraits
        .maximumFlawPoints
    ) +
    derangementBonus +
    moralitySacrificeBonus;


  const costs =
    CHARACTER_CREATION_RULES
      .freeTraits
      .costs;


  const spending = {
    attributes:
      attributes
        .extraTraits *
      costs.attribute,

    abilities:
      abilities
        .extraTraits *
      costs.ability,

    specializations:
      abilities
        .specializationCount *
      costs.specialization,

    disciplines:
      disciplines
        .extraTraits *
      costs.discipline,

    backgrounds:
      backgrounds
        .extraTraits *
      costs.background,

    virtues:
      virtues
        .extraTraits *
      costs.virtue,

    morality:
      morality
        .purchasedTraits *
      costs.morality,

    willpower:
      willpower
        .bonusTraits *
      costs.willpower,

    merits:
      meritPoints,
  };


  const spent =
    Object.values(
      spending
    ).reduce(
      (
        totalSpent,
        value
      ) =>
        totalSpent +
        value,
      0
    );


  const remaining =
    available -
    spent;


  if (
    remaining <
    0
  ) {
    errors.push(
      `Foram gastos ${Math.abs(remaining)} Free Traits além do disponível.`
    );
  }


  return {
    available,

    spent,

    remaining,

    complete:
      remaining ===
        0 &&
      errors.length ===
        0,

    overSpent:
      remaining <
      0,

    sources: {
      base:
        CHARACTER_CREATION_RULES
          .freeTraits
          .base,

      negativeTraits:
        negativeTraits.total +
        negativeTraits
          .grantedFreeTraits,

      flaws:
        Math.min(
          flawPoints,
          CHARACTER_CREATION_RULES
            .freeTraits
            .maximumFlawPoints
        ),

      derangement:
        derangementBonus,

      moralitySacrifice:
        moralitySacrificeBonus,
    },

    spending,

    negativeTraits,

    errors,
  };
}


module.exports = {
  validateNegativeTraits,
  calculateFreeTraitBudget,
};
