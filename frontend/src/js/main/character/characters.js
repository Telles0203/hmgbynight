import {
  toggleCharacterView,
} from "./view/characterView.js";

import {
  createCharacterCard,
  createCharacterStatuses,
  getCharacterHouseSummary,
  setupCharacterPopovers,
} from "./view/characterCard.js";

import {
  createCharacterCreationNotice,
  setupCharacterCreationNotice,
} from "./characterCreationNotice.js";

import {
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

import {
  handleCharacterVirtueClick,
  restoreCharacterVirtueDrafts,
} from "./characterVirtues.js";


window.ByNightMain =
  window.ByNightMain || {};


window.ByNightMain.character =
  window.ByNightMain.character || {
    options:
      null,

    characters:
      [],
  };


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
        .catch(
          () => ({})
        );


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


    setupCharacterCreationNotice(
      container
    );


    setupCharacterPopovers(
      container
    );


    return;
  }


  const cards =
    characters
      .map(
        (
          character
        ) =>
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


  setupCharacterCreationNotice(
    container
  );


  setupCharacterPopovers(
    container
  );


  restoreCharacterVirtueDrafts(
    container
  );
}


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
      (
        item
      ) =>
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


  character.motherHouse =
    null;


  character.pendingMotherHouse =
    pendingMotherHouse;


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


  const statusSlot =
    card.querySelector(
      ".character-status-slot"
    );


  if (statusSlot) {
    statusSlot.innerHTML =
      createCharacterStatuses(
        character
      );
  }


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


  setupCharacterPopovers(
    card
  );
}


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


  if (
    await handleCharacterInlineEditClick(
      event,
      container
    )
  ) {
    return;
  }


  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (!target) {
    return;
  }


  if (
    await handleCharacterVirtueClick(
      event,
      container
    )
  ) {
    return;
  }


  if (
    target.closest(
      ".character-status-help"
    )
  ) {
    return;
  }


  if (
    target.closest(
      ".character-generation-help"
    )
  ) {
    return;
  }


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


  const houseAction =
    target.closest(
      `
        .character-house-select-button,
        .character-house-change-button,
        .character-house-remove-button
      `
    );


  if (
    houseAction
  ) {
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
    openButton.dataset
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


window.loadCharacters =
  loadCharacters;


window.renderCharacters =
  renderCharacters;