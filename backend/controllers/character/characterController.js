// =============================================
// Character Controller
//
// Agregador dos controllers de personagem.
// As rotas continuam importando somente este
// arquivo, enquanto a implementação fica
// separada por responsabilidade.
// =============================================


const {
  getCharacterOptions,
  listCharacters,
  getCharacterArchetypes,
} = require(
  "./character/characterReadController"
);


const {
  createCharacter,
} = require(
  "./character/characterCreateController"
);


const {
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
} = require(
  "./character/characterEditController"
);


const {
  requestMotherHouse,
} = require(
  "./character/characterChronicleController"
);


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