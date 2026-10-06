const {
  validateCharacterCreation,
} = require(
  "../vampire/lotnr/validation"
);


function getCharacterCreationProgress(
  character = {}
) {
  return validateCharacterCreation(
    character
  );
}


module.exports = {
  getCharacterCreationProgress,
};