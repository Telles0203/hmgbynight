import {
  createCharacterVirtuesSection,
} from "../view/sheet/characterSheetVirtues.js";

import {
  refreshCharacterCreationView,
} from "../creation/characterCreationViewRefresh.js";


function refreshVirtuesSection(
  character
) {
  const currentSection =
    document.querySelector(
      `.character-card[data-character-id="${CSS.escape(
        String(
          character.id
        )
      )}"] .character-virtues-section`
    );


  if (
    !currentSection
  ) {
    return;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createCharacterVirtuesSection({
      characterId:
        character.id,

      activeVirtues:
        character.activeVirtues ||
        [],

      virtuePoints:
        character.virtuePoints ||
        {
          total:
            7,

          spent:
            0,

          remaining:
            7,

          complete:
            false,
        },

      editable:
        character.editState
          ?.canEdit ??
        !character.motherHouse,
    });


  const replacement =
    wrapper.firstElementChild;


  if (
    !replacement
  ) {
    return;
  }


  currentSection.replaceWith(
    replacement
  );
}


export function applyMoralityPathSaveResult(
  character,
  data
) {
  if (
    !character ||
    !data
  ) {
    return;
  }


  if (
    data.savedAsDraft
  ) {
    if (
      data.creation
    ) {
      character.draftCreation =
        data.creation;
    }


    refreshCharacterCreationView(
      character
    );


    return;
  }


  const updated =
    data.character ||
    {};


  if (
    updated.virtues &&
    typeof updated.virtues ===
      "object"
  ) {
    character.virtues =
      updated.virtues;
  }


  if (
    Array.isArray(
      updated.activeVirtues
    )
  ) {
    character.activeVirtues =
      updated.activeVirtues;
  }


  if (
    updated.virtuePoints &&
    typeof updated.virtuePoints ===
      "object"
  ) {
    character.virtuePoints =
      updated.virtuePoints;
  }


  if (
    data.creation
  ) {
    character.creation =
      data.creation;

    character.draftCreation =
      null;
  }


  refreshVirtuesSection(
    character
  );


  refreshCharacterCreationView(
    character
  );
}