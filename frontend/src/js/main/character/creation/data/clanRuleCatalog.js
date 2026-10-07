function getCharacterOptions() {
  return (
    window.ByNightMain
      ?.character
      ?.options ||
    {}
  );
}


export function getClanRule(
  clan
) {
  const normalized =
    String(
      clan ||
      ""
    )
      .trim()
      .toLowerCase();


  return (
    getCharacterOptions()
      .clanRules
      ?.find(
        (
          rule
        ) =>
          String(
            rule?.clan ||
            ""
          )
            .trim()
            .toLowerCase() ===
          normalized
      ) ||
    null
  );
}


export function getCharacterClanRule(
  character
) {
  return getClanRule(
    character?.clan
  );
}


export function getDisciplineLabel(
  discipline
) {
  const normalized =
    String(
      discipline ||
      ""
    )
      .trim()
      .toLowerCase();


  const option =
    getCharacterOptions()
      .disciplines
      ?.find(
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


  if (
    option?.label
  ) {
    return option.label;
  }


  return normalized
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


export function getFixedClanDisciplines(
  character
) {
  const rule =
    getCharacterClanRule(
      character
    );


  if (
    rule
      ?.disciplines
      ?.mode !==
      "fixed"
  ) {
    return [];
  }


  return Array.isArray(
    rule
      ?.disciplines
      ?.values
  )
    ? [
        ...rule
          .disciplines
          .values,
      ]
    : [];
}


export function hasFixedClanDisciplines(
  character
) {
  return (
    getFixedClanDisciplines(
      character
    ).length >
    0
  );
}
