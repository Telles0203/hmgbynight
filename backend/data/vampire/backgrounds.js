const INFLUENCE_AREAS =
  Object.freeze([
    "bureaucracy",
    "church",
    "finance",
    "health",
    "high_society",
    "industry",
    "legal",
    "media",
    "occult",
    "police",
    "political",
    "street",
    "transportation",
    "underworld",
    "university",
  ]);


const INFLUENCE_AREA_LABELS =
  Object.freeze({
    bureaucracy:
      "Bureaucracy",

    church:
      "Church",

    finance:
      "Finance",

    health:
      "Health",

    high_society:
      "High Society",

    industry:
      "Industry",

    legal:
      "Legal",

    media:
      "Media",

    occult:
      "Occult",

    police:
      "Police",

    political:
      "Political",

    street:
      "Street",

    transportation:
      "Transportation",

    underworld:
      "Underworld",

    university:
      "University",
  });


const BACKGROUND_OPTIONS =
  Object.freeze([
    Object.freeze({
      value:
        "allies",

      label:
        "Allies",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "contacts",

      label:
        "Contacts",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "fame",

      label:
        "Fame",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "generation",

      label:
        "Generation",

      requiresNarratorApproval:
        true,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "herd",

      label:
        "Herd",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "influence",

      label:
        "Influence",

      requiresNarratorApproval:
        false,

      specialMode:
        "influence",

      influenceAreas:
        INFLUENCE_AREAS,

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,

          influenceStartsAtPage:
            96,
        }),
    }),

    Object.freeze({
      value:
        "mentor",

      label:
        "Mentor",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "resources",

      label:
        "Resources",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),

    Object.freeze({
      value:
        "retainers",

      label:
        "Retainers",

      requiresNarratorApproval:
        false,

      specialMode:
        "standard",

      reference:
        Object.freeze({
          book:
            "Laws of the Night Revised",

          descriptionsStartAtPage:
            93,
        }),
    }),
  ]);


const BACKGROUND_BY_VALUE =
  new Map(
    BACKGROUND_OPTIONS.map(
      (
        background
      ) => [
        background.value,
        background,
      ]
    )
  );


const CORE_BACKGROUNDS =
  Object.freeze(
    BACKGROUND_OPTIONS.map(
      (
        background
      ) =>
        background.value
    )
  );


function normalizeBackgroundKey(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function isCoreBackground(
  value
) {
  return BACKGROUND_BY_VALUE.has(
    normalizeBackgroundKey(
      value
    )
  );
}


function getCoreBackground(
  value
) {
  return (
    BACKGROUND_BY_VALUE.get(
      normalizeBackgroundKey(
        value
      )
    ) ||
    null
  );
}


function getCoreBackgroundLabel(
  value
) {
  return (
    getCoreBackground(
      value
    )?.label ||
    ""
  );
}


function getInfluenceAreas() {
  return INFLUENCE_AREAS.map(
    (
      value
    ) => ({
      value,

      label:
        INFLUENCE_AREA_LABELS[
          value
        ] ||
        value,
    })
  );
}


function getCoreBackgrounds() {
  return BACKGROUND_OPTIONS.map(
    (
      background
    ) => ({
      value:
        background.value,

      label:
        background.label,

      requiresNarratorApproval:
        background
          .requiresNarratorApproval ===
        true,

      specialMode:
        background.specialMode,

      influenceAreas:
        background.value ===
        "influence"
          ? getInfluenceAreas()
          : [],

      reference: {
        ...background.reference,
      },
    })
  );
}


module.exports = {
  INFLUENCE_AREAS,
  INFLUENCE_AREA_LABELS,
  BACKGROUND_OPTIONS,
  CORE_BACKGROUNDS,
  normalizeBackgroundKey,
  isCoreBackground,
  getCoreBackground,
  getCoreBackgroundLabel,
  getInfluenceAreas,
  getCoreBackgrounds,
};
