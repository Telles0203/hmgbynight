export function getBackgroundOptions() {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.backgrounds;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


export function getBackgroundOption(
  value
) {
  const key =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  return (
    getBackgroundOptions()
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
          key
      ) ||
    null
  );
}


export function getBackgroundLabel(
  value
) {
  const option =
    getBackgroundOption(
      value
    );


  if (
    option?.label
  ) {
    return option.label;
  }


  return String(
    value ||
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


export function getBackgroundCreationRules(
  character
) {
  const rules =
    window.ByNightMain
      ?.character
      ?.options
      ?.backgroundRules ||
    {};


  const defaultTotal =
    Number(
      rules.defaultTotal
    );


  const sabbatTotal =
    Number(
      rules.sabbatTotal
    );


  const maximum =
    Number(
      rules.maximumPerBackground
    );


  const freeTraitCost =
    Number(
      rules.freeTraitCost
    );


  return {
    total:
      character?.sect ===
      "sabbat"
        ? (
            Number.isInteger(
              sabbatTotal
            )
              ? sabbatTotal
              : 0
          )
        : (
            Number.isInteger(
              defaultTotal
            )
              ? defaultTotal
              : 5
          ),

    maximum:
      Number.isInteger(
        maximum
      )
        ? maximum
        : 5,

    freeTraitCost:
      Number.isInteger(
        freeTraitCost
      )
        ? freeTraitCost
        : 1,
  };
}


export function getBackgroundEntries(
  state
) {
  const current =
    state?.backgrounds &&
    typeof state.backgrounds ===
      "object"
      ? state.backgrounds
      : {};


  return Object.entries(
    current
  )
    .filter(
      ([
        key,
        level,
      ]) =>
        String(
          key ||
          ""
        ).trim() &&
        Number(
          level
        ) >
        0
    )
    .map(
      ([
        background,
        level,
      ]) => {
        const option =
          getBackgroundOption(
            background
          );


        return {
          background,

          level:
            Number(
              level
            ),

          specialMode:
            option
              ?.specialMode ||
            "standard",

          requiresNarratorApproval:
            option
              ?.requiresNarratorApproval ===
            true,
        };
      }
    );
}


export function getSelectableBackgroundOptions() {
  return getBackgroundOptions()
    .filter(
      (
        option
      ) =>
        String(
          option?.specialMode ||
          "standard"
        ) ===
        "standard"
    );
}
