const ABILITY_KEY_SEPARATOR =
  "::";


function getAbilityOptions() {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.abilities;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


export function getAbilityOption(
  value
) {
  const normalized =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  return (
    getAbilityOptions()
      .find(
        (
          option
        ) =>
          String(
            option?.value ||
            ""
          )
            .trim()
            .toLowerCase() ===
          normalized
      ) ||
    null
  );
}


export function parseAbilityEntryKey(
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
        normalized,

      focus:
        "",
    };
  }


  return {
    ability:
      normalized
        .slice(
          0,
          separatorIndex
        )
        .trim(),

    focus:
      normalized
        .slice(
          separatorIndex +
            ABILITY_KEY_SEPARATOR.length
        )
        .trim(),
  };
}


export function createAbilityEntryKey(
  ability,
  focus = ""
) {
  const normalizedAbility =
    String(
      ability ||
      ""
    )
      .trim()
      .toLowerCase();


  const normalizedFocus =
    String(
      focus ||
      ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
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


export function abilityRequiresFocus(
  ability
) {
  return (
    getAbilityOption(
      ability
    )?.requiresFocus ===
    true
  );
}


export function getAbilityFocusOptions(
  ability
) {
  const options =
    getAbilityOption(
      ability
    )?.focusOptions;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


export function getAbilityLabel(
  ability
) {
  return (
    getAbilityOption(
      ability
    )?.label ||
    String(
      ability ||
      ""
    )
  );
}


function humanizeFocus(
  focus
) {
  return String(
    focus ||
    ""
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}


export function getAbilityFocusLabel(
  ability,
  focus
) {
  const normalized =
    String(
      focus ||
      ""
    )
      .trim()
      .toLowerCase();


  const option =
    getAbilityFocusOptions(
      ability
    )
      .find(
        (
          item
        ) =>
          String(
            item?.value ||
            ""
          )
            .trim()
            .toLowerCase() ===
          normalized
      );


  return (
    option?.label ||
    humanizeFocus(
      focus
    )
  );
}


export function getAbilityDisplayLabel(
  entryKey
) {
  const parsed =
    parseAbilityEntryKey(
      entryKey
    );


  const abilityLabel =
    getAbilityLabel(
      parsed.ability
    );


  if (
    !parsed.focus
  ) {
    return abilityLabel;
  }


  return (
    abilityLabel +
    ": " +
    getAbilityFocusLabel(
      parsed.ability,
      parsed.focus
    )
  );
}


export function getAbilityCatalogOptions() {
  return getAbilityOptions();
}
