const {
  CLAN_DISCIPLINES,
  getClanDisciplines,
  isClanDiscipline,
} = require(
  "./clanRules"
);

const {
  CORE_BACKGROUNDS,
  isCoreBackground,
} = require(
  "../../../data/vampire/backgrounds"
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
