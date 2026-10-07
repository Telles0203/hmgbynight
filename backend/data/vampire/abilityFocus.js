const ABILITY_KEY_SEPARATOR =
  "::";


const ABILITY_FOCUS_OPTIONS =
  Object.freeze({
    crafts:
      Object.freeze([
        {
          value:
            "carpentry",

          label:
            "Carpentry",
        },

        {
          value:
            "clockworks",

          label:
            "Clockworks",
        },

        {
          value:
            "blacksmithing",

          label:
            "Blacksmithing",
        },

        {
          value:
            "leatherworking",

          label:
            "Leatherworking",
        },

        {
          value:
            "painting",

          label:
            "Painting",
        },

        {
          value:
            "drawing",

          label:
            "Drawing",
        },

        {
          value:
            "mechanics",

          label:
            "Mechanics",
        },

        {
          value:
            "electronics",

          label:
            "Electronics",
        },

        {
          value:
            "body_crafts",

          label:
            "Body Crafts",
        },
      ]),

    performance:
      Object.freeze([
        {
          value:
            "singing",

          label:
            "Singing",
        },

        {
          value:
            "dancing",

          label:
            "Dancing",
        },

        {
          value:
            "acting",

          label:
            "Acting",
        },

        {
          value:
            "dramatic_readings",

          label:
            "Dramatic Readings",
        },

        {
          value:
            "playing_an_instrument",

          label:
            "Playing an Instrument",
        },
      ]),

    science:
      Object.freeze([
        {
          value:
            "biology",

          label:
            "Biology",
        },

        {
          value:
            "chemistry",

          label:
            "Chemistry",
        },

        {
          value:
            "physics",

          label:
            "Physics",
        },

        {
          value:
            "metallurgy",

          label:
            "Metallurgy",
        },

        {
          value:
            "electrical_engineering",

          label:
            "Electrical Engineering",
        },

        {
          value:
            "mathematics",

          label:
            "Mathematics",
        },

        {
          value:
            "geology",

          label:
            "Geology",
        },

        {
          value:
            "botany",

          label:
            "Botany",
        },
      ]),

    hobby_professional_expert:
      Object.freeze([
        {
          value:
            "cainite_lore",

          label:
            "Cainite Lore",
        },

        {
          value:
            "thanatology",

          label:
            "Thanatology",
        },

        {
          value:
            "demolitions",

          label:
            "Demolitions",
        },
      ]),
  });


function normalizeAbilityBase(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function normalizeAbilityFocus(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}


function parseAbilityEntryKey(
  value
) {
  const normalized =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  const separatorIndex =
    normalized.indexOf(
      ABILITY_KEY_SEPARATOR
    );


  if (
    separatorIndex ===
    -1
  ) {
    return {
      ability:
        normalizeAbilityBase(
          normalized
        ),

      focus:
        "",
    };
  }


  return {
    ability:
      normalizeAbilityBase(
        normalized.slice(
          0,
          separatorIndex
        )
      ),

    focus:
      normalizeAbilityFocus(
        normalized.slice(
          separatorIndex +
            ABILITY_KEY_SEPARATOR.length
        )
      ),
  };
}


function createAbilityEntryKey(
  ability,
  focus = ""
) {
  const normalizedAbility =
    normalizeAbilityBase(
      ability
    );


  const normalizedFocus =
    normalizeAbilityFocus(
      focus
    );


  if (
    !normalizedFocus
  ) {
    return normalizedAbility;
  }


  return (
    normalizedAbility +
    ABILITY_KEY_SEPARATOR +
    normalizedFocus
  );
}


function abilityRequiresFocus(
  ability
) {
  const parsed =
    parseAbilityEntryKey(
      ability
    );


  return Object.prototype
    .hasOwnProperty
    .call(
      ABILITY_FOCUS_OPTIONS,
      parsed.ability
    );
}


function getAbilityFocusOptions(
  ability
) {
  const parsed =
    parseAbilityEntryKey(
      ability
    );


  const options =
    ABILITY_FOCUS_OPTIONS[
      parsed.ability
    ];


  return Array.isArray(
    options
  )
    ? options.map(
        (
          option
        ) => ({
          ...option,
        })
      )
    : [];
}


module.exports = {
  ABILITY_KEY_SEPARATOR,
  ABILITY_FOCUS_OPTIONS,
  normalizeAbilityBase,
  normalizeAbilityFocus,
  parseAbilityEntryKey,
  createAbilityEntryKey,
  abilityRequiresFocus,
  getAbilityFocusOptions,
};
