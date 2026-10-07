const {
  getCharacterCreationProgress,
} = require(
  "../../../rules/characterCreation/characterCreationProgress"
);

const {
  serializeCharacterCreation,
} = require(
  "../characterCreationSerialization"
);


function buildCharacterCreationAfterVirtueChange(
  character,
  proposedVirtues
) {
  const effectiveCharacter = {
    ...(
      character ||
      {}
    ),

    virtues: {
      ...(
        proposedVirtues ||
        {}
      ),
    },
  };


  return serializeCharacterCreation(
    getCharacterCreationProgress(
      effectiveCharacter
    )
  );
}


module.exports = {
  buildCharacterCreationAfterVirtueChange,
};
