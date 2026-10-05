export {
  createCharacterHouseField,
} from "./characterHouseField.js";

import {
  ensureCharacterHouseModal,
  showCharacterHouseModal,
  updateCharacterHouseModalMode,
  updateCharacterHouseSubmitButton,
  closeCharacterHouseModal,
  resetCharacterHouseModalContent,
  setHouseRequestLoading,
  showCharacterHouseAlert,
  hideCharacterHouseAlert,
} from "./characterHouseModal.js";

import {
  loadCharacterHouseOptions,
} from "./characterHouseSearchList.js";


let selectedCharacterId =
  null;

let selectedHouseId =
  "";

let currentPendingHouseId =
  "";

let onHouseRequestCompleted =
  null;

let houseSearchTimer =
  null;

let houseSearchAbortController =
  null;


export function setupCharacterHouseModal(
  onCompleted
) {
  if (
    typeof onCompleted ===
    "function"
  ) {
    onHouseRequestCompleted =
      onCompleted;
  }


  const modalElement =
    ensureCharacterHouseModal();


  if (!modalElement) {
    return;
  }


  const form =
    modalElement.querySelector(
      "#characterHouseForm"
    );


  const searchInput =
    modalElement.querySelector(
      "#characterHouseSearch"
    );


  if (
    form &&
    form.dataset.bound !==
      "true"
  ) {
    form.dataset.bound =
      "true";


    form.addEventListener(
      "submit",
      handleHouseRequestSubmit
    );
  }


  if (
    searchInput &&
    searchInput.dataset.bound !==
      "true"
  ) {
    searchInput.dataset.bound =
      "true";


    searchInput.addEventListener(
      "input",
      () => {
        selectedHouseId =
          "";


        updateCharacterHouseSubmitButton(
          false
        );


        if (
          houseSearchTimer
        ) {
          clearTimeout(
            houseSearchTimer
          );
        }


        houseSearchTimer =
          setTimeout(
            () => {
              loadAvailableHouses(
                searchInput.value
              );
            },
            250
          );
      }
    );
  }


  if (
    modalElement.dataset.bound !==
      "true"
  ) {
    modalElement.dataset.bound =
      "true";


    modalElement.addEventListener(
      "hidden.bs.modal",
      resetCharacterHouseModal
    );
  }
}


export function handleCharacterHouseClick(
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


  const editButton =
    target.closest(
      ".character-house-edit-button"
    );


  if (
    editButton &&
    container.contains(
      editButton
    )
  ) {
    const field =
      editButton.closest(
        ".character-house-field"
      );


    setPendingHouseActionsOpen(
      field,
      true
    );


    return true;
  }


  const cancelEditButton =
    target.closest(
      ".character-house-edit-cancel-button"
    );


  if (
    cancelEditButton &&
    container.contains(
      cancelEditButton
    )
  ) {
    const field =
      cancelEditButton.closest(
        ".character-house-field"
      );


    setPendingHouseActionsOpen(
      field,
      false
    );


    return true;
  }


  const selectButton =
    target.closest(
      `
        .character-house-select-button,
        .character-house-change-button
      `
    );


  if (
    selectButton &&
    container.contains(
      selectButton
    )
  ) {
    const characterId =
      String(
        selectButton.dataset
          .characterId ||
        ""
      ).trim();


    if (!characterId) {
      return true;
    }


    const field =
      selectButton.closest(
        ".character-house-field"
      );


    setPendingHouseActionsOpen(
      field,
      false
    );


    openCharacterHouseModal(
      characterId
    );


    return true;
  }


  const removeButton =
    target.closest(
      ".character-house-remove-button"
    );


  if (
    removeButton &&
    container.contains(
      removeButton
    )
  ) {
    const characterId =
      String(
        removeButton.dataset
          .characterId ||
        ""
      ).trim();


    if (!characterId) {
      return true;
    }


    removePendingHouseRequest(
      characterId,
      removeButton
    );


    return true;
  }


  return false;
}


function setPendingHouseActionsOpen(
  field,
  open
) {
  if (!field) {
    return;
  }


  const actions =
    field.querySelector(
      ".character-house-actions"
    );


  const editButton =
    field.querySelector(
      ".character-house-edit-button"
    );


  if (actions) {
    actions.classList.toggle(
      "d-none",
      !open
    );
  }


  if (editButton) {
    editButton.classList.toggle(
      "d-none",
      open
    );


    editButton.setAttribute(
      "aria-expanded",
      open
        ? "true"
        : "false"
    );
  }
}


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


async function openCharacterHouseModal(
  characterId
) {
  const modalElement =
    ensureCharacterHouseModal();


  if (!modalElement) {
    return;
  }


  const character =
    getCharacterById(
      characterId
    );


  selectedCharacterId =
    characterId;


  selectedHouseId =
    "";


  currentPendingHouseId =
    String(
      character
        ?.pendingMotherHouse
        ?.id ||
      ""
    );


  resetCharacterHouseModalContent();


  updateCharacterHouseModalMode(
    Boolean(
      currentPendingHouseId
    )
  );


  if (
    !showCharacterHouseModal(
      modalElement
    )
  ) {
    console.error(
      "[CHARACTER HOUSE] Bootstrap Modal não disponível."
    );


    return;
  }


  await loadAvailableHouses(
    ""
  );
}


async function loadAvailableHouses(
  query = ""
) {
  houseSearchAbortController
    ?.abort();


  const controller =
    new AbortController();


  houseSearchAbortController =
    controller;


  updateCharacterHouseSubmitButton(
    Boolean(
      selectedHouseId
    )
  );


  await loadCharacterHouseOptions({
    query,

    currentPendingHouseId,

    selectedHouseId,

    signal:
      controller.signal,

    onSelect:
      (houseId) => {
        selectedHouseId =
          houseId;


        updateCharacterHouseSubmitButton(
          Boolean(
            selectedHouseId
          )
        );
      },
  });


  if (
    houseSearchAbortController ===
    controller
  ) {
    houseSearchAbortController =
      null;
  }
}


async function handleHouseRequestSubmit(
  event
) {
  event.preventDefault();


  if (
    !selectedCharacterId
  ) {
    showCharacterHouseAlert(
      "Personagem inválido."
    );


    return;
  }


  if (!selectedHouseId) {
    showCharacterHouseAlert(
      "Selecione uma Crônica."
    );


    return;
  }


  const characterId =
    selectedCharacterId;


  const houseId =
    selectedHouseId;


  const changing =
    Boolean(
      currentPendingHouseId
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  hideCharacterHouseAlert();


  try {
    setHouseRequestLoading(
      submitButton,
      true,
      {
        changing,
        hasSelection:
          true,
      }
    );


    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          characterId
        )}/mother-house-request`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              houseId,
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
      showCharacterHouseAlert(
        data?.error ||
        "Não foi possível solicitar o vínculo com a Crônica."
      );


      return;
    }


    if (
      typeof onHouseRequestCompleted ===
      "function"
    ) {
      await onHouseRequestCompleted({
        characterId,

        pendingMotherHouse:
          data.pendingMotherHouse ||
          null,
      });
    }


    closeCharacterHouseModal();

  } catch (error) {
    console.error(
      "[CHARACTER HOUSE] Erro ao solicitar Crônica:",
      error
    );


    showCharacterHouseAlert(
      "Erro de conexão com o servidor."
    );

  } finally {
    setHouseRequestLoading(
      submitButton,
      false,
      {
        changing,

        hasSelection:
          Boolean(
            selectedHouseId
          ),
      }
    );
  }
}


async function removePendingHouseRequest(
  characterId,
  button
) {
  const confirmed =
    window.confirm(
      "Remover a solicitação de vínculo com esta Crônica?"
    );


  if (!confirmed) {
    return;
  }


  const originalText =
    button?.textContent ||
    "Remover solicitação";


  try {
    if (button) {
      button.disabled =
        true;


      button.textContent =
        "Removendo...";
    }


    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          characterId
        )}/mother-house-request`,
        {
          method:
            "DELETE",

          credentials:
            "include",
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
      window.alert(
        data?.error ||
        "Não foi possível remover a solicitação."
      );


      return;
    }


    if (
      typeof onHouseRequestCompleted ===
      "function"
    ) {
      await onHouseRequestCompleted({
        characterId,

        pendingMotherHouse:
          null,
      });
    }

  } catch (error) {
    console.error(
      "[CHARACTER HOUSE] Erro ao remover solicitação:",
      error
    );


    window.alert(
      "Erro de conexão com o servidor."
    );

  } finally {
    if (
      button &&
      button.isConnected
    ) {
      button.disabled =
        false;


      button.textContent =
        originalText;
    }
  }
}


function resetCharacterHouseModal() {
  selectedCharacterId =
    null;


  selectedHouseId =
    "";


  currentPendingHouseId =
    "";


  if (
    houseSearchTimer
  ) {
    clearTimeout(
      houseSearchTimer
    );


    houseSearchTimer =
      null;
  }


  houseSearchAbortController
    ?.abort();


  houseSearchAbortController =
    null;


  resetCharacterHouseModalContent();
}