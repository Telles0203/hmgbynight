import {
  createCharacterSheet,
} from "./view/characterSheet.js";

import {
  toggleCharacterView,
} from "./view/characterView.js";

import {
  createCharacterDeleteControls,
  handleCharacterDeleteClick,
  setupCharacterDeleteModal,
} from "./characterDelete.js";

import {
  createCharacterHouseField,
  handleCharacterHouseClick,
  setupCharacterHouseModal,
} from "./characterHouse.js";

import {
  handleCharacterInlineEditClick,
  saveActiveCharacterInlineEdit,
} from "./characterInlineEdit.js";


// =============================================
// ByNight Main
// =============================================

window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options:
      null,

    characters:
      [],
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
          method:
            "GET",

          credentials:
            "include",

          cache:
            "no-store",
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


  setupCharacterDeleteModal(
    loadCharacters
  );


  setupCharacterHouseModal(
    handleCharacterHouseRequestCompleted
  );


  // =============================================
  // Empty
  // =============================================

  if (
    characters.length ===
    0
  ) {
    container.innerHTML = `
      ${createCharacterCreationNotice()}

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


    setupCharacterPopovers(
      container
    );


    return;
  }


  // =============================================
  // Cards
  // =============================================

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
    ${createCharacterCreationNotice()}

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
        Personagens vinculados a uma Crônica
        não podem ser excluídos por esta tela.
        A exclusão deve ser realizada pela própria Crônica.
      </p>

    </div>
  `;


  setupCharacterPopovers(
    container
  );
}


// =============================================
// Creation notice
// =============================================

function createCharacterCreationNotice() {
  return `
    <div
      class="
        alert
        alert-dark
        border
        border-secondary
        small
        mb-3
      "
      role="note"
    >
      <div
        class="fw-semibold text-light mb-1"
      >
        Criação de personagem
      </div>

      <div
        class="text-secondary"
      >
        Enquanto um personagem não for aprovado
        por uma Crônica, ele permanece em criação inicial.
        Monte a ficha utilizando apenas os pontos previstos
        para a criação do personagem.
        Pontos de Experiência e evoluções ficam indisponíveis
        até a aprovação.
      </div>
    </div>
  `;
}


// =============================================
// Bootstrap popovers
// =============================================

function setupCharacterPopovers(
  container
) {
  if (
    !window.bootstrap?.Popover
  ) {
    console.warn(
      "[CHARACTER] Bootstrap Popover não disponível."
    );

    return;
  }


  const elements =
    container.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );


  elements.forEach(
    (element) => {
      window.bootstrap.Popover
        .getOrCreateInstance(
          element
        );
    }
  );
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


  const houseSummary =
    getCharacterHouseSummary(
      character
    );


  const houseField =
    createCharacterHouseField(
      character
    );


  return `
    <article
      class="character-card"
      data-character-id="${id}"
    >

      <div
        class="character-card-header"
      >

        <div
          class="character-card-identity"
        >

          <h3
            class="character-card-name h6 text-light mb-1"
          >
            ${name}
          </h3>


          <div
            class="character-status-slot mb-2"
          >
            ${createCharacterStatus(
              character
            )}
          </div>


          ${
            clan
              ? `
                <div
                  class="text-secondary small"
                >
                  ${clan}
                </div>
              `
              : ""
          }


          <div
            class="text-secondary small character-house-summary"
          >
            ${
              sect
                ? `${sect} · `
                : ""
            }${escapeCharacterHtml(
              houseSummary
            )}
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
        characterId:
          character.id,

        concept:
          character.concept ||
          "",

        natureLabel:
          character.natureLabel ||
          "",

        demeanorLabel:
          character.demeanorLabel ||
          "",

        moralityPathLabel:
          character.moralityPathLabel ||
          "Humanidade",

        moralityRating:
          Number.isFinite(
            character.moralityRating
          )
            ? character.moralityRating
            : null,

        activeVirtues:
          Array.isArray(
            character.activeVirtues
          )
            ? character.activeVirtues
            : [],

        clan,

        sect,

        house:
          houseField,
      })}

    </article>
  `;
}


// =============================================
// Character status
// =============================================

function getCharacterStatus(
  character
) {
  // =============================================
  // Approved
  // =============================================

  if (
    character.motherHouse
  ) {
    return {
      key:
        "approved",

      label:
        "APROVADO",

      badgeClass:
        "border border-success text-success bg-transparent",

      description:
        "Este personagem foi aprovado pela Crônica. A partir deste estado, XP, evoluções e alterações passam a seguir as regras e aprovações da Narração.",
    };
  }


  // =============================================
  // Pending Chronicle approval
  // =============================================

  if (
    character.pendingMotherHouse
  ) {
    return {
      key:
        "pending",

      label:
        "AGUARDANDO APROVAÇÃO",

      badgeClass:
        "border border-info text-info bg-transparent",

      description:
        "Este personagem foi enviado para análise da Crônica. Enquanto aguarda aprovação, ele continua sujeito às regras de criação inicial e não pode receber XP.",
    };
  }


  // =============================================
  // Initial construction
  // =============================================

  return {
    key:
      "building",

    label:
      "EM CONSTRUÇÃO INICIAL",

    badgeClass:
      "border border-warning text-warning bg-transparent",

    description:
      "Este personagem ainda está sendo montado. Utilize somente os pontos de criação inicial. Pontos de Experiência e evoluções ainda não estão disponíveis.",
  };
}


// =============================================
// Character status markup
// =============================================

function createCharacterStatus(
  character
) {
  const status =
    getCharacterStatus(
      character
    );


  const label =
    escapeCharacterHtml(
      status.label
    );


  const description =
    escapeCharacterHtml(
      status.description
    );


  return `
    <div
      class="
        d-flex
        align-items-center
        flex-wrap
        gap-1
      "
      data-character-status="${status.key}"
    >

      <span
        class="
          badge
          rounded-pill
          ${status.badgeClass}
        "
      >
        ${label}
      </span>


      <button
        type="button"
        class="
          btn
          btn-sm
          p-0
          border-0
          bg-transparent
          text-secondary
          character-status-help
        "
        data-bs-toggle="popover"
        data-bs-trigger="focus"
        data-bs-placement="top"
        data-bs-title="Status do personagem"
        data-bs-content="${description}"
        aria-label="Explicação do status do personagem"
        title="Explicação do status"
      >
        <span
          class="
            badge
            rounded-circle
            border
            border-secondary
            text-secondary
            bg-transparent
          "
        >
          ?
        </span>
      </button>

    </div>
  `;
}


// =============================================
// Chronicle summary
// =============================================

function getCharacterHouseSummary(
  character
) {
  // =============================================
  // Approved Chronicle
  // =============================================

  if (
    character.motherHouse
  ) {
    return (
      character.motherHouse.name ||
      "Crônica vinculada"
    );
  }


  // =============================================
  // Pending Chronicle
  //
  // O status já informa que está aguardando.
  // Aqui mostramos somente qual Crônica foi
  // escolhida.
  // =============================================

  if (
    character.pendingMotherHouse
  ) {
    return (
      character
        .pendingMotherHouse
        .name ||
      "Crônica selecionada"
    );
  }


  // =============================================
  // No Chronicle
  // =============================================

  return "Sem Crônica";
}


// =============================================
// Chronicle request completed
// =============================================

async function handleCharacterHouseRequestCompleted({
  characterId,
  pendingMotherHouse,
}) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    await loadCharacters();

    return;
  }


  const character =
    characters.find(
      (item) =>
        String(
          item.id
        ) ===
        String(
          characterId
        )
    );


  if (!character) {
    await loadCharacters();

    return;
  }


  // =============================================
  // Update local state
  // =============================================

  character.motherHouse =
    null;

  character.pendingMotherHouse =
    pendingMotherHouse;


  // =============================================
  // Find card
  // =============================================

  const card =
    document.querySelector(
      `.character-card[data-character-id="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    );


  if (!card) {
    await loadCharacters();

    return;
  }


  // =============================================
  // Update status
  // =============================================

  const statusSlot =
    card.querySelector(
      ".character-status-slot"
    );


  if (statusSlot) {
    statusSlot.innerHTML =
      createCharacterStatus(
        character
      );
  }


  // =============================================
  // Update Chronicle summary
  // =============================================

  const summary =
    card.querySelector(
      ".character-house-summary"
    );


  if (summary) {
    const sect =
      escapeCharacterHtml(
        window.getSectLabel?.(
          character.sect
        ) ||
        character.sect ||
        ""
      );


    const houseSummary =
      escapeCharacterHtml(
        getCharacterHouseSummary(
          character
        )
      );


    summary.innerHTML =
      `${
        sect
          ? `${sect} · `
          : ""
      }${houseSummary}`;
  }


  // =============================================
  // Update Chronicle field
  // =============================================

  const houseField =
    card.querySelector(
      ".character-house-field"
    );


  if (houseField) {
    houseField.outerHTML =
      createCharacterHouseField(
        character
      );
  }


  // =============================================
  // Reinitialize new popover
  // =============================================

  setupCharacterPopovers(
    card
  );
}


// =============================================
// Events
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


async function handleCharacterListClick(
  event
) {
  const container =
    event.currentTarget;


  // =============================================
  // Inline fields
  // =============================================

  if (
    await handleCharacterInlineEditClick(
      event,
      container
    )
  ) {
    return;
  }


  const target =
    event.target instanceof Element
      ? event.target
      : null;


  if (!target) {
    return;
  }


  // =============================================
  // Status help
  // =============================================

  if (
    target.closest(
      ".character-status-help"
    )
  ) {
    return;
  }


  // =============================================
  // Generation help
  // =============================================

  if (
    target.closest(
      ".character-generation-help"
    )
  ) {
    return;
  }


  // =============================================
  // Delete
  // =============================================

  const deleteAction =
    target.closest(
      ".character-delete-selector, .character-delete-button"
    );


  if (
    deleteAction
  ) {
    const saved =
      await saveActiveCharacterInlineEdit();


    if (!saved) {
      return;
    }


    if (
      handleCharacterDeleteClick(
        event,
        container
      )
    ) {
      return;
    }

  } else if (
    handleCharacterDeleteClick(
      event,
      container
    )
  ) {
    return;
  }


  // =============================================
  // Chronicle
  // =============================================

  const houseAction =
    target.closest(
      ".character-house-select-button"
    );


  if (houseAction) {
    const saved =
      await saveActiveCharacterInlineEdit();


    if (!saved) {
      return;
    }


    if (
      handleCharacterHouseClick(
        event,
        container
      )
    ) {
      return;
    }

  } else if (
    handleCharacterHouseClick(
      event,
      container
    )
  ) {
    return;
  }


  // =============================================
  // Open / close character
  // =============================================

  const openButton =
    target.closest(
      ".character-open-button"
    );


  if (
    !openButton ||
    !container.contains(
      openButton
    )
  ) {
    return;
  }


  const characterId =
    openButton
      .dataset
      .characterId;


  if (!characterId) {
    return;
  }


  const saved =
    await saveActiveCharacterInlineEdit();


  if (!saved) {
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