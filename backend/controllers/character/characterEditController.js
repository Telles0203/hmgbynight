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
  updateCharacterMoralityPath,
} = require(
  "./edit/characterMoralityPathEditController"
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
  updateCharacterMoralityPath,
  updateCharacterVirtues,
  updateCharacterVirtue,
  updateCharacterCreation,
};