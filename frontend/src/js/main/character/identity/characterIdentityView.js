import {
  getTitleMaxLength,
} from "./characterIdentityConfig.js";


export function createIdentityInput(
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


export function mountIdentityEditor({
  row,
  config,
  value,
  displayValue,
  saveLabel,
  onSave,
  onCancel,
}) {
  const container =
    row.querySelector(
      ".character-identity-value"
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
    createIdentityInput(
      config,
      value,
      displayValue
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


export function renderIdentityDisplay(
  row,
  config,
  value,
  displayValue
) {
  row.classList.remove(
    "is-editing"
  );


  const container =
    row.querySelector(
      ".character-identity-value"
    );


  if (
    !container
  ) {
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
    `Editar ${config.label}`
  );

  button.setAttribute(
    "title",
    `Editar ${config.label}`
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


export function updateIdentityCardSummary(
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


  if (
    !card
  ) {
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


    if (
      title
    ) {
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


    if (
      clan
    ) {
      clan.textContent =
        displayValue;
    }
  }
}


export function showIdentityError(
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


export function hideIdentityError(
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