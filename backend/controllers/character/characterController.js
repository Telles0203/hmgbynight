// =============================================
// Character Controller
//
// Agregador dos controllers de personagem.
// =============================================


// =============================================
// Read
// =============================================

const {
  getCharacterOptions,
  listCharacters,
  getCharacterArchetypes,
} = require(
  "./character/characterReadController"
);


// =============================================
// Create
// =============================================

const {
  createCharacter,
} = require(
  "./character/characterCreateController"
);


// =============================================
// Edit
// =============================================

const {
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
} = require(
  "./character/characterEditController"
);


// =============================================
// Chronicle
// =============================================

const {
  requestMotherHouse,
} = require(
  "./character/characterChronicleController"
);


// =============================================
// Delete
// =============================================

const {
  deleteCharacter,
} = require(
  "./character/characterDeleteController"
);


// =============================================
// Exports
// =============================================

module.exports = {
  getCharacterOptions,
  createCharacter,
  listCharacters,
  getCharacterArchetypes,
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
  requestMotherHouse,
  deleteCharacter,
};