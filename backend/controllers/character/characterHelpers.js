const {
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../../data/vampire/archetypes"
);


const {
  DEFAULT_MORALITY_PATH,
  getCoreMoralityPathLabel,
  isCoreMoralityPathRef,
} = require(
  "../../data/vampire/moralityPaths"
);


const {
  VIRTUE_MAX,
  getActiveVirtues,
  getVirtueMinimumValue,
  getVirtueCreationProgress,
} = require(
  "../../data/vampire/virtues"
);


// =============================================
// Character constants
// =============================================

const CHARACTER_NAME_MIN_LENGTH =
  2;

const CHARACTER_NAME_MAX_LENGTH =
  60;

const CHARACTER_CONCEPT_MAX_LENGTH =
  120;


// =============================================
// House / Chronicle serializer
// =============================================

function serializeHouse(
  house
) {
  if (!house) {
    return null;
  }


  if (
    typeof house ===
      "object" &&
    house._id
  ) {
    return {
      id:
        house._id,

      name:
        house.name || "",
    };
  }


  return {
    id:
      house,

    name:
      "",
  };
}


// =============================================
// Archetype serializer
// =============================================

function serializeArchetype(
  value
) {
  const ref =
    String(
      value || ""
    );


  if (!ref) {
    return {
      ref:
        "",

      label:
        "",
    };
  }


  if (
    isCoreArchetypeRef(
      ref
    )
  ) {
    return {
      ref,

      label:
        getCoreArchetypeLabel(
          ref
        ),
    };
  }


  return {
    ref,

    label:
      ref,
  };
}


// =============================================
// Morality Path serializer
// =============================================

function serializeMoralityPath(
  value
) {
  const ref =
    String(
      value ||
      DEFAULT_MORALITY_PATH
    );


  if (
    isCoreMoralityPathRef(
      ref
    )
  ) {
    return {
      ref,

      label:
        getCoreMoralityPathLabel(
          ref
        ),
    };
  }


  return {
    ref,

    label:
      ref,
  };
}


// =============================================
// Virtues serializer
// =============================================

function serializeVirtues(
  moralityPathRef,
  virtues = {}
) {
  const values = {
    conscience:
      normalizeVirtueValue(
        virtues?.conscience
      ),

    conviction:
      normalizeVirtueValue(
        virtues?.conviction
      ),

    selfControl:
      normalizeVirtueValue(
        virtues?.selfControl
      ),

    instinct:
      normalizeVirtueValue(
        virtues?.instinct
      ),

    courage:
      normalizeVirtueValue(
        virtues?.courage
      ),
  };


  const active =
    getActiveVirtues(
      moralityPathRef
    ).map(
      (virtue) => {
        const minimum =
          getVirtueMinimumValue(
            moralityPathRef,
            virtue.key
          );


        return {
          key:
            virtue.key,

          label:
            virtue.label,

          value:
            values[
              virtue.key
            ],

          minimum:
            Number.isFinite(
              minimum
            )
              ? minimum
              : 0,

          maximum:
            VIRTUE_MAX,
        };
      }
    );


  const points =
    getVirtueCreationProgress(
      moralityPathRef,
      values
    );


  return {
    values,
    active,
    points,
  };
}


// =============================================
// Normalize Virtue value
// =============================================

function normalizeVirtueValue(
  value
) {
  return Number.isFinite(
    value
  )
    ? value
    : null;
}


// =============================================
// Exports
// =============================================

module.exports = {
  CHARACTER_NAME_MIN_LENGTH,
  CHARACTER_NAME_MAX_LENGTH,
  CHARACTER_CONCEPT_MAX_LENGTH,
  serializeHouse,
  serializeArchetype,
  serializeMoralityPath,
  serializeVirtues,
};