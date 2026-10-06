const CORE_DISCIPLINES =
  Object.freeze([
    "animalism",
    "auspex",
    "celerity",
    "chimerstry",
    "dementation",
    "dominate",
    "fortitude",
    "necromancy",
    "obeah",
    "obfuscate",
    "obtenebration",
    "potence",
    "presence",
    "protean",
    "quietus",
    "serpentis",
    "thaumaturgy",
    "vicissitude",
  ]);


const CORE_BACKGROUNDS =
  Object.freeze([
    "allies",
    "contacts",
    "fame",
    "generation",
    "herd",
    "influence",
    "mentor",
    "resources",
    "retainers",
    "status",
  ]);


const CLAN_DISCIPLINES =
  Object.freeze({
    assamite:
      Object.freeze([
        "celerity",
        "obfuscate",
        "quietus",
      ]),

    banu_haqim:
      Object.freeze([
        "celerity",
        "obfuscate",
        "quietus",
      ]),

    brujah:
      Object.freeze([
        "celerity",
        "potence",
        "presence",
      ]),

    followers_of_set:
      Object.freeze([
        "obfuscate",
        "presence",
        "serpentis",
      ]),

    gangrel:
      Object.freeze([
        "animalism",
        "fortitude",
        "protean",
      ]),

    country_gangrel:
      Object.freeze([
        "animalism",
        "fortitude",
        "protean",
      ]),

    city_gangrel:
      Object.freeze([
        "celerity",
        "obfuscate",
        "protean",
      ]),

    giovanni:
      Object.freeze([
        "dominate",
        "necromancy",
        "potence",
      ]),

    lasombra:
      Object.freeze([
        "dominate",
        "obtenebration",
        "potence",
      ]),

    malkavian:
      Object.freeze([
        "auspex",
        "dementation",
        "obfuscate",
      ]),

    nosferatu:
      Object.freeze([
        "animalism",
        "obfuscate",
        "potence",
      ]),

    ravnos:
      Object.freeze([
        "animalism",
        "chimerstry",
        "fortitude",
      ]),

    salubri:
      Object.freeze([
        "auspex",
        "fortitude",
        "obeah",
      ]),

    toreador:
      Object.freeze([
        "auspex",
        "celerity",
        "presence",
      ]),

    tremere:
      Object.freeze([
        "auspex",
        "dominate",
        "thaumaturgy",
      ]),

    tzimisce:
      Object.freeze([
        "animalism",
        "auspex",
        "vicissitude",
      ]),

    ventrue:
      Object.freeze([
        "dominate",
        "fortitude",
        "presence",
      ]),
  });


function normalizeRuleKey(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function isCoreDiscipline(
  discipline
) {
  return CORE_DISCIPLINES.includes(
    normalizeRuleKey(
      discipline
    )
  );
}


function isCoreBackground(
  background
) {
  return CORE_BACKGROUNDS.includes(
    normalizeRuleKey(
      background
    )
  );
}


function getClanDisciplines(
  clan
) {
  const normalized =
    normalizeRuleKey(
      clan
    );


  const disciplines =
    CLAN_DISCIPLINES[
      normalized
    ];


  return Array.isArray(
    disciplines
  )
    ? [
        ...disciplines,
      ]
    : [];
}


function isClanDiscipline(
  clan,
  discipline
) {
  return getClanDisciplines(
    clan
  ).includes(
    normalizeRuleKey(
      discipline
    )
  );
}


module.exports = {
  CORE_DISCIPLINES,
  CORE_BACKGROUNDS,
  CLAN_DISCIPLINES,
  normalizeRuleKey,
  isCoreDiscipline,
  isCoreBackground,
  getClanDisciplines,
  isClanDiscipline,
};