export function createEditorInput({
  config,
  value,
  displayValue,
  archetypes,
}) {
  if (
    config.editorType ===
    "archetype"
  ) {
    const select =
      document.createElement(
        "select"
      );


    select.className =
      "form-select form-select-sm bg-black text-light border-secondary character-inline-input";


    const emptyOption =
      document.createElement(
        "option"
      );


    emptyOption.value =
      "";

    emptyOption.textContent =
      config.placeholder ||
      "Selecione uma opção";


    select.appendChild(
      emptyOption
    );


    archetypes.forEach(
      (
        archetype
      ) => {
        const option =
          document.createElement(
            "option"
          );


        option.value =
          archetype.ref;

        option.textContent =
          archetype.label;


        select.appendChild(
          option
        );
      }
    );


    if (
      value &&
      !archetypes.some(
        (
          archetype
        ) =>
          archetype.ref ===
          value
      )
    ) {
      const currentOption =
        document.createElement(
          "option"
        );


      currentOption.value =
        value;

      currentOption.textContent =
        displayValue ||
        value;


      select.appendChild(
        currentOption
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


  if (
    typeof config.maxLength ===
    "number"
  ) {
    input.maxLength =
      config.maxLength;
  }


  return input;
}


export function mountInlineEditor({
  row,
  config,
  value,
  displayValue,
  archetypes,
  saveLabel,
  onSave,
  onCancel,
}) {
  const container =
    row.querySelector(
      ".character-editable-value"
    );


  if (
    !container
  ) {
    return null;
  }


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
    createEditorInput({
      config,
      value,
      displayValue,
      archetypes,
    });


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
    saveLabel;


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


        await onSave();


        return;
      }


      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();


        onCancel();
      }
    }
  );


  return input;
}


export function getInputDisplayValue(
  input,
  config,
  value
) {
  if (
    config.editorType ===
      "archetype" &&
    input instanceof
      HTMLSelectElement
  ) {
    if (
      !value
    ) {
      return "";
    }


    return (
      input.options[
        input.selectedIndex
      ]?.textContent ||
      ""
    );
  }


  return value;
}


export function getCharacterDisplayValue(
  character,
  config
) {
  if (
    config.labelProperty
  ) {
    return String(
      character[
        config.labelProperty
      ] ||
      ""
    );
  }


  return String(
    character[
      config.property
    ] ||
    ""
  );
}


export function renderFieldDisplay(
  row,
  config,
  value,
  displayValue
) {
  const container =
    row.querySelector(
      ".character-editable-value"
    );


  if (
    !container
  ) {
    return;
  }


  row.classList.remove(
    "is-editing"
  );


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
    `Editar ${config.label}`
  );

  editButton.setAttribute(
    "title",
    `Editar ${config.label}`
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


export function showInlineError(
  row,
  message
) {
  const error =
    row.querySelector(
      ".character-inline-error"
    );


  if (
    !error
  ) {
    return;
  }


  error.textContent =
    message;


  error.classList.remove(
    "d-none"
  );
}


export function hideInlineError(
  row
) {
  const error =
    row.querySelector(
      ".character-inline-error"
    );


  if (
    !error
  ) {
    return;
  }


  error.textContent =
    "";


  error.classList.add(
    "d-none"
  );
}