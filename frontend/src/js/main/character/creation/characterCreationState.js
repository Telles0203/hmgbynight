import {
  updateCharacterSheetDraftLocal,
} from "../draft/characterDraftState.js";


export function cloneCreationState(
  value
) {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return {};
  }


  return JSON.parse(
    JSON.stringify(
      value
    )
  );
}


export function getOfficialCreationState(
  character
) {
  return cloneCreationState(
    character
      ?.creation
      ?.state ||
    {}
  );
}


export function getEditableCreationState(
  character
) {
  if (
    character
      ?.draftCreation
      ?.state
  ) {
    return cloneCreationState(
      character
        .draftCreation
        .state
    );
  }


  const draftState =
    character
      ?.sheetDraft
      ?.changes
      ?.creation;


  if (
    draftState &&
    typeof draftState ===
      "object"
  ) {
    return cloneCreationState(
      draftState
    );
  }


  return getOfficialCreationState(
    character
  );
}


export function applyCreationSaveResult(
  character,
  data
) {
  if (
    !character ||
    !data?.creation
  ) {
    return;
  }


  if (
    data.savedAsDraft
  ) {
    character.draftCreation =
      data.creation;


    updateCharacterSheetDraftLocal(
      character,
      data.sheetDraft,
      {
        field:
          "creation",
      }
    );


    return;
  }


  character.creation =
    data.creation;

  character.draftCreation =
    null;
}