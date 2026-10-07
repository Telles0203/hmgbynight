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


function cloneGrantMap(
  value
) {
  return (
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
      ? {
          ...value,
        }
      : {}
  );
}


export function getFixedClanAbilityGrants(
  character
) {
  return cloneGrantMap(
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.abilities
  );
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


export function getFixedClanBackgroundGrants(
  character
) {
  return cloneGrantMap(
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.backgrounds
  );
}


export function getFixedClanInfluenceGrants(
  character
) {
  return cloneGrantMap(
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.influences
  );
}


export function getClanBackgroundInfluenceChoiceGrants(
  character
) {
  const groups =
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.backgroundInfluenceChoices;


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
              ? group.options.map(
                  (
                    option
                  ) => ({
                    ...option,
                  })
                )
              : [],
        })
      )
    : [];
}


function getResourceSelections(
  state
) {
  const selections =
    state
      ?.clanGrantChoices
      ?.backgroundInfluence;


  return (
    selections &&
    typeof selections ===
      "object" &&
    !Array.isArray(
      selections
    )
      ? selections
      : {}
  );
}


function addGrant(
  target,
  key,
  level = 1
) {
  const normalizedKey =
    String(
      key ||
      ""
    )
      .trim()
      .toLowerCase();


  const normalizedLevel =
    Number(
      level
    );


  if (
    !normalizedKey ||
    !Number.isInteger(
      normalizedLevel
    ) ||
    normalizedLevel <=
      0
  ) {
    return;
  }


  target[
    normalizedKey
  ] =
    (
      target[
        normalizedKey
      ] ||
      0
    ) +
    normalizedLevel;
}


export function resolveCharacterClanResourceGrants(
  character,
  state
) {
  const backgrounds =
    getFixedClanBackgroundGrants(
      character
    );


  const influences =
    getFixedClanInfluenceGrants(
      character
    );


  const abilities =
    {};


  const selections =
    getResourceSelections(
      state
    );


  const resolvedSelections =
    {};


  const pendingChoices =
    [];


  getClanBackgroundInfluenceChoiceGrants(
    character
  ).forEach(
    (
      group
    ) => {
      const selectedKey =
        String(
          selections[
            group.id
          ] ||
          ""
        )
          .trim()
          .toLowerCase();


      const option =
        group.options.find(
          (
            candidate
          ) =>
            String(
              candidate?.key ||
              ""
            )
              .trim()
              .toLowerCase() ===
            selectedKey
        );


      if (!option) {
        pendingChoices.push(
          group.id
        );


        return;
      }


      resolvedSelections[
        group.id
      ] =
        option.key;


      if (
        option.section ===
        "backgrounds"
      ) {
        addGrant(
          backgrounds,
          option.value
        );
      }


      if (
        option.section ===
        "influences"
      ) {
        addGrant(
          influences,
          option.value
        );
      }


      if (
        option.linkedAbility
      ) {
        addGrant(
          abilities,
          option.linkedAbility
        );
      }
    }
  );


  return {
    backgrounds,

    influences,

    abilities,

    selections:
      resolvedSelections,

    pendingChoices,
  };
}


export function getResolvedClanAbilityGrants(
  character,
  state
) {
  const result =
    getFixedClanAbilityGrants(
      character
    );


  const linkedAbilities =
    resolveCharacterClanResourceGrants(
      character,
      state
    )
      .abilities;


  Object.entries(
    linkedAbilities
  ).forEach(
    ([
      ability,
      level,
    ]) => {
      addGrant(
        result,
        ability,
        level
      );
    }
  );


  return result;
}


export function getFixedClanNegativeTraitGrants(
  character,
  category
) {
  const source =
    getCharacterClanRule(
      character
    )
      ?.grants
      ?.negativeTraits ||
    {};


  const cloneEntries =
    (
      entries
    ) =>
      Array.isArray(
        entries
      )
        ? entries.map(
            (
              entry
            ) => ({
              ...entry,
            })
          )
        : [];


  if (
    category
  ) {
    return cloneEntries(
      source[
        category
      ]
    );
  }


  return {
    physical:
      cloneEntries(
        source.physical
      ),

    social:
      cloneEntries(
        source.social
      ),

    mental:
      cloneEntries(
        source.mental
      ),
  };
}
