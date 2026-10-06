const CHARACTER_SHEET_LIFECYCLES = {
  INITIAL_DISTRIBUTION_PENDING:
    "initial_distribution_pending",

  INITIAL_REVIEW_PENDING:
    "initial_review_pending",

  ACTIVE:
    "active",
};


const CHARACTER_SHEET_LIFECYCLE_VALUES =
  Object.values(
    CHARACTER_SHEET_LIFECYCLES
  );


const DEFAULT_CHARACTER_SHEET_LIFECYCLE =
  CHARACTER_SHEET_LIFECYCLES
    .INITIAL_DISTRIBUTION_PENDING;


function normalizeCharacterSheetLifecycle(
  value
) {
  const normalized =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    CHARACTER_SHEET_LIFECYCLE_VALUES
      .includes(
        normalized
      )
  ) {
    return normalized;
  }


  return DEFAULT_CHARACTER_SHEET_LIFECYCLE;
}


module.exports = {
  CHARACTER_SHEET_LIFECYCLES,
  CHARACTER_SHEET_LIFECYCLE_VALUES,
  DEFAULT_CHARACTER_SHEET_LIFECYCLE,
  normalizeCharacterSheetLifecycle,
};