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
      Array.isArray(data.characters)
        ? data.characters
        : [];

    window.ByNightMain.character.characters =
      characters;

    renderCharacters(
      characters
    );

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar personagens:",
      error
    );

    window.ByNightMain.character.characters =
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

  if (characters.length === 0) {
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

  const house =
    character.motherHouse
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
// Character events
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
  const button =
    event.target.closest(
      ".character-open-button"
    );

  if (!button) {
    return;
  }

  const container =
    event.currentTarget;

  if (
    !container.contains(
      button
    )
  ) {
    return;
  }

  const characterId =
    button.dataset.characterId;

  if (!characterId) {
    return;
  }

  toggleCharacterView(
    characterId
  );
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
    String(value ?? "");

  return element.innerHTML;
}


// =============================================
// Globals
// =============================================

window.loadCharacters =
  loadCharacters;

window.renderCharacters =
  renderCharacters;