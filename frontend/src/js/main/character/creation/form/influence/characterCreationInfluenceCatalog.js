export function getInfluenceOptions() {
  const backgrounds =
    window.ByNightMain
      ?.character
      ?.options
      ?.backgrounds;


  if (
    !Array.isArray(
      backgrounds
    )
  ) {
    return [];
  }


  const influence =
    backgrounds.find(
      (
        option
      ) =>
        String(
          option?.value ||
          ""
        )
          .trim()
          .toLowerCase() ===
        "influence"
    );


  return Array.isArray(
    influence
      ?.influenceAreas
  )
    ? influence
        .influenceAreas
    : [];
}


export function getInfluenceOption(
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
    getInfluenceOptions()
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


export function getInfluenceLabel(
  value
) {
  const option =
    getInfluenceOption(
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


export function getInfluenceEntries(
  state
) {
  const current =
    state?.influences &&
    typeof state.influences ===
      "object"
      ? state.influences
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
        influence,
        level,
      ]) => ({
        influence,

        level:
          Number(
            level
          ),
      }));
}
