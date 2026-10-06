let activeEditor =
  null;


const FIELD_CONFIG = {
  title: {
    label:
      "Título",

    property:
      "title",

    endpoint:
      "title",

    type:
      "text",

    placeholder:
      "Digite o título...",
  },

  clan: {
    label:
      "Clã",

    property:
      "clan",

    labelProperty:
      "clanDisplayName",

    endpoint:
      "clan",

    type:
      "clan",
  },
};


export async function handleCharacterIdentityEditClick(
  event,
  container
) {
  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (!target) {
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


    if (!row) {
      return true;
    }


    if (
      activeEditor &&
      activeEditor.row !==
      row
    ) {
      const saved =
        await saveActiveCharacterIdentityEdit();


      if (!saved) {
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
  if (!activeEditor) {
    return true;
  }


  const {
    character,
    characterId,
    field,
    config,
    row,
    originalValue,
    originalDisplayValue,
  } =
    activeEditor;


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


  hideError(
    row
  );


  if (
    field ===
      "title" &&
    value.length >
      getTitleMaxLength()
  ) {
    showError(
      row,
      `Máximo de ${getTitleMaxLength()} caracteres.`
    );


    input.focus();


    return false;
  }


  if (
    field ===
      "clan" &&
    !value
  ) {
    showError(
      row,
      "Selecione o Clã."
    );


    input.focus();


    return false;
  }


  if (
    value ===
    originalValue
  ) {
    finishEditor(
      row,
      field,
      originalValue,
      originalDisplayValue
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
      showError(
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
            getInputDisplayValue(
              input
            ) ||
            savedValue
          )
        : savedValue;


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


    updateCardSummary(
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


    return true;

  } catch (error) {
    console.error(
      "[CHARACTER IDENTITY] Erro ao salvar:",
      error
    );


    showError(
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


export function cancelActiveCharacterIdentityEdit() {
  if (!activeEditor) {
    return;
  }


  const {
    row,
    field,
    originalValue,
    originalDisplayValue,
  } =
    activeEditor;


  finishEditor(
    row,
    field,
    originalValue,
    originalDisplayValue
  );
}


function openEditor(
  row
) {
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


  const config =
    FIELD_CONFIG[
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


  const directEdit =
    character.editState
      ?.directEdit ??
    !character.motherHouse;


  if (!directEdit) {
    window.alert(
      "Este personagem já foi aprovado por uma Crônica. Esta alteração não pode ser realizada diretamente."
    );


    return;
  }


  const originalValue =
    String(
      character[
        config.property
      ] ||
      ""
    );


  const originalDisplayValue =
    config.labelProperty
      ? String(
          character[
            config.labelProperty
          ] ||
          ""
        )
      : originalValue;


  const container =
    row.querySelector(
      ".character-identity-value"
    );


  if (!container) {
    return;
  }


  activeEditor = {
    character,
    characterId,
    field,
    config,
    row,
    originalValue,
    originalDisplayValue,
  };


  row.classList.add(
    "is-editing"
  );


  container.replaceChildren();


  const editor =
    document.createElement(
      "div"
    );


  editor.className =
    "character-inline-editor";


  const input =
    createInput(
      config,
      originalValue,
      originalDisplayValue
    );


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
    .characterIdentityAction =
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
    .characterIdentityAction =
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


  if (
    input instanceof
      HTMLInputElement
  ) {
    input.setSelectionRange(
      input.value.length,
      input.value.length
    );
  }


  input.addEventListener(
    "keydown",
    async (
      event
    ) => {
      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();


        await saveActiveCharacterIdentityEdit();


        return;
      }


      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();


        cancelActiveCharacterIdentityEdit();
      }
    }
  );
}


function createInput(
  config,
  value,
  displayValue
) {
  if (
    config.type ===
    "clan"
  ) {
    const select =
      document.createElement(
        "select"
      );


    select.className =
      "form-select form-select-sm bg-black text-light border-secondary character-inline-input";


    const clans =
      window.ByNightMain
        ?.character
        ?.options
        ?.clans ||
      [];


    clans.forEach(
      (
        clan
      ) => {
        const option =
          document.createElement(
            "option"
          );


        option.value =
          clan.value;

        option.textContent =
          clan.label;


        select.appendChild(
          option
        );
      }
    );


    if (
      value &&
      !clans.some(
        (
          clan
        ) =>
          clan.value ===
          value
      )
    ) {
      const option =
        document.createElement(
          "option"
        );


      option.value =
        value;

      option.textContent =
        displayValue ||
        value;


      select.appendChild(
        option
      );
    }


    select.value =
      value;


    return select;
  }


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

  input.placeholder =
    config.placeholder ||
    "";

  input.autocomplete =
    "off";

  input.maxLength =
    getTitleMaxLength();


  return input;
}


function finishEditor(
  row,
  field,
  value,
  displayValue
) {
  activeEditor =
    null;


  row.classList.remove(
    "is-editing"
  );


  const container =
    row.querySelector(
      ".character-identity-value"
    );


  if (!container) {
    return;
  }


  container.replaceChildren();


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
    displayValue ||
    value ||
    "—";


  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";

  button.className =
    "btn btn-link btn-sm text-secondary text-decoration-none p-0 character-inline-edit-button";

  button.dataset
    .characterIdentityAction =
      "edit";


  button.setAttribute(
    "aria-label",
    `Editar ${FIELD_CONFIG[field].label}`
  );


  button.setAttribute(
    "title",
    `Editar ${FIELD_CONFIG[field].label}`
  );


  button.textContent =
    "✎";


  wrapper.append(
    display,
    button
  );


  container.appendChild(
    wrapper
  );
}


function updateCardSummary(
  characterId,
  field,
  displayValue
) {
  const card =
    document.querySelector(
      `.character-card[data-character-id="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    );


  if (!card) {
    return;
  }


  if (
    field ===
    "title"
  ) {
    const title =
      card.querySelector(
        ".character-title-summary"
      );


    if (title) {
      title.textContent =
        displayValue;


      title.classList.toggle(
        "d-none",
        !displayValue
      );
    }
  }


  if (
    field ===
    "clan"
  ) {
    const clan =
      card.querySelector(
        ".character-clan-summary"
      );


    if (clan) {
      clan.textContent =
        displayValue;
    }
  }
}


function getInputDisplayValue(
  input
) {
  if (
    input instanceof
      HTMLSelectElement
  ) {
    return (
      input.options[
        input.selectedIndex
      ]?.textContent ||
      ""
    );
  }


  return String(
    input.value ||
    ""
  );
}


function getTitleMaxLength() {
  const configured =
    Number(
      window.ByNightMain
        ?.character
        ?.options
        ?.limits
        ?.titleMaxLength
    );


  return Number.isInteger(
    configured
  )
    ? configured
    : 80;
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


function showError(
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


function hideError(
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