const FIXED_CLAN_RESOURCE_GRANTS =
  Object.freeze({
    tremere:
      Object.freeze({
        backgrounds:
          Object.freeze({}),

        influences:
          Object.freeze({
            occult:
              1,
          }),
      }),

    ventrue:
      Object.freeze({
        backgrounds:
          Object.freeze({
            resources:
              1,
          }),

        influences:
          Object.freeze({}),
      }),
  });


const CLAN_RESOURCE_CHOICE_GRANTS =
  Object.freeze({
    brujah:
      Object.freeze([
        Object.freeze({
          id:
            "revolution_influence",

          label:
            "Campo da revolução",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::political",

                section:
                  "influences",

                value:
                  "political",

                label:
                  "Political",

                linkedAbility:
                  "politics",
              }),

              Object.freeze({
                key:
                  "influence::university",

                section:
                  "influences",

                value:
                  "university",

                label:
                  "University",

                linkedAbility:
                  "academics",
              }),

              Object.freeze({
                key:
                  "influence::street",

                section:
                  "influences",

                value:
                  "street",

                label:
                  "Street",

                linkedAbility:
                  "streetwise",
              }),
            ]),
        }),
      ]),

    followers_of_set:
      Object.freeze([
        Object.freeze({
          id:
            "setite_connections",

          label:
            "Conexões Setitas",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::political",

                section:
                  "influences",

                value:
                  "political",

                label:
                  "Political",
              }),

              Object.freeze({
                key:
                  "influence::street",

                section:
                  "influences",

                value:
                  "street",

                label:
                  "Street",
              }),

              Object.freeze({
                key:
                  "influence::underworld",

                section:
                  "influences",

                value:
                  "underworld",

                label:
                  "Underworld",
              }),
            ]),
        }),
      ]),

    giovanni:
      Object.freeze([
        Object.freeze({
          id:
            "giovanni_family_influence",

          label:
            "Influência da família",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::finance",

                section:
                  "influences",

                value:
                  "finance",

                label:
                  "Finance",
              }),

              Object.freeze({
                key:
                  "influence::health",

                section:
                  "influences",

                value:
                  "health",

                label:
                  "Health",
              }),
            ]),
        }),

        Object.freeze({
          id:
            "giovanni_family_asset",

          label:
            "Segundo benefício Giovanni",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::finance",

                section:
                  "influences",

                value:
                  "finance",

                label:
                  "Finance +1",
              }),

              Object.freeze({
                key:
                  "influence::health",

                section:
                  "influences",

                value:
                  "health",

                label:
                  "Health +1",
              }),

              Object.freeze({
                key:
                  "background::retainers",

                section:
                  "backgrounds",

                value:
                  "retainers",

                label:
                  "Retainers +1",
              }),
            ]),
        }),
      ]),

    lasombra:
      Object.freeze([
        Object.freeze({
          id:
            "lasombra_influence",

          label:
            "Influência Lasombra",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::church",

                section:
                  "influences",

                value:
                  "church",

                label:
                  "Church",
              }),

              Object.freeze({
                key:
                  "influence::political",

                section:
                  "influences",

                value:
                  "political",

                label:
                  "Political",
              }),

              Object.freeze({
                key:
                  "influence::underworld",

                section:
                  "influences",

                value:
                  "underworld",

                label:
                  "Underworld",
              }),
            ]),
        }),
      ]),

    ravnos:
      Object.freeze([
        Object.freeze({
          id:
            "ravnos_influence",

          label:
            "Influência Ravnos",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::street",

                section:
                  "influences",

                value:
                  "street",

                label:
                  "Street",
              }),

              Object.freeze({
                key:
                  "influence::transportation",

                section:
                  "influences",

                value:
                  "transportation",

                label:
                  "Transportation",
              }),
            ]),
        }),
      ]),

    ventrue:
      Object.freeze([
        Object.freeze({
          id:
            "ventrue_influence",

          label:
            "Influência Ventrue",

          options:
            Object.freeze([
              Object.freeze({
                key:
                  "influence::finance",

                section:
                  "influences",

                value:
                  "finance",

                label:
                  "Finance",
              }),

              Object.freeze({
                key:
                  "influence::high_society",

                section:
                  "influences",

                value:
                  "high_society",

                label:
                  "High Society",
              }),

              Object.freeze({
                key:
                  "influence::political",

                section:
                  "influences",

                value:
                  "political",

                label:
                  "Political",
              }),
            ]),
        }),
      ]),
  });


const CONFIGURED_NO_RESOURCE_GRANT_CLANS =
  new Set([
    "assamite",
    "banu_haqim",
    "caitiff",
    "gangrel",
    "country_gangrel",
    "city_gangrel",
    "malkavian",
    "nosferatu",
    "toreador",
    "tzimisce",
  ]);


function normalizeClan(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function normalizeChoices(
  value
) {
  return (
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
      ? value
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


function cloneChoiceGroup(
  group
) {
  return {
    id:
      group.id,

    label:
      group.label,

    options:
      group.options.map(
        (
          option
        ) => ({
          ...option,
        })
      ),
  };
}


function getFixedClanResourceGrants(
  clan
) {
  const source =
    FIXED_CLAN_RESOURCE_GRANTS[
      normalizeClan(
        clan
      )
    ] ||
    {};


  return {
    backgrounds: {
      ...(
        source.backgrounds ||
        {}
      ),
    },

    influences: {
      ...(
        source.influences ||
        {}
      ),
    },
  };
}


function getClanResourceChoiceGrants(
  clan
) {
  const groups =
    CLAN_RESOURCE_CHOICE_GRANTS[
      normalizeClan(
        clan
      )
    ];


  return Array.isArray(
    groups
  )
    ? groups.map(
        cloneChoiceGroup
      )
    : [];
}


function resolveClanResourceGrants(
  clan,
  choices
) {
  const fixed =
    getFixedClanResourceGrants(
      clan
    );


  const backgrounds = {
    ...fixed.backgrounds,
  };


  const influences = {
    ...fixed.influences,
  };


  const abilities =
    {};


  const selections =
    {};


  const pendingChoices =
    [];


  const sourceChoices =
    normalizeChoices(
      choices
    );


  getClanResourceChoiceGrants(
    clan
  ).forEach(
    (
      group
    ) => {
      const selectedKey =
        String(
          sourceChoices[
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
            candidate.key ===
            selectedKey
        );


      if (!option) {
        pendingChoices.push(
          group.id
        );


        return;
      }


      selections[
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

    selections,

    pendingChoices,
  };
}


function getClanResourceGrantStatus(
  clan
) {
  const normalized =
    normalizeClan(
      clan
    );


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        CLAN_RESOURCE_CHOICE_GRANTS,
        normalized
      )
  ) {
    return "choice";
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        FIXED_CLAN_RESOURCE_GRANTS,
        normalized
      )
  ) {
    return "fixed";
  }


  if (
    CONFIGURED_NO_RESOURCE_GRANT_CLANS
      .has(
        normalized
      )
  ) {
    return "none";
  }


  return "pending";
}


module.exports = {
  FIXED_CLAN_RESOURCE_GRANTS,
  CLAN_RESOURCE_CHOICE_GRANTS,
  getFixedClanResourceGrants,
  getClanResourceChoiceGrants,
  resolveClanResourceGrants,
  getClanResourceGrantStatus,
};
