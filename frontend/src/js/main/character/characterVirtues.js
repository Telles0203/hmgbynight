// =============================================
// Character Virtues
// =============================================

const VIRTUE_DRAFT_PREFIX =
  "bynight_character_virtues_draft_";

const VIRTUE_DRAFT_VERSION =
  1;


// =============================================
// Public click handler
// =============================================

export async function handleCharacterVirtueClick(
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


  if (!section) {
    return true;
  }


  const characterId =
    String(
      section.dataset
        .characterId ||
      ""
    );


  if (!characterId) {
    return true;
  }


  const character =
    getCharacterById(
      characterId
    );


  if (!character) {
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


// =============================================
// Restore drafts after render
// =============================================

export function restoreCharacterVirtueDrafts(
  container
) {
  const sections =
    container.querySelectorAll(
      ".character-virtues-section"
    );


  sections.forEach(
    (section) => {
      const characterId =
        String(
          section.dataset
            .characterId ||
          ""
        );


      if (!characterId) {
        return;
      }


      const editable =
        section.dataset
          .virtuesEditable ===
        "true";


      if (!editable) {
        return;
      }


      const character =
        getCharacterById(
          characterId
        );


      if (!character) {
        return;
      }


      const draft =
        loadVirtueDraft(
          characterId
        );


      if (!draft) {
        renderSavedState(
          section,
          character
        );

        return;
      }


      if (
        !isValidDraft(
          character,
          draft.values
        )
      ) {
        removeVirtueDraft(
          characterId
        );


        renderSavedState(
          section,
          character
        );

        return;
      }


      renderEditState(
        section,
        character,
        draft.values
      );
    }
  );
}


// =============================================
// Start editing
// =============================================

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
    !isValidDraft(
      character,
      draft.values
    )
  ) {
    const values =
      getSavedActiveVirtueValues(
        character
      );


    draft = {
      version:
        VIRTUE_DRAFT_VERSION,

      values,

      updatedAt:
        Date.now(),
    };


    saveVirtueDraftLocal(
      character.id,
      draft
    );
  }


  renderEditState(
    section,
    character,
    draft.values
  );
}


// =============================================
// Change draft
// =============================================

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


  if (!row) {
    return;
  }


  const virtueKey =
    String(
      row.dataset
        .virtueKey ||
      ""
    );


  if (!virtueKey) {
    return;
  }


  const draft =
    loadVirtueDraft(
      character.id
    );


  if (!draft) {
    return;
  }


  const virtue =
    getActiveVirtue(
      character,
      virtueKey
    );


  if (!virtue) {
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
    calculateDraftProgress(
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


  renderEditState(
    section,
    character,
    proposed
  );
}


// =============================================
// Save draft to server
// =============================================

async function saveVirtueDraft(
  section,
  character
) {
  const draft =
    loadVirtueDraft(
      character.id
    );


  if (!draft) {
    renderSavedState(
      section,
      character
    );

    return;
  }


  if (
    !hasDraftChanges(
      character,
      draft.values
    )
  ) {
    removeVirtueDraft(
      character.id
    );


    renderSavedState(
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
        .catch(() => ({}));


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


    updateCharacterLocalState(
      character,
      data.character
    );


    removeVirtueDraft(
      character.id
    );


    renderSavedState(
      section,
      character
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


    renderEditState(
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


// =============================================
// Cancel editing
// =============================================

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


  renderSavedState(
    section,
    character
  );
}


// =============================================
// Saved state
// =============================================

function renderSavedState(
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
    calculateDraftProgress(
      character,
      getSavedActiveVirtueValues(
        character
      )
    );


  updateCounter(
    section,
    progress,
    false
  );


  getActiveVirtues(
    character
  ).forEach(
    (virtue) => {
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


// =============================================
// Edit state
// =============================================

function renderEditState(
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
    calculateDraftProgress(
      character,
      values
    );


  const dirty =
    hasDraftChanges(
      character,
      values
    );


  updateCounter(
    section,
    progress,
    dirty
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
    (virtue) => {
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
            maximum ||
          progress.remaining <=
            0;
      }
    }
  );
}


// =============================================
// Counter
// =============================================

function updateCounter(
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


  counter.textContent =
    `${spent}/${total}`;


  counter.classList.toggle(
    "text-danger",
    dirty
  );


  counter.classList.toggle(
    "border-danger",
    dirty
  );


  counter.classList.toggle(
    "text-secondary",
    !dirty
  );


  counter.classList.toggle(
    "border-secondary",
    !dirty
  );
}


// =============================================
// Calculate draft progress
// =============================================

function calculateDraftProgress(
  character,
  values
) {
  const total =
    Number.isFinite(
      character
        ?.virtuePoints
        ?.total
    )
      ? character
          .virtuePoints
          .total
      : 7;


  let spent =
    0;


  getActiveVirtues(
    character
  ).forEach(
    (virtue) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const value =
        Number.isFinite(
          values[
            virtue.key
          ]
        )
          ? values[
              virtue.key
            ]
          : minimum;


      spent +=
        Math.max(
          0,
          value -
            minimum
        );
    }
  );


  return {
    total,

    spent,

    remaining:
      Math.max(
        0,
        total -
          spent
      ),

    complete:
      spent ===
      total,
  };
}


// =============================================
// Draft validation
// =============================================

function isValidDraft(
  character,
  values
) {
  if (
    !values ||
    typeof values !==
      "object"
  ) {
    return false;
  }


  const virtues =
    getActiveVirtues(
      character
    );


  for (
    const virtue
    of virtues
  ) {
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


    const value =
      values[
        virtue.key
      ];


    if (
      !Number.isInteger(
        value
      ) ||
      value <
        minimum ||
      value >
        maximum
    ) {
      return false;
    }
  }


  const progress =
    calculateDraftProgress(
      character,
      values
    );


  return (
    progress.spent <=
    progress.total
  );
}


// =============================================
// Detect changes
// =============================================

function hasDraftChanges(
  character,
  values
) {
  return getActiveVirtues(
    character
  ).some(
    (virtue) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const saved =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;


      const draft =
        Number.isFinite(
          values[
            virtue.key
          ]
        )
          ? values[
              virtue.key
            ]
          : saved;


      return (
        saved !==
        draft
      );
    }
  );
}


// =============================================
// Saved values
// =============================================

function getSavedActiveVirtueValues(
  character
) {
  const values = {};


  getActiveVirtues(
    character
  ).forEach(
    (virtue) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      values[
        virtue.key
      ] =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;
    }
  );


  return values;
}


// =============================================
// Character local state
// =============================================

function updateCharacterLocalState(
  character,
  updated
) {
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
}


// =============================================
// Get active Virtues
// =============================================

function getActiveVirtues(
  character
) {
  return Array.isArray(
    character
      ?.activeVirtues
  )
    ? character
        .activeVirtues
    : [];
}


function getActiveVirtue(
  character,
  virtueKey
) {
  return getActiveVirtues(
    character
  ).find(
    (virtue) =>
      String(
        virtue.key
      ) ===
      String(
        virtueKey
      )
  ) || null;
}


// =============================================
// Character lookup
// =============================================

function getCharacterById(
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


// =============================================
// Find row
// =============================================

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


// =============================================
// LocalStorage
// =============================================

function getVirtueDraftKey(
  characterId
) {
  return (
    VIRTUE_DRAFT_PREFIX +
    String(
      characterId
    )
  );
}


function loadVirtueDraft(
  characterId
) {
  try {
    const raw =
      localStorage.getItem(
        getVirtueDraftKey(
          characterId
        )
      );


    if (!raw) {
      return null;
    }


    const parsed =
      JSON.parse(
        raw
      );


    if (
      parsed?.version !==
        VIRTUE_DRAFT_VERSION ||
      !parsed?.values
    ) {
      return null;
    }


    return parsed;

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível restaurar o rascunho de Virtudes:",
      error
    );


    return null;
  }
}


function saveVirtueDraftLocal(
  characterId,
  draft
) {
  try {
    localStorage.setItem(
      getVirtueDraftKey(
        characterId
      ),

      JSON.stringify(
        draft
      )
    );

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível salvar o rascunho de Virtudes:",
      error
    );
  }
}


function removeVirtueDraft(
  characterId
) {
  try {
    localStorage.removeItem(
      getVirtueDraftKey(
        characterId
      )
    );

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível remover o rascunho de Virtudes:",
      error
    );
  }
}


// =============================================
// Busy
// =============================================

function setVirtueBusy(
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
      (button) => {
        button.disabled =
          busy;
      }
    );
}


// =============================================
// Error
// =============================================

function showVirtueError(
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


function clearVirtueError(
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