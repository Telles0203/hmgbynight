function getCharacterOptions() {
  return (
    window.ByNightMain
      ?.character
      ?.options ||
    {}
  );
}


export function getEffectiveCharacterClan(
  character
) {
  const draftClan =
    character
      ?.sheetDraft
      ?.changes
      ?.clan;


  if (
    typeof draftClan ===
      "string" &&
    draftClan.trim()
  ) {
    return draftClan
      .trim()
      .toLowerCase();
  }


  return String(
    character?.clan ||
    ""
  )
    .trim()
    .toLowerCase();
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
    getEffectiveCharacterClan(
      character
    )
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


export function getFixedClanAbilityGrants(
  character
) {
  const rule =
    getCharacterClanRule(
      character
    );


  const abilities =
    rule
      ?.grants
      ?.abilities;


  if (
    !abilities ||
    typeof abilities !==
      "object" ||
    Array.isArray(
      abilities
    )
  ) {
    return {};
  }


  return {
    ...abilities,
  };
}


export function getClanAbilityChoiceGrants(
  character
) {
  const groups =
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.abilityChoices;


  return Array.isArray(
    groups
  )
    ? groups.map(
        (
          group
        ) => ({
          ...group,

          options:
            Array.isArray(
              group?.options
            )
              ? [
                  ...group.options,
                ]
              : [],
        })
      )
    : [];
}
