const {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
} = require(
  "./allocation/allocationHelpers"
);

const {
  validateAttributes,
  validateAbilities,
} = require(
  "./allocation/attributeAbilityRules"
);

const {
  validateDisciplines,
  validateBackgrounds,
} = require(
  "./allocation/disciplineBackgroundRules"
);

const {
  validateVirtues,
} = require(
  "./allocation/virtueAllocationRules"
);


module.exports = {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
  validateAttributes,
  validateAbilities,
  validateDisciplines,
  validateBackgrounds,
  validateVirtues,
};