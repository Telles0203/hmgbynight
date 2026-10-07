const {
  validateCharacterCreation,
} = require(
  "../../../rules/vampire/lotnr/validation"
);

const {
  serializeCharacterCreation,
} = require(
  "../characterCreationSerialization"
);


function buildClanDerivedCreation(
  character,
  clan
) {
  const proposedCharacter = {
    ...character,

    clan:
      String(
        clan ||
        ""
      )
        .trim()
        .toLowerCase(),
  };


  return serializeCharacterCreation(
    validateCharacterCreation(
      proposedCharacter
    )
  );
}


module.exports = {
  buildClanDerivedCreation,
};
