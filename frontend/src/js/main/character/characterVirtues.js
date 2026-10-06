import {
  VIRTUE_DRAFT_VERSION,
  loadVirtueDraft,
  saveVirtueDraftLocal,
  removeVirtueDraft,
} from "./virtues/characterVirtueDraftStore.js";

import {
  calculateVirtueProgress,
  getActiveVirtue,
  getCharacterById,
  getEditableActiveVirtueValues,
  hasVirtueDraftChanges,
  isValidVirtueDraft,
  updateCharacterVirtueLocalState,
} from "./virtues/characterVirtueProgress.js";

import {
  clearVirtueError,
  renderSavedVirtueState,
  renderVirtueEditState,
  setVirtueBusy,
  showVirtueError,
} from "./virtues/characterVirtueView.js";

import {
  updateCharacterSheetDraftLocal,
} from "./draft/characterDraftState.js";

import {
  refreshCharacterDraftIndicators,
} from "./draft/characterDraftIndicators.js";


export async function handleCharacterVirtueClick(
  event,
  container
) {
  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (
    !target
  ) {
    return false;
  }


  const button =
    target.closest(
      "[data-character-virtue-action]"
    );


  if (
    !button ||
    !container.contains(
      button
    )
  ) {
    return false;
  }


  event.preventDefault();


  const section =
    button.closest(
      ".character-virtues-section"
    );


  if (
    !section
  ) {
    return true;
  }


  const characterId =
    String(
      section.dataset
        .characterId ||
      ""
    );


  if (
    !characterId
  ) {
    return true;
  }


  const character =
    getCharacterById(
      characterId
    );


  if (
    !character
  ) {
    return true;
  }


  const action =
    String(
      button.dataset
        .characterVirtueAction ||
      ""
    );


  if (
    action ===
    "edit"
  ) {
    startVirtueEdit(
      section,
      character
    );


    return true;
  }


  if (
    action ===
    "cancel"
  ) {
    cancelVirtueEdit(
      section,
      character
    );


    return true;
  }


  if (
    action ===
    "save"
  ) {
    await saveVirtueDraft(
      section,
      character
    );


    return true;
  }


  if (
    action ===
      "increase" ||
    action ===
      "decrease"
  ) {
    changeVirtueDraft({
      section,
      character,
      button,

      direction:
        action ===
        "increase"
          ? 1
          : -1,
    });


    return true;
  }


  return true;
}


export function restoreCharacterVirtueDrafts(
  container
) {
  const sections =
    container.querySelectorAll(
      ".character-virtues-section"
    );


  sections.forEach(
    (
      section
    ) => {
      const characterId =
        String(
          section.dataset
            .characterId ||
          ""
        );


      if (
        !characterId
      ) {
        return;
      }


      const editable =
        section.dataset
          .virtuesEditable ===
        "true";


      if (
        !editable
      ) {
        return;
      }


      const character =
        getCharacterById(
          characterId
        );


      if (
        !character
      ) {
        return;
      }


      const draft =
        loadVirtueDraft(
          characterId
        );


      if (
        !draft
      ) {
        renderSavedVirtueState(
          section,
          character
        );


        return;
      }


      if (
        !isValidVirtueDraft(
          character,
          draft.values
        )
      ) {
        removeVirtueDraft(
          characterId
        );


        renderSavedVirtueState(
          section,
          character
        );


        return;
      }


      renderVirtueEditState(
        section,
        character,
        draft.values
      );
    }
  );
}


function startVirtueEdit(
  section,
  character
) {
  if (
    section.dataset
      .virtuesEditable !==
    "true"
  ) {
    return;
  }


  let draft =
    loadVirtueDraft(
      character.id
    );


  if (
    !draft ||
    !isValidVirtueDraft(
      character,
      draft.values
    )
  ) {
    draft = {
      version:
        VIRTUE_DRAFT_VERSION,

      values:
        getEditableActiveVirtueValues(
          character
        ),

      updatedAt:
        Date.now(),
    };


    saveVirtueDraftLocal(
      character.id,
      draft
    );
  }


  renderVirtueEditState(
    section,
    character,
    draft.values
  );
}


function changeVirtueDraft({
  section,
  character,
  button,
  direction,
}) {
  const row =
    button.closest(
      ".character-virtue-row"
    );


  if (
    !row
  ) {
    return;
  }


  const virtueKey =
    String(
      row.dataset
        .virtueKey ||
      ""
    );


  if (
    !virtueKey
  ) {
    return;
  }


  const draft =
    loadVirtueDraft(
      character.id
    );


  if (
    !draft
  ) {
    return;
  }


  const virtue =
    getActiveVirtue(
      character,
      virtueKey
    );


  if (
    !virtue
  ) {
    return;
  }


  const minimum =
    Number.isFinite(
      virtue.minimum
    )
      ? virtue.minimum
      : 0;


  const maximum =
    Number.isFinite(
      virtue.maximum
    )
      ? virtue.maximum
      : 5;


  const current =
    Number.isFinite(
      draft.values[
        virtueKey
      ]
    )
      ? draft.values[
          virtueKey
        ]
      : minimum;


  const next =
    current +
    direction;


  if (
    next <
      minimum ||
    next >
      maximum
  ) {
    return;
  }


  const proposed = {
    ...draft.values,

    [
      virtueKey
    ]:
      next,
  };


  const progress =
    calculateVirtueProgress(
      character,
      proposed
    );


  if (
    progress.spent >
    progress.total
  ) {
    return;
  }


  const nextDraft = {
    version:
      VIRTUE_DRAFT_VERSION,

    values:
      proposed,

    updatedAt:
      Date.now(),
  };


  saveVirtueDraftLocal(
    character.id,
    nextDraft
  );


  renderVirtueEditState(
    section,
    character,
    proposed
  );
}


async function saveVirtueDraft(
  section,
  character
) {
  const draft =
    loadVirtueDraft(
      character.id
    );


  if (
    !draft
  ) {
    renderSavedVirtueState(
      section,
      character
    );


    return;
  }


  if (
    !hasVirtueDraftChanges(
      character,
      draft.values
    )
  ) {
    removeVirtueDraft(
      character.id
    );


    renderSavedVirtueState(
      section,
      character
    );


    return;
  }


  const errorElement =
    section.querySelector(
      ".character-virtue-error"
    );


  clearVirtueError(
    errorElement
  );


  setVirtueBusy(
    section,
    true
  );


  try {
    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          character.id
        )}/virtues`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              virtues:
                draft.values,
            }),
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        "Não foi possível salvar as Virtudes."
      );
    }


    if (
      !data.character
    ) {
      throw new Error(
        "O servidor não retornou as Virtudes atualizadas."
      );
    }


    if (
      data.savedAsDraft
    ) {
      updateCharacterSheetDraftLocal(
        character,
        data.sheetDraft,
        {
          field:
            "virtues",
        }
      );

    } else {
      updateCharacterVirtueLocalState(
        character,
        data.character
      );
    }


    removeVirtueDraft(
      character.id
    );


    renderSavedVirtueState(
      section,
      character
    );


    refreshCharacterDraftIndicators(
      character.id
    );

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao salvar Virtudes:",
      error
    );


    showVirtueError(
      errorElement,
      error?.message ||
      "Não foi possível salvar as Virtudes."
    );


    renderVirtueEditState(
      section,
      character,
      draft.values
    );

  } finally {
    setVirtueBusy(
      section,
      false
    );
  }
}


function cancelVirtueEdit(
  section,
  character
) {
  removeVirtueDraft(
    character.id
  );


  clearVirtueError(
    section.querySelector(
      ".character-virtue-error"
    )
  );


  renderSavedVirtueState(
    section,
    character
  );


  refreshCharacterDraftIndicators(
    character.id
  );
}