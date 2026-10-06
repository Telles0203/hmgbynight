import {
  CHARACTER_INLINE_FIELD_CONFIG,
} from "./inline/characterInlineConfig.js";

import {
  getCharacterById,
  loadCharacterArchetypes,
} from "./inline/characterInlineData.js";

import {
  getCharacterDisplayValue,
  getInputDisplayValue,
  hideInlineError,
  mountInlineEditor,
  renderFieldDisplay,
  showInlineError,
} from "./inline/characterInlineView.js";

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


export async function handleCharacterInlineEditClick(
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
      "[data-character-inline-action]"
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
    String(
      actionElement.dataset
        .characterInlineAction ||
      ""
    );


  if (
    action ===
    "edit"
  ) {
    const row =
      actionElement.closest(
        ".character-editable-row"
      );


    if (
      !row
    ) {
      return true;
    }


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


    if (
      activeEditor &&
      (
        String(
          activeEditor
            .characterId
        ) !==
          characterId ||
        activeEditor.field !==
          field
      )
    ) {
      const saved =
        await saveActiveCharacterInlineEdit();


      if (
        !saved
      ) {
        return true;
      }
    }


    await openInlineEditor(
      row,
      characterId,
      field
    );


    return true;
  }


  if (
    action ===
    "save"
  ) {
    await saveActiveCharacterInlineEdit();


    return true;
  }


  if (
    action ===
    "cancel"
  ) {
    cancelActiveCharacterInlineEdit();


    return true;
  }


  return false;
}


export async function saveActiveCharacterInlineEdit() {
  if (
    !activeEditor
  ) {
    return true;
  }


  const {
    characterId,
    field,
    row,
    officialValue,
    officialDisplayValue,
    editValue,
    saveLabel,
  } =
    activeEditor;


  const config =
    CHARACTER_INLINE_FIELD_CONFIG[
      field
    ];


  if (
    !config
  ) {
    return false;
  }


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


  hideInlineError(
    row
  );


  if (
    config.editorType ===
      "text" &&
    typeof config.maxLength ===
      "number" &&
    value.length >
      config.maxLength
  ) {
    showInlineError(
      row,
      `Máximo de ${config.maxLength} caracteres.`
    );


    input.focus();


    return false;
  }


  if (
    value ===
    editValue
  ) {
    finishInlineEditor(
      row,
      field,
      officialValue,
      officialDisplayValue
    );


    return true;
  }


  const selectedDisplayValue =
    getInputDisplayValue(
      input,
      config,
      value
    );


  const saveButton =
    row.querySelector(
      '[data-character-inline-action="save"]'
    );


  const cancelButton =
    row.querySelector(
      '[data-character-inline-action="cancel"]'
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
        )}/${encodeURIComponent(
          config.endpoint
        )}`,
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
      showInlineError(
        row,
        data?.error ||
        "Não foi possível salvar."
      );


      return false;
    }


    const savedValue =
      String(
        data?.character?.[
          config.property
        ] ??
        value
      );


    let savedDisplayValue =
      savedValue;


    if (
      config.labelProperty
    ) {
      const returnedLabel =
        data?.character?.[
          config.labelProperty
        ];


      savedDisplayValue =
        typeof returnedLabel ===
          "string"
          ? returnedLabel
          : selectedDisplayValue;
    }


    const character =
      getCharacterById(
        characterId
      );


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


      finishInlineEditor(
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


    if (
      character
    ) {
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
    }


    finishInlineEditor(
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
      "[CHARACTER INLINE EDIT] Erro ao salvar:",
      error
    );


    showInlineError(
      row,
      "Erro de conexão com o servidor."
    );


    return false;

  } finally {
    const currentSaveButton =
      row.querySelector(
        '[data-character-inline-action="save"]'
      );


    const currentCancelButton =
      row.querySelector(
        '[data-character-inline-action="cancel"]'
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


export function cancelActiveCharacterInlineEdit() {
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


  finishInlineEditor(
    row,
    field,
    officialValue,
    officialDisplayValue
  );
}


async function openInlineEditor(
  row,
  characterId,
  field
) {
  const config =
    CHARACTER_INLINE_FIELD_CONFIG[
      field
    ];


  if (
    !config
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


  if (
    activeEditor &&
    activeEditor.row ===
      row &&
    activeEditor.field ===
      field
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
    getCharacterDisplayValue(
      character,
      config
    );


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


  let archetypes =
    [];


  if (
    config.editorType ===
    "archetype"
  ) {
    try {
      archetypes =
        await loadCharacterArchetypes(
          characterId
        );

    } catch (error) {
      console.error(
        "[CHARACTER INLINE EDIT] Erro ao carregar arquétipos:",
        error
      );


      window.alert(
        "Não foi possível carregar as opções de Natureza e Comportamento."
      );


      return;
    }
  }


  const saveLabel =
    character.editState
      ?.mode ===
      "approval_draft"
      ? "Salvar rascunho"
      : "Salvar";


  activeEditor = {
    characterId,
    field,
    row,
    officialValue,
    officialDisplayValue,
    editValue,
    editDisplayValue,
    saveLabel,
  };


  mountInlineEditor({
    row,
    config,

    value:
      editValue,

    displayValue:
      editDisplayValue,

    archetypes,

    saveLabel,

    onSave:
      saveActiveCharacterInlineEdit,

    onCancel:
      cancelActiveCharacterInlineEdit,
  });
}


function finishInlineEditor(
  row,
  field,
  value,
  displayValue
) {
  const config =
    CHARACTER_INLINE_FIELD_CONFIG[
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


  renderFieldDisplay(
    row,
    config,
    value,
    displayValue
  );
}