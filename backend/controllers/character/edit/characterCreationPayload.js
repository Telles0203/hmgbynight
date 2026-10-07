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
  value
) {
  const key =
    sanitizeText(
      value,
      60
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
  const levels =
    sanitizeLevelMap(
      value
    );


  return Object.fromEntries(
    Object.entries(
      levels
    ).filter(
      ([
        ability,
      ]) =>
        isCoreAbility(
          ability
        )
    )
  );
}


function sanitizeSpecializationMap(
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
        rawValue,
      ]) => {
        const key =
          sanitizeMapKey(
            rawKey
          );


        const specialization =
          sanitizeText(
            rawValue,
            120
          );


        if (
          key &&
          specialization
        ) {
          result[
            key
          ] =
            specialization;
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

    abilities:
      sanitizeAbilityMap(
        source.abilities
      ),

    specializations:
      sanitizeSpecializationMap(
        source.specializations
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
