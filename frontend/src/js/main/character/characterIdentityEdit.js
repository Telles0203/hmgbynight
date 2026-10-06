import {
  CHARACTER_IDENTITY_FIELD_CONFIG,
  getIdentityInputDisplayValue,
  getTitleMaxLength,
} from "./identity/characterIdentityConfig.js";

import {
  hideIdentityError,
  mountIdentityEditor,
  renderIdentityDisplay,
  showIdentityError,
  updateIdentityCardSummary,
} from "./identity/characterIdentityView.js";

import {
  applyMoralityPathSaveResult,
} from "./identity/characterMoralityPathState.js";

import {
  getCharacterDraftFieldDisplayValue,
  getCharacterDraftFieldValue,
  hasCharacterDraftField,
  updateCharacterSheetDraftLocal,
} from "./draft/characterDraftState.js";

import {
  refreshCharacterDraftIndicators,
} from "./draft/characterDraftIndicators.js";


let activeEditor =
  null;


export async function handleCharacterIdentityEditClick(
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


  const actionElement =
    target.closest(
      "[data-character-identity-action]"
    );


  if (
    !actionElement ||
    !container.contains(
      actionElement
    )
  ) {
    return false;
  }


  const action =
    actionElement.dataset
      .characterIdentityAction;


  if (
    action ===
    "edit"
  ) {
    const row =
      actionElement.closest(
        ".character-identity-row"
      );


    if (
      !row
    ) {
      return true;
    }


    if (
      activeEditor &&
      activeEditor.row !==
      row
    ) {
      const saved =
        await saveActiveCharacterIdentityEdit();


      if (
        !saved
      ) {
        return true;
      }
    }


    openEditor(
      row
    );


    return true;
  }


  if (
    action ===
    "save"
  ) {
    await saveActiveCharacterIdentityEdit();


    return true;
  }


  if (
    action ===
    "cancel"
  ) {
    cancelActiveCharacterIdentityEdit();


    return true;
  }


  return false;
}


export async function saveActiveCharacterIdentityEdit() {
  if (
    !activeEditor
  ) {
    return true;
  }


  const {
    character,
    characterId,
    field,
    config,
    row,
    officialValue,
    officialDisplayValue,
    editValue,
    saveLabel,
  } =
    activeEditor;


  const input =
    row.querySelector(
      ".character-inline-input"
    );


  if (
    !input
  ) {
    activeEditor =
      null;


    row.classList.remove(
      "is-editing"
    );


    return true;
  }


  const value =
    String(
      input.value ||
      ""
    ).trim();


  hideIdentityError(
    row
  );


  if (
    field ===
      "title" &&
    value.length >
      getTitleMaxLength()
  ) {
    showIdentityError(
      row,
      `Máximo de ${getTitleMaxLength()} caracteres.`
    );


    input.focus();


    return false;
  }


  if (
    (
      field ===
        "clan" ||
      field ===
        "moralityPath"
    ) &&
    !value
  ) {
    showIdentityError(
      row,
      `Selecione ${config.label}.`
    );


    input.focus();


    return false;
  }


  if (
    value ===
    editValue
  ) {
    finishEditor(
      row,
      field,
      officialValue,
      officialDisplayValue
    );


    return true;
  }


  const saveButton =
    row.querySelector(
      '[data-character-identity-action="save"]'
    );


  const cancelButton =
    row.querySelector(
      '[data-character-identity-action="cancel"]'
    );


  if (
    saveButton
  ) {
    saveButton.disabled =
      true;

    saveButton.textContent =
      "Salvando...";
  }


  if (
    cancelButton
  ) {
    cancelButton.disabled =
      true;
  }


  try {
    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          characterId
        )}/${config.endpoint}`,
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
              [
                config.property
              ]:
                value,
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
      showIdentityError(
        row,
        data?.error ||
        "Não foi possível salvar."
      );


      return false;
    }


    const savedValue =
      String(
        data.character?.[
          config.property
        ] ??
        value
      );


    const savedDisplayValue =
      config.labelProperty
        ? String(
            data.character?.[
              config.labelProperty
            ] ||
            getIdentityInputDisplayValue(
              input
            ) ||
            savedValue
          )
        : savedValue;


    if (
      data.savedAsDraft
    ) {
      updateCharacterSheetDraftLocal(
        character,
        data.sheetDraft,
        {
          field,

          displayValue:
            savedDisplayValue,
        }
      );


      if (
        field ===
        "moralityPath"
      ) {
        applyMoralityPathSaveResult(
          character,
          data
        );
      }


      finishEditor(
        row,
        field,
        officialValue,
        officialDisplayValue
      );


      refreshCharacterDraftIndicators(
        characterId
      );


      return true;
    }


    character[
      config.property
    ] =
      savedValue;


    if (
      config.labelProperty
    ) {
      character[
        config.labelProperty
      ] =
        savedDisplayValue;
    }


    if (
      field ===
      "moralityPath"
    ) {
      applyMoralityPathSaveResult(
        character,
        data
      );
    }


    updateIdentityCardSummary(
      characterId,
      field,
      savedDisplayValue
    );


    finishEditor(
      row,
      field,
      savedValue,
      savedDisplayValue
    );


    refreshCharacterDraftIndicators(
      characterId
    );


    return true;

  } catch (error) {
    console.error(
      "[CHARACTER IDENTITY] Erro ao salvar:",
      error
    );


    showIdentityError(
      row,
      "Erro de conexão com o servidor."
    );


    return false;

  } finally {
    const currentSaveButton =
      row.querySelector(
        '[data-character-identity-action="save"]'
      );


    const currentCancelButton =
      row.querySelector(
        '[data-character-identity-action="cancel"]'
      );


    if (
      currentSaveButton
    ) {
      currentSaveButton.disabled =
        false;

      currentSaveButton.textContent =
        saveLabel;
    }


    if (
      currentCancelButton
    ) {
      currentCancelButton.disabled =
        false;
    }
  }
}


export function cancelActiveCharacterIdentityEdit() {
  if (
    !activeEditor
  ) {
    return;
  }


  const {
    row,
    field,
    officialValue,
    officialDisplayValue,
  } =
    activeEditor;


  finishEditor(
    row,
    field,
    officialValue,
    officialDisplayValue
  );
}


function openEditor(
  row
) {
  const characterId =
    String(
      row.dataset
        .characterId ||
      ""
    );


  const field =
    String(
      row.dataset
        .characterField ||
      ""
    );


  const config =
    CHARACTER_IDENTITY_FIELD_CONFIG[
      field
    ];


  const character =
    getCharacter(
      characterId
    );


  if (
    !config ||
    !character
  ) {
    return;
  }


  const canEdit =
    character.editState
      ?.canEdit ??
    !character.motherHouse;


  if (
    !canEdit
  ) {
    window.alert(
      "Esta ficha não está disponível para edição neste estado."
    );


    return;
  }


  const officialValue =
    String(
      character[
        config.property
      ] ||
      ""
    );


  const officialDisplayValue =
    config.labelProperty
      ? String(
          character[
            config.labelProperty
          ] ||
          ""
        )
      : officialValue;


  const hasDraft =
    hasCharacterDraftField(
      character,
      field
    );


  const editValue =
    hasDraft
      ? String(
          getCharacterDraftFieldValue(
            character,
            field,
            officialValue
          ) ||
          ""
        )
      : officialValue;


  const editDisplayValue =
    hasDraft
      ? String(
          getCharacterDraftFieldDisplayValue(
            character,
            field,
            officialDisplayValue
          ) ||
          ""
        )
      : officialDisplayValue;


  const saveLabel =
    character.editState
      ?.mode ===
      "approval_draft"
      ? "Salvar rascunho"
      : "Salvar";


  activeEditor = {
    character,
    characterId,
    field,
    config,
    row,
    officialValue,
    officialDisplayValue,
    editValue,
    editDisplayValue,
    saveLabel,
  };


  mountIdentityEditor({
    row,
    config,

    value:
      editValue,

    displayValue:
      editDisplayValue,

    saveLabel,

    onSave:
      saveActiveCharacterIdentityEdit,

    onCancel:
      cancelActiveCharacterIdentityEdit,
  });
}


function finishEditor(
  row,
  field,
  value,
  displayValue
) {
  const config =
    CHARACTER_IDENTITY_FIELD_CONFIG[
      field
    ];


  activeEditor =
    null;


  if (
    !config
  ) {
    row.classList.remove(
      "is-editing"
    );


    return;
  }


  renderIdentityDisplay(
    row,
    config,
    value,
    displayValue
  );
}


function getCharacter(
  characterId
) {
  return (
    window.ByNightMain
      ?.character
      ?.characters
      ?.find(
        (
          character
        ) =>
          String(
            character.id
          ) ===
          String(
            characterId
          )
      ) ||
    null
  );
}


function setupCharacterIdentityEdit() {
  const container =
    document.getElementById(
      "characterListContainer"
    );


  if (
    !container ||
    container.dataset
      .identityEditBound ===
      "true"
  ) {
    return;
  }


  container.dataset
    .identityEditBound =
      "true";


  container.addEventListener(
    "click",
    async (
      event
    ) => {
      await handleCharacterIdentityEditClick(
        event,
        container
      );
    }
  );
}


window.setupCharacterIdentityEdit =
  setupCharacterIdentityEdit;