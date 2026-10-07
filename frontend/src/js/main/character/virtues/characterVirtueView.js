import {
  calculateVirtueProgress,
  getActiveVirtues,
  getSavedActiveVirtueValues,
  hasVirtueDraftChanges,
} from "./characterVirtueProgress.js";


export function renderSavedVirtueState(
  section,
  character
) {
  section.dataset.editing =
    "false";


  const editButton =
    section.querySelector(
      '[data-character-virtue-action="edit"]'
    );


  if (editButton) {
    editButton.classList.remove(
      "d-none"
    );
  }


  const footer =
    section.querySelector(
      ".character-virtue-edit-footer"
    );


  if (footer) {
    footer.classList.add(
      "d-none"
    );
  }


  const progress =
    character.virtuePoints ||
    calculateVirtueProgress(
      character,
      getSavedActiveVirtueValues(
        character
      )
    );


  updateVirtueCounter(
    section,
    progress,
    false
  );


  updateVirtueFreeTraitCost(
    section,
    progress
  );


  updateUnusedVirtueWarning(
    section,
    progress
  );


  getActiveVirtues(
    character
  ).forEach(
    (
      virtue
    ) => {
      const row =
        findVirtueRow(
          section,
          virtue.key
        );


      if (!row) {
        return;
      }


      const value =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : (
              Number.isFinite(
                virtue.minimum
              )
                ? virtue.minimum
                : 0
            );


      const view =
        row.querySelector(
          ".character-virtue-view"
        );


      const controls =
        row.querySelector(
          ".character-virtue-edit-controls"
        );


      const viewValue =
        row.querySelector(
          ".character-virtue-view-value"
        );


      const editValue =
        row.querySelector(
          ".character-virtue-edit-value"
        );


      if (view) {
        view.classList.remove(
          "d-none"
        );
      }


      if (controls) {
        controls.classList.add(
          "d-none"
        );
      }


      if (viewValue) {
        viewValue.textContent =
          String(
            value
          );
      }


      if (editValue) {
        editValue.textContent =
          String(
            value
          );


        editValue.classList.remove(
          "text-danger"
        );
      }


      row.dataset
        .savedValue =
          String(
            value
          );
    }
  );
}


export function renderVirtueEditState(
  section,
  character,
  values
) {
  section.dataset.editing =
    "true";


  const editButton =
    section.querySelector(
      '[data-character-virtue-action="edit"]'
    );


  if (editButton) {
    editButton.classList.add(
      "d-none"
    );
  }


  const footer =
    section.querySelector(
      ".character-virtue-edit-footer"
    );


  if (footer) {
    footer.classList.remove(
      "d-none"
    );
  }


  const progress =
    calculateVirtueProgress(
      character,
      values
    );


  const dirty =
    hasVirtueDraftChanges(
      character,
      values
    );


  updateVirtueCounter(
    section,
    progress,
    dirty
  );


  updateVirtueFreeTraitCost(
    section,
    progress
  );


  updateUnusedVirtueWarning(
    section,
    progress
  );


  const message =
    section.querySelector(
      ".character-virtue-draft-message"
    );


  if (message) {
    message.textContent =
      dirty
        ? "Alterações ainda não salvas."
        : "Modo de edição.";


    message.classList.toggle(
      "text-danger",
      dirty
    );


    message.classList.toggle(
      "text-secondary",
      !dirty
    );
  }


  const saveButton =
    section.querySelector(
      '[data-character-virtue-action="save"]'
    );


  if (saveButton) {
    saveButton.disabled =
      !dirty;
  }


  getActiveVirtues(
    character
  ).forEach(
    (
      virtue
    ) => {
      const row =
        findVirtueRow(
          section,
          virtue.key
        );


      if (!row) {
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


      const savedValue =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;


      const currentValue =
        Number.isFinite(
          values[
            virtue.key
          ]
        )
          ? values[
              virtue.key
            ]
          : savedValue;


      const changed =
        currentValue !==
        savedValue;


      const view =
        row.querySelector(
          ".character-virtue-view"
        );


      const controls =
        row.querySelector(
          ".character-virtue-edit-controls"
        );


      const editValue =
        row.querySelector(
          ".character-virtue-edit-value"
        );


      const decrease =
        row.querySelector(
          '[data-character-virtue-action="decrease"]'
        );


      const increase =
        row.querySelector(
          '[data-character-virtue-action="increase"]'
        );


      if (view) {
        view.classList.add(
          "d-none"
        );
      }


      if (controls) {
        controls.classList.remove(
          "d-none"
        );
      }


      if (editValue) {
        editValue.textContent =
          String(
            currentValue
          );


        editValue.classList.toggle(
          "text-danger",
          changed
        );
      }


      if (decrease) {
        decrease.disabled =
          currentValue <=
          minimum;
      }


      if (increase) {
        increase.disabled =
          currentValue >=
          maximum;
      }
    }
  );
}


function updateVirtueFreeTraitCost(
  section,
  progress
) {
  const element =
    section.querySelector(
      "[data-virtue-free-trait-cost]"
    );


  if (!element) {
    return;
  }


  const cost =
    Number(
      progress
        ?.freeTraitCost
    );


  const normalizedCost =
    Number.isFinite(
      cost
    )
      ? Math.max(
          0,
          cost
        )
      : 0;


  if (
    normalizedCost ===
    0
  ) {
    element.textContent =
      "";

    element.classList.add(
      "d-none"
    );


    return;
  }


  element.textContent =
    `Extra da criação: -${normalizedCost} Free Traits`;


  element.classList.remove(
    "d-none"
  );
}


function updateVirtueCounter(
  section,
  progress,
  dirty
) {
  const counter =
    section.querySelector(
      "[data-virtue-points]"
    );


  if (!counter) {
    return;
  }


  const spent =
    Number.isFinite(
      progress?.spent
    )
      ? progress.spent
      : 0;


  const total =
    Number.isFinite(
      progress?.total
    )
      ? progress.total
      : 7;


  const remaining =
    Number.isFinite(
      progress?.remaining
    )
      ? progress.remaining
      : Math.max(
          0,
          total -
            spent
        );


  const highlight =
    dirty ||
    remaining >
      0 ||
    spent >
      total;


  counter.textContent =
    `${spent}/${total}`;


  counter.title =
    remaining > 0
      ? `${remaining} pontos ainda não utilizados`
      : "Todos os pontos de Virtudes foram distribuídos";


  counter.classList.toggle(
    "text-danger",
    highlight
  );


  counter.classList.toggle(
    "border-danger",
    highlight
  );


  counter.classList.toggle(
    "text-secondary",
    !highlight
  );


  counter.classList.toggle(
    "border-secondary",
    !highlight
  );
}


function updateUnusedVirtueWarning(
  section,
  progress
) {
  const remaining =
    Number.isFinite(
      progress?.remaining
    )
      ? progress.remaining
      : 0;


  const counter =
    section.querySelector(
      "[data-virtue-points]"
    );


  if (!counter) {
    return;
  }


  const container =
    counter.parentElement;


  if (!container) {
    return;
  }


  let warning =
    container.querySelector(
      ".character-virtue-points-warning"
    );


  if (
    remaining <=
    0
  ) {
    if (warning) {
      disposeWarningPopover(
        warning
      );


      warning.remove();
    }


    section.classList.remove(
      "character-virtues-incomplete"
    );


    return;
  }


  section.classList.add(
    "character-virtues-incomplete"
  );


  const message =
    getUnusedVirtueMessage(
      remaining
    );


  if (!warning) {
    warning =
      document.createElement(
        "button"
      );


    warning.type =
      "button";


    warning.className =
      "character-virtue-points-warning";


    warning.textContent =
      "!";


    warning.setAttribute(
      "data-bs-toggle",
      "popover"
    );


    warning.setAttribute(
      "data-bs-trigger",
      "focus"
    );


    warning.setAttribute(
      "data-bs-placement",
      "top"
    );


    warning.setAttribute(
      "data-bs-container",
      "body"
    );


    warning.setAttribute(
      "data-bs-custom-class",
      "character-virtue-warning-popover"
    );


    warning.setAttribute(
      "data-bs-title",
      "Pontos de Virtudes"
    );


    counter.insertAdjacentElement(
      "afterend",
      warning
    );
  }


  warning.setAttribute(
    "aria-label",
    message
  );


  warning.setAttribute(
    "title",
    message
  );


  warning.setAttribute(
    "data-bs-content",
    message
  );


  refreshWarningPopover(
    warning
  );
}


function getUnusedVirtueMessage(
  remaining
) {
  if (
    remaining ===
    1
  ) {
    return "Você ainda possui 1 ponto de Virtude para distribuir.";
  }


  return `Você ainda possui ${remaining} pontos de Virtudes para distribuir.`;
}


function refreshWarningPopover(
  warning
) {
  if (
    !window.bootstrap
      ?.Popover
  ) {
    return;
  }


  disposeWarningPopover(
    warning
  );


  window.bootstrap
    .Popover
    .getOrCreateInstance(
      warning
    );
}


function disposeWarningPopover(
  warning
) {
  if (
    !window.bootstrap
      ?.Popover
  ) {
    return;
  }


  window.bootstrap
    .Popover
    .getInstance(
      warning
    )
    ?.dispose();
}


function findVirtueRow(
  section,
  virtueKey
) {
  return section.querySelector(
    `.character-virtue-row[data-virtue-key="${CSS.escape(
      String(
        virtueKey
      )
    )}"]`
  );
}


export function setVirtueBusy(
  section,
  busy
) {
  section.dataset.busy =
    busy
      ? "true"
      : "false";


  section
    .querySelectorAll(
      "[data-character-virtue-action]"
    )
    .forEach(
      (
        button
      ) => {
        button.disabled =
          busy;
      }
    );
}


export function showVirtueError(
  element,
  message
) {
  if (!element) {
    return;
  }


  element.textContent =
    String(
      message ||
      ""
    );


  element.classList.remove(
    "d-none"
  );
}


export function clearVirtueError(
  element
) {
  if (!element) {
    return;
  }


  element.textContent =
    "";


  element.classList.add(
    "d-none"
  );
}
