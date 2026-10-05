const {
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../../data/vampire/archetypes"
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


  // =============================================
  // Core archetype
  // =============================================

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


  // =============================================
  // Chronicle archetype
  //
  // Ainda não implementado.
  //
  // Mantemos a referência desconhecida
  // intacta para evitar perda de dados
  // quando esse suporte for implementado.
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
};