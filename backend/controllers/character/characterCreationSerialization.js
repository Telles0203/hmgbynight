function serializeCharacterCreation(
  result
) {
  if (
    !result ||
    typeof result !==
      "object"
  ) {
    return null;
  }


  return {
    ruleset:
      result.ruleset ||
      null,

    state:
      result.creation ||
      {},

    sections:
      result.sections ||
      {},

    derived:
      result.derived ||
      {},

    freeTraits:
      result.freeTraits ||
      {},

    approvalsRequired:
      Array.isArray(
        result.approvalsRequired
      )
        ? result.approvalsRequired
        : [],

    validation:
      result.validation ||
      {
        valid:
          false,

        complete:
          false,

        errors:
          [],

        incompleteSections:
          [],
      },
  };
}


module.exports = {
  serializeCharacterCreation,
};