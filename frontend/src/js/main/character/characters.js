import {
  createCharacterSheet,
} from "./view/characterSheet.js";

import {
  toggleCharacterView,
} from "./view/characterView.js";


// =============================================
// ByNight Main
// =============================================

window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };


// =============================================
// Delete state
// =============================================

let pendingDeleteCharacter =
  null;


// =============================================
// Load characters
// =============================================

async function loadCharacters() {
  try {
    const response =
      await fetch(
        "/api/characters",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
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
          "Não foi possível carregar os personagens."
      );
    }

    const characters =
      Array.isArray(
        data.characters
      )
        ? data.characters
        : [];

    window.ByNightMain
      .character
      .characters =
        characters;

    renderCharacters(
      characters
    );

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar personagens:",
      error
    );

    window.ByNightMain
      .character
      .characters =
        [];

    renderCharacterError();
  }
}


// =============================================
// Render
// =============================================

function renderCharacters(
  characters
) {
  const container =
    document.getElementById(
      "characterListContainer"
    );

  if (!container) {
    return;
  }

  setupCharacterListEvents(
    container
  );

  setupCharacterDeleteModal();

  if (
    characters.length ===
    0
  ) {
    container.innerHTML = `
      <p class="text-secondary small">
        Você ainda não possui personagens cadastrados.
      </p>

      <button
        id="createCharacterButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createCharacterModal"
      >
        Criar meu primeiro personagem
      </button>
    `;

    return;
  }

  const cards =
    characters
      .map(
        (character) =>
          createCharacterCard(
            character
          )
      )
      .join("");

  container.innerHTML = `
    <div id="characterList">
      ${cards}
    </div>

    <div
      id="characterCreateArea"
      class="mt-3"
    >
      <button
        id="createCharacterButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createCharacterModal"
      >
        + Criar personagem
      </button>

      <p class="character-delete-note">
        Personagens vinculados a uma House
        não podem ser excluídos por esta tela.
        A exclusão deve ser realizada pela própria House.
      </p>
    </div>
  `;
}


// =============================================
// Character card
// =============================================

function createCharacterCard(
  character
) {
  const id =
    escapeCharacterHtml(
      character.id
    );

  const name =
    escapeCharacterHtml(
      character.name
    );

  const clan =
    escapeCharacterHtml(
      character.clanDisplayName ||
      character.clan ||
      ""
    );

  const sect =
    escapeCharacterHtml(
      window.getSectLabel?.(
        character.sect
      ) ||
      character.sect ||
      ""
    );

  const hasHouse =
    Boolean(
      character.motherHouse
    );

  const house =
    hasHouse
      ? "Vinculado"
      : "Sem House";

  return `
    <article
      class="character-card"
      data-character-id="${id}"
    >

      <div class="character-card-header">

        <div class="character-card-identity">

          <h3
            class="character-card-name h6 text-light mb-1"
          >
            ${name}
          </h3>

          ${
            clan
              ? `
                <div class="text-secondary small">
                  ${clan}
                </div>
              `
              : ""
          }

          <div class="text-secondary small">
            ${
              sect
                ? `${sect} · `
                : ""
            }${house}
          </div>

        </div>

        ${
          !hasHouse
            ? createCharacterDeleteControls(
                id
              )
            : ""
        }

        <button
          type="button"
          class="btn btn-outline-light btn-sm character-open-button"
          data-character-id="${id}"
        >
          Abrir →
        </button>

      </div>

      ${createCharacterSheet({
        clan,
        sect,
        house,
      })}

    </article>
  `;
}


// =============================================
// Delete controls
// =============================================

function createCharacterDeleteControls(
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
// Character list events
// =============================================

function setupCharacterListEvents(
  container
) {
  container.removeEventListener(
    "click",
    handleCharacterListClick
  );

  container.addEventListener(
    "click",
    handleCharacterListClick
  );
}


function handleCharacterListClick(
  event
) {
  const target =
    event.target instanceof Element
      ? event.target
      : null;

  if (!target) {
    return;
  }

  const container =
    event.currentTarget;


  // =============================================
  // Open character
  // =============================================

  const openButton =
    target.closest(
      ".character-open-button"
    );

  if (
    openButton &&
    container.contains(
      openButton
    )
  ) {
    const characterId =
      openButton
        .dataset
        .characterId;

    if (!characterId) {
      return;
    }

    toggleCharacterView(
      characterId
    );

    return;
  }


  // =============================================
  // Select for deletion
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

    return;
  }


  // =============================================
  // Open delete confirmation
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
      return;
    }

    prepareCharacterDelete(
      deleteButton
    );
  }
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

  const card =
    controls.closest(
      ".character-card"
    );

  card?.classList.add(
    "is-delete-selected"
  );
}


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
// Prepare delete
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
// Delete modal
// =============================================

function setupCharacterDeleteModal() {
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
    bootstrap.Modal
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
// Delete submit
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
    if (confirmButton) {
      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "Excluindo...";
    }

    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          pendingDeleteCharacter.id
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

    const modalElement =
      document.getElementById(
        "deleteCharacterModal"
      );

    if (
      modalElement &&
      window.bootstrap
    ) {
      const modal =
        bootstrap.Modal
          .getOrCreateInstance(
            modalElement
          );

      modal.hide();
    }

    pendingDeleteCharacter =
      null;

    await loadCharacters();

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao excluir personagem:",
      error
    );

    showCharacterDeleteAlert(
      "Erro de conexão com o servidor."
    );

  } finally {
    if (confirmButton) {
      confirmButton.disabled =
        false;

      confirmButton.textContent =
        "Excluir personagem";
    }
  }
}


// =============================================
// Delete alert
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


// =============================================
// Error
// =============================================

function renderCharacterError() {
  const container =
    document.getElementById(
      "characterListContainer"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="alert alert-danger"
      role="alert"
    >
      Não foi possível carregar seus personagens.
    </div>

    <button
      id="createCharacterButton"
      type="button"
      class="btn btn-blood w-100"
      data-bs-toggle="modal"
      data-bs-target="#createCharacterModal"
    >
      + Criar personagem
    </button>
  `;
}


// =============================================
// Escape
// =============================================

function escapeCharacterHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );

  element.textContent =
    String(
      value ?? ""
    );

  return element.innerHTML;
}


// =============================================
// Globals
// =============================================

window.loadCharacters =
  loadCharacters;

window.renderCharacters =
  renderCharacters;