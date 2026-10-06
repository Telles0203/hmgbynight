const CHARACTER_SHEET_DRAFT_STATUSES = {
  DRAFT:
    "draft",

  SUBMITTED:
    "submitted",
};


const CHARACTER_SHEET_DRAFT_STATUS_VALUES =
  Object.values(
    CHARACTER_SHEET_DRAFT_STATUSES
  );


const CHARACTER_SHEET_DRAFT_FIELDS = [
  "title",
  "clan",
  "concept",
  "nature",
  "demeanor",
  "moralityPath",
  "virtues",
  "creation",
];


module.exports = {
  CHARACTER_SHEET_DRAFT_STATUSES,
  CHARACTER_SHEET_DRAFT_STATUS_VALUES,
  CHARACTER_SHEET_DRAFT_FIELDS,
};