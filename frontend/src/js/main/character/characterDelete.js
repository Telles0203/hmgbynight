// =============================================
// Character delete state
// =============================================

let pendingDeleteCharacter =
  null;

let onCharacterDeleted =
  null;


// =============================================
// Delete controls HTML
// =============================================

export function createCharacterDeleteControls(
  characterId
) {
  return `
    <div
      class="character-delete-controls"
      data-character-id="${characterId}"
    >

      <button
        type="button"
        class="character-delete-icon-button character-delete-select-button"
        aria-label="Selecionar personagem para exclusão"
        aria-pressed="false"
        title="Selecionar para excluir"
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M3 6h18"
          ></path>

          <path
            d="M8 6V4h8v2"
          ></path>

          <path
            d="M19 6l-1 14H6L5 6"
          ></path>

          <path
            d="M10 11v5"
          ></path>

          <path
            d="M14 11v5"
          ></path>
        </svg>

      </button>

      <button
        type="button"
        class="btn btn-danger btn-sm character-delete-button"
        disabled
      >
        Excluir
      </button>

    </div>
  `;
}


// =============================================
// Setup modal
// =============================================

export function setupCharacterDeleteModal(
  onDeleted
) {
  if (
    typeof onDeleted ===
    "function"
  ) {
    onCharacterDeleted =
      onDeleted;
  }

  const form =
    document.getElementById(
      "deleteCharacterForm"
    );

  const modalElement =
    document.getElementById(
      "deleteCharacterModal"
    );

  if (
    !form ||
    !modalElement
  ) {
    return;
  }

  if (
    form.dataset.bound ===
    "true"
  ) {
    return;
  }

  form.dataset.bound =
    "true";

  form.addEventListener(
    "submit",
    handleCharacterDeleteSubmit
  );

  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      form.reset();

      hideCharacterDeleteAlert();

      pendingDeleteCharacter =
        null;
    }
  );
}


// =============================================
// Handle list click
// =============================================

export function handleCharacterDeleteClick(
  event,
  container
) {
  const target =
    event.target instanceof Element
      ? event.target
      : null;

  if (
    !target ||
    !container
  ) {
    return false;
  }


  // =============================================
  // Select trash icon
  // =============================================

  const selectButton =
    target.closest(
      ".character-delete-select-button"
    );

  if (
    selectButton &&
    container.contains(
      selectButton
    )
  ) {
    toggleCharacterDeleteSelection(
      container,
      selectButton
    );

    return true;
  }


  // =============================================
  // Delete button
  // =============================================

  const deleteButton =
    target.closest(
      ".character-delete-button"
    );

  if (
    deleteButton &&
    container.contains(
      deleteButton
    )
  ) {
    if (
      deleteButton.disabled
    ) {
      return true;
    }

    prepareCharacterDelete(
      deleteButton
    );

    return true;
  }


  return false;
}


// =============================================
// Delete selection
// =============================================

function toggleCharacterDeleteSelection(
  container,
  button
) {
  const controls =
    button.closest(
      ".character-delete-controls"
    );

  if (!controls) {
    return;
  }

  const alreadySelected =
    controls.classList.contains(
      "is-selected-for-delete"
    );

  resetCharacterDeleteSelections(
    container
  );

  if (alreadySelected) {
    return;
  }

  controls.classList.add(
    "is-selected-for-delete"
  );

  button.setAttribute(
    "aria-pressed",
    "true"
  );

  button.setAttribute(
    "aria-label",
    "Cancelar seleção para exclusão"
  );

  button.setAttribute(
    "title",
    "Cancelar seleção"
  );

  const deleteButton =
    controls.querySelector(
      ".character-delete-button"
    );

  if (deleteButton) {
    deleteButton.disabled =
      false;
  }

  controls
    .closest(
      ".character-card"
    )
    ?.classList.add(
      "is-delete-selected"
    );
}


// =============================================
// Reset selections
// =============================================

function resetCharacterDeleteSelections(
  container
) {
  container
    .querySelectorAll(
      ".character-delete-controls"
    )
    .forEach(
      (controls) => {
        controls.classList.remove(
          "is-selected-for-delete"
        );

        const selectButton =
          controls.querySelector(
            ".character-delete-select-button"
          );

        const deleteButton =
          controls.querySelector(
            ".character-delete-button"
          );

        if (selectButton) {
          selectButton.setAttribute(
            "aria-pressed",
            "false"
          );

          selectButton.setAttribute(
            "aria-label",
            "Selecionar personagem para exclusão"
          );

          selectButton.setAttribute(
            "title",
            "Selecionar para excluir"
          );
        }

        if (deleteButton) {
          deleteButton.disabled =
            true;
        }

        controls
          .closest(
            ".character-card"
          )
          ?.classList.remove(
            "is-delete-selected"
          );
      }
    );
}


// =============================================
// Prepare deletion
// =============================================

function prepareCharacterDelete(
  button
) {
  const card =
    button.closest(
      ".character-card"
    );

  if (!card) {
    return;
  }

  const characterId =
    card.dataset.characterId;

  const characterName =
    card
      .querySelector(
        ".character-card-name"
      )
      ?.textContent
      ?.trim() ||
    "este personagem";

  if (!characterId) {
    return;
  }

  pendingDeleteCharacter = {
    id:
      characterId,

    name:
      characterName,
  };

  openCharacterDeleteModal();
}


// =============================================
// Open modal
// =============================================

function openCharacterDeleteModal() {
  const modalElement =
    document.getElementById(
      "deleteCharacterModal"
    );

  const nameElement =
    document.getElementById(
      "deleteCharacterName"
    );

  const passwordInput =
    document.getElementById(
      "deleteCharacterPassword"
    );

  if (
    !modalElement ||
    !pendingDeleteCharacter ||
    !window.bootstrap
  ) {
    return;
  }

  if (nameElement) {
    nameElement.textContent =
      pendingDeleteCharacter.name;
  }

  if (passwordInput) {
    passwordInput.value =
      "";
  }

  hideCharacterDeleteAlert();

  const modal =
    window.bootstrap.Modal
      .getOrCreateInstance(
        modalElement
      );

  modalElement.addEventListener(
    "shown.bs.modal",
    () => {
      passwordInput?.focus();
    },
    {
      once: true,
    }
  );

  modal.show();
}


// =============================================
// Submit deletion
// =============================================

async function handleCharacterDeleteSubmit(
  event
) {
  event.preventDefault();

  if (
    !pendingDeleteCharacter?.id
  ) {
    return;
  }

  const characterId =
    pendingDeleteCharacter.id;

  const passwordInput =
    document.getElementById(
      "deleteCharacterPassword"
    );

  const confirmButton =
    document.getElementById(
      "confirmDeleteCharacterButton"
    );

  const currentPassword =
    passwordInput?.value || "";

  hideCharacterDeleteAlert();

  if (!currentPassword) {
    showCharacterDeleteAlert(
      "Informe sua senha atual."
    );

    passwordInput?.focus();

    return;
  }

  try {
    setDeleteLoading(
      confirmButton,
      true
    );

    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          characterId
        )}`,
        {
          method:
            "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              currentPassword,
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
      showCharacterDeleteAlert(
        data?.error ||
          "Não foi possível excluir o personagem."
      );

      return;
    }

    closeCharacterDeleteModal();

    pendingDeleteCharacter =
      null;

    if (
      typeof onCharacterDeleted ===
      "function"
    ) {
      await onCharacterDeleted();
    }

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao excluir personagem:",
      error
    );

    showCharacterDeleteAlert(
      "Erro de conexão com o servidor."
    );

  } finally {
    setDeleteLoading(
      confirmButton,
      false
    );
  }
}


// =============================================
// Modal close
// =============================================

function closeCharacterDeleteModal() {
  const modalElement =
    document.getElementById(
      "deleteCharacterModal"
    );

  if (
    !modalElement ||
    !window.bootstrap
  ) {
    return;
  }

  const modal =
    window.bootstrap.Modal
      .getOrCreateInstance(
        modalElement
      );

  modal.hide();
}


// =============================================
// Loading
// =============================================

function setDeleteLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }

  button.disabled =
    loading;

  button.textContent =
    loading
      ? "Excluindo..."
      : "Excluir personagem";
}


// =============================================
// Alerts
// =============================================

function showCharacterDeleteAlert(
  message
) {
  const alert =
    document.getElementById(
      "deleteCharacterAlert"
    );

  if (!alert) {
    return;
  }

  alert.textContent =
    message;

  alert.className =
    "alert alert-danger";
}


function hideCharacterDeleteAlert() {
  const alert =
    document.getElementById(
      "deleteCharacterAlert"
    );

  if (!alert) {
    return;
  }

  alert.textContent =
    "";

  alert.className =
    "alert d-none";
}