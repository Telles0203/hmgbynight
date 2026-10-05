// =============================================
// Character Inline Edit
// =============================================

let activeEditor =
  null;


// =============================================
// Field configuration
// =============================================

const FIELD_CONFIG = {
  concept: {
    property:
      "concept",

    endpoint:
      "concept",

    placeholder:
      "Digite o conceito...",

    maxLength:
      120,
  },
};


// =============================================
// Click handler
// =============================================

export async function handleCharacterInlineEditClick(
  event,
  container
) {
  const target =
    event.target instanceof Element
      ? event.target
      : null;


  if (!target) {
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


  // =============================================
  // Edit
  // =============================================

  if (
    action ===
    "edit"
  ) {
    const row =
      actionElement.closest(
        ".character-editable-row"
      );


    if (!row) {
      return true;
    }


    const characterId =
      String(
        row.dataset.characterId ||
          ""
      );


    const field =
      String(
        row.dataset.characterField ||
          ""
      );


    // =============================================
    // Autosave current field before
    // opening another one
    // =============================================

    if (
      activeEditor &&
      (
        String(
          activeEditor.characterId
        ) !==
          characterId ||
        activeEditor.field !==
          field
      )
    ) {
      const saved =
        await saveActiveCharacterInlineEdit();


      if (!saved) {
        return true;
      }
    }


    openInlineEditor(
      row,
      characterId,
      field
    );


    return true;
  }


  // =============================================
  // Save
  // =============================================

  if (
    action ===
    "save"
  ) {
    await saveActiveCharacterInlineEdit();

    return true;
  }


  // =============================================
  // Cancel
  // =============================================

  if (
    action ===
    "cancel"
  ) {
    cancelActiveCharacterInlineEdit();

    return true;
  }


  return false;
}


// =============================================
// Save active editor
// =============================================

export async function saveActiveCharacterInlineEdit() {
  if (!activeEditor) {
    return true;
  }


  const {
    characterId,
    field,
    row,
    originalValue,
  } =
    activeEditor;


  const config =
    FIELD_CONFIG[
      field
    ];


  if (!config) {
    return false;
  }


  const input =
    row.querySelector(
      ".character-inline-input"
    );


  if (!input) {
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


  // =============================================
  // Validation
  // =============================================

  if (
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


  // =============================================
  // Nothing changed
  // =============================================

  if (
    value ===
    originalValue
  ) {
    finishInlineEditor(
      row,
      field,
      value
    );


    return true;
  }


  const saveButton =
    row.querySelector(
      '[data-character-inline-action="save"]'
    );


  const cancelButton =
    row.querySelector(
      '[data-character-inline-action="cancel"]'
    );


  if (saveButton) {
    saveButton.disabled =
      true;

    saveButton.textContent =
      "Salvando...";
  }


  if (cancelButton) {
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
        .catch(() => ({}));


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


    // =============================================
    // Update local state
    // =============================================

    const character =
      getCharacter(
        characterId
      );


    if (character) {
      character[
        config.property
      ] =
        savedValue;
    }


    finishInlineEditor(
      row,
      field,
      savedValue
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


    if (currentSaveButton) {
      currentSaveButton.disabled =
        false;

      currentSaveButton.textContent =
        "Salvar";
    }


    if (currentCancelButton) {
      currentCancelButton.disabled =
        false;
    }
  }
}


// =============================================
// Cancel
// =============================================

export function cancelActiveCharacterInlineEdit() {
  if (!activeEditor) {
    return;
  }


  const {
    row,
    field,
    originalValue,
  } =
    activeEditor;


  finishInlineEditor(
    row,
    field,
    originalValue
  );
}


// =============================================
// Open editor
// =============================================

function openInlineEditor(
  row,
  characterId,
  field
) {
  const config =
    FIELD_CONFIG[
      field
    ];


  if (!config) {
    return;
  }


  const character =
    getCharacter(
      characterId
    );


  if (!character) {
    return;
  }


  // =============================================
  // Chronicle protection
  //
  // Sem Crônica:
  // edição direta.
  //
  // Aguardando Crônica:
  // ainda pode editar diretamente.
  //
  // Crônica aprovada:
  // não pode alterar diretamente.
  // =============================================

  if (
    character.motherHouse
  ) {
    window.alert(
      "Este personagem já pertence a uma Crônica. Alterações deverão ser aprovadas pela Crônica."
    );

    return;
  }


  const value =
    String(
      character[
        config.property
      ] ||
      ""
    );


  const container =
    row.querySelector(
      ".character-editable-value"
    );


  if (!container) {
    return;
  }


  activeEditor = {
    characterId,
    field,
    row,
    originalValue:
      value,
  };


  row.classList.add(
    "is-editing"
  );


  container.innerHTML =
    "";


  const editor =
    document.createElement(
      "div"
    );


  editor.className =
    "character-inline-editor";


  const input =
    document.createElement(
      "input"
    );


  input.type =
    "text";

  input.className =
    "form-control form-control-sm bg-black text-light border-secondary character-inline-input";

  input.value =
    value;

  input.maxLength =
    config.maxLength;

  input.placeholder =
    config.placeholder;

  input.autocomplete =
    "off";


  const actions =
    document.createElement(
      "div"
    );


  actions.className =
    "character-inline-actions";


  const saveButton =
    document.createElement(
      "button"
    );


  saveButton.type =
    "button";

  saveButton.className =
    "btn btn-blood btn-sm";

  saveButton.dataset
    .characterInlineAction =
      "save";

  saveButton.textContent =
    "Salvar";


  const cancelButton =
    document.createElement(
      "button"
    );


  cancelButton.type =
    "button";

  cancelButton.className =
    "btn btn-outline-secondary btn-sm";

  cancelButton.dataset
    .characterInlineAction =
      "cancel";

  cancelButton.textContent =
    "Cancelar";


  const error =
    document.createElement(
      "div"
    );


  error.className =
    "text-danger small d-none character-inline-error";


  actions.append(
    saveButton,
    cancelButton
  );


  editor.append(
    input,
    actions,
    error
  );


  container.appendChild(
    editor
  );


  input.focus();


  input.setSelectionRange(
    input.value.length,
    input.value.length
  );


  // =============================================
  // Keyboard
  //
  // Enter = salvar
  // Escape = cancelar
  // =============================================

  input.addEventListener(
    "keydown",
    async (event) => {
      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();

        await saveActiveCharacterInlineEdit();

        return;
      }


      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        cancelActiveCharacterInlineEdit();
      }
    }
  );
}


// =============================================
// Finish editor
// =============================================

function finishInlineEditor(
  row,
  field,
  value
) {
  activeEditor =
    null;


  row.classList.remove(
    "is-editing"
  );


  renderFieldDisplay(
    row,
    field,
    value
  );
}


// =============================================
// Display mode
// =============================================

function renderFieldDisplay(
  row,
  field,
  value
) {
  const container =
    row.querySelector(
      ".character-editable-value"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    "";


  const wrapper =
    document.createElement(
      "span"
    );


  wrapper.className =
    "character-inline-display";


  const display =
    document.createElement(
      "span"
    );


  display.className =
    "character-field-display";


  display.textContent =
    value ||
    "—";


  const editButton =
    document.createElement(
      "button"
    );


  editButton.type =
    "button";

  editButton.className =
    "btn btn-link btn-sm text-secondary text-decoration-none p-0 character-inline-edit-button";

  editButton.dataset
    .characterInlineAction =
      "edit";


  editButton.setAttribute(
    "aria-label",
    `Editar ${field}`
  );


  editButton.setAttribute(
    "title",
    "Editar"
  );


  editButton.textContent =
    "✎";


  wrapper.append(
    display,
    editButton
  );


  container.appendChild(
    wrapper
  );
}


// =============================================
// Error
// =============================================

function showInlineError(
  row,
  message
) {
  const error =
    row.querySelector(
      ".character-inline-error"
    );


  if (!error) {
    return;
  }


  error.textContent =
    message;


  error.classList.remove(
    "d-none"
  );
}


function hideInlineError(
  row
) {
  const error =
    row.querySelector(
      ".character-inline-error"
    );


  if (!error) {
    return;
  }


  error.textContent =
    "";


  error.classList.add(
    "d-none"
  );
}


// =============================================
// Character state
// =============================================

function getCharacter(
  characterId
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return null;
  }


  return (
    characters.find(
      (character) =>
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