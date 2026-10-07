const ABILITY_OPTIONS =
  Object.freeze([
    {
      value:
        "academics",

      label:
        "Academics",
    },

    {
      value:
        "alertness",

      label:
        "Alertness",
    },

    {
      value:
        "animal_ken",

      label:
        "Animal Ken",
    },

    {
      value:
        "athletics",

      label:
        "Athletics",
    },

    {
      value:
        "brawl",

      label:
        "Brawl",
    },

    {
      value:
        "computer",

      label:
        "Computer",
    },

    {
      value:
        "crafts",

      label:
        "Crafts",
    },

    {
      value:
        "dodge",

      label:
        "Dodge",
    },

    {
      value:
        "drive",

      label:
        "Drive",
    },

    {
      value:
        "empathy",

      label:
        "Empathy",
    },

    {
      value:
        "etiquette",

      label:
        "Etiquette",
    },

    {
      value:
        "expression",

      label:
        "Expression",
    },

    {
      value:
        "finance",

      label:
        "Finance",
    },

    {
      value:
        "firearms",

      label:
        "Firearms",
    },

    {
      value:
        "hobby_professional_expert",

      label:
        "Hobby / Professional / Expert Ability",
    },

    {
      value:
        "intimidation",

      label:
        "Intimidation",
    },

    {
      value:
        "investigation",

      label:
        "Investigation",
    },

    {
      value:
        "law",

      label:
        "Law",
    },

    {
      value:
        "leadership",

      label:
        "Leadership",
    },

    {
      value:
        "linguistics",

      label:
        "Linguistics",
    },

    {
      value:
        "medicine",

      label:
        "Medicine",
    },

    {
      value:
        "melee",

      label:
        "Melee",
    },

    {
      value:
        "occult",

      label:
        "Occult",
    },

    {
      value:
        "performance",

      label:
        "Performance",
    },

    {
      value:
        "politics",

      label:
        "Politics",
    },

    {
      value:
        "repair",

      label:
        "Repair",
    },

    {
      value:
        "science",

      label:
        "Science",
    },

    {
      value:
        "security",

      label:
        "Security",
    },

    {
      value:
        "stealth",

      label:
        "Stealth",
    },

    {
      value:
        "streetwise",

      label:
        "Streetwise",
    },

    {
      value:
        "subterfuge",

      label:
        "Subterfuge",
    },

    {
      value:
        "survival",

      label:
        "Survival",
    },
  ]);


const CORE_ABILITIES =
  Object.freeze(
    ABILITY_OPTIONS.map(
      (
        ability
      ) =>
        ability.value
    )
  );


const ABILITY_BY_VALUE =
  new Map(
    ABILITY_OPTIONS.map(
      (
        ability
      ) => [
        ability.value,
        ability,
      ]
    )
  );


function normalizeAbilityKey(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function isCoreAbility(
  value
) {
  return ABILITY_BY_VALUE.has(
    normalizeAbilityKey(
      value
    )
  );
}


function getCoreAbility(
  value
) {
  return (
    ABILITY_BY_VALUE.get(
      normalizeAbilityKey(
        value
      )
    ) ||
    null
  );
}


function getCoreAbilityLabel(
  value
) {
  return (
    getCoreAbility(
      value
    )?.label ||
    ""
  );
}


function getCoreAbilities() {
  return ABILITY_OPTIONS.map(
    (
      ability
    ) => ({
      ...ability,
    })
  );
}


module.exports = {
  ABILITY_OPTIONS,
  CORE_ABILITIES,
  normalizeAbilityKey,
  isCoreAbility,
  getCoreAbility,
  getCoreAbilityLabel,
  getCoreAbilities,
};
