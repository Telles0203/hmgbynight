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
  updateCharacterTitle,
  updateCharacterClan,
  updateCharacterNature,
  updateCharacterDemeanor,
  updateCharacterVirtues,
  updateCharacterVirtue,
} = require(
  "./character/characterEditController"
);

const {
  requestMotherHouse,
  cancelMotherHouseRequest,
} = require(
  "./character/characterChronicleController"
);

const {
  deleteCharacter,
} = require(
  "./character/characterDeleteController"
);


module.exports = {
  getCharacterOptions,
  createCharacter,
  listCharacters,
  getCharacterArchetypes,
  updateCharacterConcept,
  updateCharacterTitle,
  updateCharacterClan,
  updateCharacterNature,
  updateCharacterDemeanor,
  updateCharacterVirtues,
  updateCharacterVirtue,
  requestMotherHouse,
  cancelMotherHouseRequest,
  deleteCharacter,
};