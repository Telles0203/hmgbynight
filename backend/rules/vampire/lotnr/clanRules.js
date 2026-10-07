const {
  CLAN_OPTIONS,
} = require(
  "../../../data/vampire/clans"
);


const CLAN_DISCIPLINE_MODES =
  Object.freeze({
    FIXED:
      "fixed",

    CHOICE:
      "choice",

    PENDING:
      "pending",
  });


const CLAN_RULE_OVERRIDES =
  Object.freeze({
    assamite:
      Object.freeze({
        disciplines:
          Object.freeze([
            "celerity",
            "obfuscate",
            "quietus",
          ]),
      }),

    banu_haqim:
      Object.freeze({
        disciplines:
          Object.freeze([
            "celerity",
            "obfuscate",
            "quietus",
          ]),
      }),

    brujah:
      Object.freeze({
        disciplines:
          Object.freeze([
            "celerity",
            "potence",
            "presence",
          ]),
      }),

    followers_of_set:
      Object.freeze({
        disciplines:
          Object.freeze([
            "obfuscate",
            "presence",
            "serpentis",
          ]),
      }),

    gangrel:
      Object.freeze({
        disciplines:
          Object.freeze([
            "animalism",
            "fortitude",
            "protean",
          ]),
      }),

    country_gangrel:
      Object.freeze({
        disciplines:
          Object.freeze([
            "animalism",
            "fortitude",
            "protean",
          ]),
      }),

    city_gangrel:
      Object.freeze({
        disciplines:
          Object.freeze([
            "celerity",
            "obfuscate",
            "protean",
          ]),
      }),

    giovanni:
      Object.freeze({
        disciplines:
          Object.freeze([
            "dominate",
            "necromancy",
            "potence",
          ]),
      }),

    lasombra:
      Object.freeze({
        disciplines:
          Object.freeze([
            "dominate",
            "obtenebration",
            "potence",
          ]),
      }),

    malkavian:
      Object.freeze({
        disciplines:
          Object.freeze([
            "auspex",
            "dementation",
            "obfuscate",
          ]),
      }),

    nosferatu:
      Object.freeze({
        disciplines:
          Object.freeze([
            "animalism",
            "obfuscate",
            "potence",
          ]),
      }),

    ravnos:
      Object.freeze({
        disciplines:
          Object.freeze([
            "animalism",
            "chimerstry",
            "fortitude",
          ]),
      }),

    salubri:
      Object.freeze({
        disciplines:
          Object.freeze([
            "auspex",
            "fortitude",
            "obeah",
          ]),
      }),

    toreador:
      Object.freeze({
        disciplines:
          Object.freeze([
            "auspex",
            "celerity",
            "presence",
          ]),
      }),

    tremere:
      Object.freeze({
        disciplines:
          Object.freeze([
            "auspex",
            "dominate",
            "thaumaturgy",
          ]),
      }),

    tzimisce:
      Object.freeze({
        disciplines:
          Object.freeze([
            "animalism",
            "auspex",
            "vicissitude",
          ]),
      }),

    ventrue:
      Object.freeze({
        disciplines:
          Object.freeze([
            "dominate",
            "fortitude",
            "presence",
          ]),
      }),
  });


function normalizeClanKey(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function createEmptyGrants() {
  return Object.freeze({
    abilities:
      Object.freeze({}),

    backgrounds:
      Object.freeze({}),

    influences:
      Object.freeze({}),

    negativeTraits:
      Object.freeze({
        physical:
          Object.freeze([]),

        social:
          Object.freeze([]),

        mental:
          Object.freeze([]),
      }),
  });
}


function createClanRule(
  clan
) {
  const override =
    CLAN_RULE_OVERRIDES[
      clan.value
    ] ||
    null;


  const disciplines =
    Array.isArray(
      override?.disciplines
    )
      ? [
          ...override.disciplines,
        ]
      : [];


  const disciplinesConfigured =
    disciplines.length >
    0;


  return Object.freeze({
    clan:
      clan.value,

    label:
      clan.label,

    disciplines:
      Object.freeze({
        mode:
          disciplinesConfigured
            ? CLAN_DISCIPLINE_MODES
                .FIXED
            : CLAN_DISCIPLINE_MODES
                .PENDING,

        values:
          Object.freeze(
            disciplines
          ),
      }),

    grants:
      createEmptyGrants(),

    restrictions:
      Object.freeze([]),

    implementation:
      Object.freeze({
        disciplines:
          disciplinesConfigured,

        grants:
          false,

        restrictions:
          false,
      }),
  });
}


const CLAN_RULES =
  Object.freeze(
    Object.fromEntries(
      CLAN_OPTIONS.map(
        (
          clan
        ) => [
          clan.value,
          createClanRule(
            clan
          ),
        ]
      )
    )
  );


const CLAN_DISCIPLINES =
  Object.freeze(
    Object.fromEntries(
      Object.values(
        CLAN_RULES
      )
        .filter(
          (
            rule
          ) =>
            rule
              .disciplines
              .mode ===
            CLAN_DISCIPLINE_MODES
              .FIXED
        )
        .map(
          (
            rule
          ) => [
            rule.clan,

            rule
              .disciplines
              .values,
          ]
        )
    )
  );


function getClanRule(
  clan
) {
  return (
    CLAN_RULES[
      normalizeClanKey(
        clan
      )
    ] ||
    null
  );
}


function getAllClanRules() {
  return Object.values(
    CLAN_RULES
  ).map(
    (
      rule
    ) => ({
      clan:
        rule.clan,

      label:
        rule.label,

      disciplines: {
        mode:
          rule
            .disciplines
            .mode,

        values: [
          ...rule
            .disciplines
            .values,
        ],
      },

      grants: {
        abilities: {
          ...rule
            .grants
            .abilities,
        },

        backgrounds: {
          ...rule
            .grants
            .backgrounds,
        },

        influences: {
          ...rule
            .grants
            .influences,
        },

        negativeTraits: {
          physical: [
            ...rule
              .grants
              .negativeTraits
              .physical,
          ],

          social: [
            ...rule
              .grants
              .negativeTraits
              .social,
          ],

          mental: [
            ...rule
              .grants
              .negativeTraits
              .mental,
          ],
        },
      },

      restrictions: [
        ...rule
          .restrictions,
      ],

      implementation: {
        ...rule
          .implementation,
      },
    })
  );
}


function getClanDisciplines(
  clan
) {
  const rule =
    getClanRule(
      clan
    );


  if (
    !rule ||
    rule
      .disciplines
      .mode !==
      CLAN_DISCIPLINE_MODES
        .FIXED
  ) {
    return [];
  }


  return [
    ...rule
      .disciplines
      .values,
  ];
}


function isClanDiscipline(
  clan,
  discipline
) {
  const normalized =
    String(
      discipline ||
      ""
    )
      .trim()
      .toLowerCase();


  return getClanDisciplines(
    clan
  ).includes(
    normalized
  );
}


function getClanRuleCoverage() {
  const rules =
    Object.values(
      CLAN_RULES
    );


  return {
    total:
      rules.length,

    disciplinesConfigured:
      rules.filter(
        (
          rule
        ) =>
          rule
            .implementation
            .disciplines ===
          true
      ).length,

    grantsConfigured:
      rules.filter(
        (
          rule
        ) =>
          rule
            .implementation
            .grants ===
          true
      ).length,

    restrictionsConfigured:
      rules.filter(
        (
          rule
        ) =>
          rule
            .implementation
            .restrictions ===
          true
      ).length,

    pendingDisciplines:
      rules
        .filter(
          (
            rule
          ) =>
            rule
              .implementation
              .disciplines !==
            true
        )
        .map(
          (
            rule
          ) =>
            rule.clan
        ),
  };
}


module.exports = {
  CLAN_DISCIPLINE_MODES,
  CLAN_RULES,
  CLAN_DISCIPLINES,
  normalizeClanKey,
  getClanRule,
  getAllClanRules,
  getClanDisciplines,
  isClanDiscipline,
  getClanRuleCoverage,
};
