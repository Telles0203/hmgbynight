import {
  refreshCharacterCreationView,
} from "../creation/characterCreationViewRefresh.js";


export function applyClanDerivedSaveResult(
  character,
  data
) {
  if (
    !character ||
    !data
      ?.effectiveCreation ||
    typeof data
      .effectiveCreation !==
      "object"
  ) {
    return;
  }


  const savedClan =
    String(
      data
        ?.character
        ?.clan ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    data.savedAsDraft
  ) {
    character.draftCreation =
      data.effectiveCreation;

  } else {
    if (
      savedClan
    ) {
      character.clan =
        savedClan;
    }


    if (
      typeof data
        ?.character
        ?.clanDisplayName ===
        "string"
    ) {
      character.clanDisplayName =
        data.character
          .clanDisplayName;
    }


    character.creation =
      data.effectiveCreation;

    character.draftCreation =
      null;
  }


  refreshCharacterCreationView(
    character
  );
}
