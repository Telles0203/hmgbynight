import {
  getTitleMaxLength,
} from "./characterIdentityConfig.js";


const MORALITY_APPROVAL_MESSAGE =
  "Esta Trilha requer aprovação da Narração.";


function getMoralityPathOptions() {
  return (
    window.ByNightMain
      ?.character
      ?.options
      ?.moralityPaths ||
    []
  );
}


function getMoralityPathOption(
  value
) {
  return (
    getMoralityPathOptions()
      .find(
        (
          option
        ) =>
          String(
            option.value
          ) ===
          String(
            value
          )
      ) ||
    null
  );
}


function requiresMoralityPathApproval(
  value
) {
  return (
    getMoralityPathOption(
      value
    )
      ?.requiresNarratorApproval ===
    true
  );
}


function createSelectInput({
  options,
  value,
  displayValue,
}) {
  const select =
    document.createElement(
      "select"
    );


  select.className =
    "form-select form-select-sm bg-black text-light border-secondary character-inline-input";


  options.forEach(
    (
      item
    ) => {
      const option =
        document.createElement(
          "option"
        );


      option.value =
        item.value;

      option.textContent =
        item.label;


      select.appendChild(
        option
      );
    }
  );


  if (
    value &&
    !options.some(
      (
        item
      ) =>
        String(
          item.value
        ) ===
        String(
          value
        )
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


export function createIdentityInput(
  config,
  value,
  displayValue
) {
  if (
    config.type ===
    "clan"
  ) {
    return createSelectInput({
      options:
        window.ByNightMain
          ?.character
          ?.options
          ?.clans ||
        [],

      value,

      displayValue,
    });
  }


  if (
    config.type ===
    "moralityPath"
  ) {
    return createSelectInput({
      options:
        getMoralityPathOptions(),

      value,

      displayValue,
    });
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


function createMoralityApprovalNote() {
  const note =
    document.createElement(
      "div"
    );


  note.className =
    "small text-warning d-none character-morality-path-approval-note";

  note.textContent =
    MORALITY_APPROVAL_MESSAGE;


  return note;
}


function refreshMoralityApprovalNote(
  input,
  note
) {
  if (
    !note
  ) {
    return;
  }


  const show =
    requiresMoralityPathApproval(
      input?.value
    );


  note.classList.toggle(
    "d-none",
    !show
  );
}


function createMoralityApprovalIndicator(
  value
) {
  if (
    !requiresMoralityPathApproval(
      value
    )
  ) {
    return null;
  }


  const indicator =
    document.createElement(
      "span"
    );


  indicator.className =
    "character-sheet-warning-inline";

  indicator.textContent =
    "!";

  indicator.title =
    MORALITY_APPROVAL_MESSAGE;

  indicator.setAttribute(
    "aria-label",
    MORALITY_APPROVAL_MESSAGE
  );


  return indicator;
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


  editor.appendChild(
    input
  );


  let approvalNote =
    null;


  if (
    config.type ===
    "moralityPath"
  ) {
    approvalNote =
      createMoralityApprovalNote();


    editor.appendChild(
      approvalNote
    );


    refreshMoralityApprovalNote(
      input,
      approvalNote
    );


    input.addEventListener(
      "change",
      () => {
        refreshMoralityApprovalNote(
          input,
          approvalNote
        );
      }
    );
  }


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


  wrapper.appendChild(
    display
  );


  if (
    config.type ===
    "moralityPath"
  ) {
    const indicator =
      createMoralityApprovalIndicator(
        value
      );


    if (
      indicator
    ) {
      wrapper.appendChild(
        indicator
      );
    }
  }


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


  wrapper.appendChild(
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