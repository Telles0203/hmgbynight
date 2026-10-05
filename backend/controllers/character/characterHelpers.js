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


  // =============================================
  // Future Chronicle custom path
  // =============================================

  return {
    ref,

    label:
      ref,
  };
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
};