const FIXED_CLAN_ABILITY_GRANTS =
  Object.freeze({
    assamite:
      Object.freeze({
        brawl:
          1,

        melee:
          1,
      }),

    banu_haqim:
      Object.freeze({
        brawl:
          1,

        melee:
          1,
      }),

    followers_of_set:
      Object.freeze({
        streetwise:
          1,
      }),

    gangrel:
      Object.freeze({
        animal_ken:
          1,

        survival:
          1,
      }),

    malkavian:
      Object.freeze({
        awareness:
          1,
      }),

    nosferatu:
      Object.freeze({
        stealth:
          1,

        survival:
          1,
      }),

    ravnos:
      Object.freeze({
        streetwise:
          1,
      }),

    tremere:
      Object.freeze({
        occult:
          1,
      }),

    tzimisce:
      Object.freeze({
        occult:
          1,
      }),
  });


const CLAN_ABILITY_CHOICE_GRANTS =
  Object.freeze({
    brujah:
      Object.freeze([
        Object.freeze({
          id:
            "revolution_field",

          total:
            1,

          options:
            Object.freeze([
              "politics",
              "academics",
              "streetwise",
            ]),

          linkedTo:
            "influence",
        }),
      ]),

    toreador:
      Object.freeze([
        Object.freeze({
          id:
            "artistic_talent",

          total:
            2,

          maximumPerAbility:
            2,

          options:
            Object.freeze([
              "academics",
              "crafts",
              "performance",
              "subterfuge",
            ]),
        }),
      ]),
  });


const NO_ABILITY_GRANT_CLANS =
  new Set([
    "caitiff",
    "giovanni",
    "lasombra",
    "salubri",
    "ventrue",
  ]);


function normalizeClan(
  clan
) {
  return String(
    clan ||
    ""
  )
    .trim()
    .toLowerCase();
}


function getFixedClanAbilityGrants(
  clan
) {
  const grants =
    FIXED_CLAN_ABILITY_GRANTS[
      normalizeClan(
        clan
      )
    ];


  return grants
    ? {
        ...grants,
      }
    : {};
}


function getClanAbilityChoiceGrants(
  clan
) {
  const groups =
    CLAN_ABILITY_CHOICE_GRANTS[
      normalizeClan(
        clan
      )
    ];


  if (
    !Array.isArray(
      groups
    )
  ) {
    return [];
  }


  return groups.map(
    (
      group
    ) => ({
      ...group,

      options: [
        ...group.options,
      ],
    })
  );
}


function getClanAbilityGrantStatus(
  clan
) {
  const normalized =
    normalizeClan(
      clan
    );


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        FIXED_CLAN_ABILITY_GRANTS,
        normalized
      )
  ) {
    return "fixed";
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        CLAN_ABILITY_CHOICE_GRANTS,
        normalized
      )
  ) {
    return "choice";
  }


  if (
    NO_ABILITY_GRANT_CLANS.has(
      normalized
    )
  ) {
    return "none";
  }


  return "pending";
}


module.exports = {
  FIXED_CLAN_ABILITY_GRANTS,
  CLAN_ABILITY_CHOICE_GRANTS,
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
  getClanAbilityGrantStatus,
};
