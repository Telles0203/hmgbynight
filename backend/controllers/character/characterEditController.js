const {
  updateCharacterConcept,
  updateCharacterTitle,
  updateCharacterClan,
} = require(
  "./edit/characterBasicEditController"
);

const {
  updateCharacterNature,
  updateCharacterDemeanor,
} = require(
  "./edit/characterArchetypeEditController"
);

const {
  updateCharacterVirtues,
  updateCharacterVirtue,
} = require(
  "./edit/characterVirtueEditController"
);

const {
  updateCharacterCreation,
} = require(
  "./edit/characterCreationEditController"
);


module.exports = {
  updateCharacterConcept,
  updateCharacterTitle,
  updateCharacterClan,
  updateCharacterNature,
  updateCharacterDemeanor,
  updateCharacterVirtues,
  updateCharacterVirtue,
  updateCharacterCreation,
};