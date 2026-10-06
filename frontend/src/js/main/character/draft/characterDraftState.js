export function getCharacterDraftChanges(
  character
) {
  const changes =
    character
      ?.sheetDraft
      ?.changes;


  if (
    !changes ||
    typeof changes !==
      "object" ||
    Array.isArray(
      changes
    )
  ) {
    return {};
  }


  return changes;
}


export function getCharacterDraftDisplayChanges(
  character
) {
  const displayChanges =
    character
      ?.sheetDraft
      ?.displayChanges;


  if (
    !displayChanges ||
    typeof displayChanges !==
      "object" ||
    Array.isArray(
      displayChanges
    )
  ) {
    return {};
  }


  return displayChanges;
}


export function hasCharacterDraftField(
  character,
  field
) {
  return Object.prototype
    .hasOwnProperty
    .call(
      getCharacterDraftChanges(
        character
      ),
      field
    );
}


export function getCharacterDraftFieldValue(
  character,
  field,
  fallback
) {
  if (
    !hasCharacterDraftField(
      character,
      field
    )
  ) {
    return fallback;
  }


  return getCharacterDraftChanges(
    character
  )[
    field
  ];
}


export function getCharacterDraftFieldDisplayValue(
  character,
  field,
  fallback
) {
  const displayChanges =
    getCharacterDraftDisplayChanges(
      character
    );


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        displayChanges,
        field
      )
  ) {
    return displayChanges[
      field
    ];
  }


  return fallback;
}


export function updateCharacterSheetDraftLocal(
  character,
  sheetDraft,
  {
    field,
    displayValue,
  } = {}
) {
  if (
    !character
  ) {
    return;
  }


  const previousDisplay = {
    ...getCharacterDraftDisplayChanges(
      character
    ),
  };


  const nextDraft =
    sheetDraft &&
    typeof sheetDraft ===
      "object"
      ? {
          ...sheetDraft,
        }
      : {
          hasChanges:
            false,

          status:
            null,

          fields:
            [],

          changes:
            {},

          displayChanges:
            {},
        };


  if (
    !nextDraft.changes ||
    typeof nextDraft.changes !==
      "object" ||
    Array.isArray(
      nextDraft.changes
    )
  ) {
    nextDraft.changes =
      {};
  }


  nextDraft.displayChanges = {
    ...previousDisplay,

    ...(
      nextDraft
        .displayChanges ||
      {}
    ),
  };


  if (
    field
  ) {
    if (
      Object.prototype
        .hasOwnProperty
        .call(
          nextDraft.changes,
          field
        )
    ) {
      if (
        displayValue !==
        undefined
      ) {
        nextDraft
          .displayChanges[
            field
          ] =
            displayValue;
      }

    } else {
      delete nextDraft
        .displayChanges[
          field
        ];
    }
  }


  if (
    !nextDraft.hasChanges
  ) {
    nextDraft.fields =
      [];

    nextDraft.changes =
      {};

    nextDraft.displayChanges =
      {};
  }


  character.sheetDraft =
    nextDraft;
}