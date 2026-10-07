const {
  ATTRIBUTE_CATEGORIES,
  createEmptyCharacterCreationState,
} = require(
  "../../../rules/vampire/lotnr/ruleset"
);

const {
  isCoreAbility,
} = require(
  "../../../data/vampire/abilities"
);

const {
  parseAbilityEntryKey,
  createAbilityEntryKey,
  abilityRequiresFocus,
} = require(
  "../../../data/vampire/abilityFocus"
);


const UNSAFE_KEYS =
  new Set([
    "__proto__",
    "prototype",
    "constructor",
  ]);


function ensurePlainObject(
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


  return value;
}


function sanitizeText(
  value,
  maxLength = 80
) {
  return String(
    value ||
    ""
  )
    .trim()
    .slice(
      0,
      maxLength
    );
}


function sanitizeMapKey(
  value,
  maxLength = 60
) {
  const key =
    sanitizeText(
      value,
      maxLength
    )
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      );


  if (
    !key ||
    UNSAFE_KEYS.has(
      key
    )
  ) {
    return "";
  }


  return key;
}


function sanitizeStringArray(
  value,
  {
    maxItems = 50,
    maxLength = 80,
  } = {}
) {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  return value
    .slice(
      0,
      maxItems
    )
    .map(
      (
        item
      ) =>
        sanitizeText(
          item,
          maxLength
        )
    )
    .filter(
      Boolean
    );
}


function sanitizeInteger(
  value,
  {
    fallback = 0,
    minimum = 0,
    maximum = 50,
    nullable = false,
  } = {}
) {
  if (
    nullable &&
    (
      value ===
        null ||
      value ===
        undefined ||
      value ===
        ""
    )
  ) {
    return null;
  }


  const number =
    Number(
      value
    );


  if (
    !Number.isInteger(
      number
    )
  ) {
    return fallback;
  }


  return Math.max(
    minimum,
    Math.min(
      maximum,
      number
    )
  );
}


function sanitizeLevelMap(
  value,
  {
    maxEntries = 60,
    maximum = 20,
  } = {}
) {
  const source =
    ensurePlainObject(
      value
    );


  const result =
    {};


  Object.entries(
    source
  )
    .slice(
      0,
      maxEntries
    )
    .forEach(
      ([
        rawKey,
        rawLevel,
      ]) => {
        const key =
          sanitizeMapKey(
            rawKey
          );


        if (
          !key
        ) {
          return;
        }


        const level =
          sanitizeInteger(
            rawLevel,
            {
              minimum:
                0,

              maximum,

              fallback:
                0,
            }
          );


        if (
          level >
          0
        ) {
          result[
            key
          ] =
            level;
        }
      }
    );


  return result;
}


function sanitizeAbilityMap(
  value
) {
  const source =
    ensurePlainObject(
      value
    );


  const result =
    {};


  Object.entries(
    source
  )
    .slice(
      0,
      60
    )
    .forEach(
      ([
        rawKey,
        rawLevel,
      ]) => {
        const key =
          sanitizeMapKey(
            rawKey,
            100
          );


        const parsed =
          parseAbilityEntryKey(
            key
          );


        if (
          !isCoreAbility(
            parsed.ability
          )
        ) {
          return;
        }


        if (
          parsed.focus &&
          !abilityRequiresFocus(
            parsed.ability
          )
        ) {
          return;
        }


        const level =
          sanitizeInteger(
            rawLevel,
            {
              minimum:
                0,

              maximum:
                20,

              fallback:
                0,
            }
          );


        if (
          level <=
          0
        ) {
          return;
        }


        const entryKey =
          createAbilityEntryKey(
            parsed.ability,
            parsed.focus
          );


        result[
          entryKey
        ] =
          level;
      }
    );


  return result;
}


function sanitizeSpecializationMap(
  value,
  abilities = {}
) {
  const source =
    ensurePlainObject(
      value
    );


  const result =
    {};


  Object.entries(
    source
  )
    .slice(
      0,
      60
    )
    .forEach(
      ([
        rawKey,
        rawValue,
      ]) => {
        const key =
          sanitizeMapKey(
            rawKey,
            100
          );


        const parsed =
          parseAbilityEntryKey(
            key
          );


        if (
          !isCoreAbility(
            parsed.ability
          )
        ) {
          return;
        }


        if (
          parsed.focus &&
          !abilityRequiresFocus(
            parsed.ability
          )
        ) {
          return;
        }


        const entryKey =
          createAbilityEntryKey(
            parsed.ability,
            parsed.focus
          );


        if (
          !Object.prototype
            .hasOwnProperty
            .call(
              abilities,
              entryKey
            )
        ) {
          return;
        }


        const specialization =
          sanitizeText(
            rawValue,
            120
          );


        if (
          specialization
        ) {
          result[
            entryKey
          ] =
            specialization;
        }
      }
    );


  return result;
}


function sanitizeFreeTraitPurchaseList(
  value
) {
  return sanitizeStringArray(
    value,
    {
      maxItems:
        60,

      maxLength:
        100,
    }
  )
    .map(
      (
        item
      ) =>
        String(
          item
        )
          .trim()
          .toLowerCase()
    )
    .filter(
      Boolean
    );
}


function sanitizeChoiceMap(
  value
) {
  const source =
    ensurePlainObject(
      value
    );


  const result =
    {};


  Object.entries(
    source
  )
    .slice(
      0,
      30
    )
    .forEach(
      ([
        rawKey,
        rawValue,
      ]) => {
        const key =
          sanitizeMapKey(
            rawKey,
            100
          );


        const selected =
          sanitizeMapKey(
            rawValue,
            120
          );


        if (
          key &&
          selected
        ) {
          result[
            key
          ] =
            selected;
        }
      }
    );


  return result;
}


function sanitizePriority(
  value
) {
  const normalized =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  return ATTRIBUTE_CATEGORIES
    .includes(
      normalized
    )
      ? normalized
      : "";
}


function sanitizeCharacterCreationPayload(
  value
) {
  const source =
    ensurePlainObject(
      value
    );


  const defaults =
    createEmptyCharacterCreationState();


  const priorities =
    ensurePlainObject(
      source.attributePriorities
    );


  const attributes =
    ensurePlainObject(
      source.attributes
    );


  const negativeTraits =
    ensurePlainObject(
      source.negativeTraits
    );


  const freeTraitPurchases =
    ensurePlainObject(
      source.freeTraitPurchases
    );


  const clanGrantChoices =
    ensurePlainObject(
      source.clanGrantChoices
    );


  const abilities =
    sanitizeAbilityMap(
      source.abilities
    );


  return {
    ...defaults,

    attributePriorities: {
      primary:
        sanitizePriority(
          priorities.primary
        ),

      secondary:
        sanitizePriority(
          priorities.secondary
        ),

      tertiary:
        sanitizePriority(
          priorities.tertiary
        ),
    },

    attributes: {
      physical:
        sanitizeStringArray(
          attributes.physical
        ),

      social:
        sanitizeStringArray(
          attributes.social
        ),

      mental:
        sanitizeStringArray(
          attributes.mental
        ),
    },

    abilities,

    specializations:
      sanitizeSpecializationMap(
        source.specializations,
        abilities
      ),

    disciplines:
      sanitizeLevelMap(
        source.disciplines,
        {
          maximum:
            10,
        }
      ),

    backgrounds:
      sanitizeLevelMap(
        source.backgrounds,
        {
          maximum:
            10,
        }
      ),

    influences:
      sanitizeLevelMap(
        source.influences,
        {
          maximum:
            10,
        }
      ),

    freeTraitPurchases: {
      abilities:
        sanitizeFreeTraitPurchaseList(
          freeTraitPurchases
            .abilities
        ),

      disciplines:
        sanitizeFreeTraitPurchaseList(
          freeTraitPurchases
            .disciplines
        ),

      backgrounds:
        sanitizeFreeTraitPurchaseList(
          freeTraitPurchases
            .backgrounds
        ),
    },

    clanGrantChoices: {
      backgroundInfluence:
        sanitizeChoiceMap(
          clanGrantChoices
            .backgroundInfluence
        ),
    },

    moralityAdjustment:
      sanitizeInteger(
        source.moralityAdjustment,
        {
          minimum:
            -10,

          maximum:
            10,

          fallback:
            0,
        }
      ),

    willpowerBonus:
      sanitizeInteger(
        source.willpowerBonus,
        {
          minimum:
            0,

          maximum:
            20,

          fallback:
            0,
        }
      ),

    negativeTraits: {
      physical:
        sanitizeStringArray(
          negativeTraits.physical,
          {
            maxItems:
              10,
          }
        ),

      social:
        sanitizeStringArray(
          negativeTraits.social,
          {
            maxItems:
              10,
          }
        ),

      mental:
        sanitizeStringArray(
          negativeTraits.mental,
          {
            maxItems:
              10,
          }
        ),
    },

    flawPoints:
      sanitizeInteger(
        source.flawPoints,
        {
          minimum:
            0,

          maximum:
            20,

          fallback:
            0,
        }
      ),

    derangement:
      source.derangement ===
      true,

    meritPoints:
      sanitizeInteger(
        source.meritPoints,
        {
          minimum:
            0,

          maximum:
            20,

          fallback:
            0,
        }
      ),

    bloodCurrent:
      sanitizeInteger(
        source.bloodCurrent,
        {
          minimum:
            0,

          maximum:
            50,

          nullable:
            true,

          fallback:
            null,
        }
      ),
  };
}


module.exports = {
  sanitizeText,
  sanitizeStringArray,
  sanitizeInteger,
  sanitizeLevelMap,
  sanitizeAbilityMap,
  sanitizeSpecializationMap,
  sanitizeCharacterCreationPayload,
};
