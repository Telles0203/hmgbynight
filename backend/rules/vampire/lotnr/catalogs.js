const {
  CLAN_DISCIPLINES,
  getClanDisciplines,
  isClanDiscipline,
} = require(
  "./clanRules"
);


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
