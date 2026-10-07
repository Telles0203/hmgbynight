const {
  INFLUENCE_AREAS,
  INFLUENCE_AREA_LABELS,
} = require(
  "../../../data/vampire/backgrounds"
);


function createInfluenceOption(
  value,
  overrides = {}
) {
  return Object.freeze({
    key:
      `influence::${value}`,

    section:
      "influences",

    value,

    label:
      INFLUENCE_AREA_LABELS[
        value
      ] ||
      value,

    ...overrides,
  });
}


function createBackgroundOption(
  value,
  label
) {
  return Object.freeze({
    key:
      `background::${value}`,

    section:
      "backgrounds",

    value,

    label,
  });
}


function createInfluenceOptions(
  values
) {
  return Object.freeze(
    values.map(
      (
        value
      ) =>
        createInfluenceOption(
          value
        )
    )
  );
}


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
              createInfluenceOption(
                "political",
                {
                  linkedAbility:
                    "politics",
                }
              ),

              createInfluenceOption(
                "university",
                {
                  linkedAbility:
                    "academics",
                }
              ),

              createInfluenceOption(
                "street",
                {
                  linkedAbility:
                    "streetwise",
                }
              ),
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
            createInfluenceOptions([
              "political",
              "street",
              "underworld",
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
            createInfluenceOptions([
              "finance",
              "health",
            ]),
        }),

        Object.freeze({
          id:
            "giovanni_family_asset",

          label:
            "Segundo benefício Giovanni",

          options:
            Object.freeze([
              createInfluenceOption(
                "finance",
                {
                  label:
                    "Finance +1",
                }
              ),

              createInfluenceOption(
                "health",
                {
                  label:
                    "Health +1",
                }
              ),

              createBackgroundOption(
                "retainers",
                "Retainers +1"
              ),
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
            createInfluenceOptions([
              "church",
              "political",
              "underworld",
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
            createInfluenceOptions([
              "street",
              "transportation",
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
            createInfluenceOptions(
              INFLUENCE_AREAS
            ),
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
