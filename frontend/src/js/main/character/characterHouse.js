import {
  escapeHouseHtml,
  searchAvailableHouses,
} from "../house/houseSearch.js";


// =============================================
// State
// =============================================

let selectedCharacterId =
  null;

let selectedHouseId =
  "";

let currentPendingHouseId =
  "";

let availableHouses =
  [];

let onHouseRequestCompleted =
  null;

let houseSearchTimer =
  null;

let houseSearchAbortController =
  null;


// =============================================
// Character Chronicle field
// =============================================

export function createCharacterHouseField(
  character
) {
  const characterId =
    escapeHouseHtml(
      character?.id
    );


  const motherHouse =
    character?.motherHouse;


  const pendingMotherHouse =
    character?.pendingMotherHouse;


  // =============================================
  // Approved Chronicle
  // =============================================

  if (motherHouse) {
    const houseName =
      escapeHouseHtml(
        motherHouse.name ||
        "Crônica vinculada"
      );


    return `
      <span
        class="character-house-field text-light"
      >
        ${houseName}
      </span>
    `;
  }


  // =============================================
  // Pending Chronicle
  // =============================================

  if (pendingMotherHouse) {
    const houseName =
      escapeHouseHtml(
        pendingMotherHouse.name ||
        "Crônica"
      );


    return `
      <span
        class="character-house-field"
      >

        <span
          class="character-house-pending-info"
        >

          <span
            class="
              d-flex
              flex-column
              align-items-start
              gap-1
            "
          >

            <span class="text-light">
              ${houseName}
            </span>


            <span
              class="text-secondary small"
            >
              Vínculo pendente
            </span>

          </span>


          <button
            type="button"
            class="
              btn
              btn-link
              btn-sm
              text-secondary
              text-decoration-none
              p-0
              character-inline-edit-button
              character-house-edit-button
            "
            data-character-id="${characterId}"
            aria-label="Editar vínculo com a Crônica"
            title="Editar vínculo com a Crônica"
            aria-expanded="false"
          >
            ✎
          </button>

        </span>


        <span
          class="
            character-house-actions
            d-none
          "
        >

          <button
            type="button"
            class="
              btn
              btn-outline-light
              btn-sm
              character-house-change-button
            "
            data-character-id="${characterId}"
          >
            Alterar Crônica
          </button>


          <button
            type="button"
            class="
              btn
              btn-outline-danger
              btn-sm
              character-house-remove-button
            "
            data-character-id="${characterId}"
          >
            Remover solicitação
          </button>


          <button
            type="button"
            class="
              btn
              btn-outline-secondary
              btn-sm
              character-house-edit-cancel-button
            "
            data-character-id="${characterId}"
          >
            Cancelar
          </button>

        </span>

      </span>
    `;
  }


  // =============================================
  // No Chronicle
  // =============================================

  return `
    <span
      class="character-house-field"
    >

      <button
        type="button"
        class="
          btn
          btn-outline-light
          btn-sm
          character-house-select-button
        "
        data-character-id="${characterId}"
      >
        Selecionar Crônica
      </button>

    </span>
  `;
}


// =============================================
// Setup modal
// =============================================

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


  // =============================================
  // Form
  // =============================================

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


  // =============================================
  // Search
  // =============================================

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


        updateSubmitButton();


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


  // =============================================
  // Modal reset
  // =============================================

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


// =============================================
// Character list click
// =============================================

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


  // =============================================
  // Open pending Chronicle controls
  // =============================================

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


  // =============================================
  // Close pending Chronicle controls
  // =============================================

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


  // =============================================
  // Select / change Chronicle
  // =============================================

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


  // =============================================
  // Remove pending request
  // =============================================

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


// =============================================
// Pending Chronicle controls
// =============================================

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
// Open modal
// =============================================

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


  availableHouses =
    [];


  resetCharacterHouseModalContent();


  updateCharacterHouseModalMode();


  const modal =
    getBootstrapModal(
      modalElement
    );


  if (!modal) {
    console.error(
      "[CHARACTER HOUSE] Bootstrap Modal não disponível."
    );


    return;
  }


  modal.show();


  await loadAvailableHouses(
    ""
  );
}


// =============================================
// Modal mode
// =============================================

function updateCharacterHouseModalMode() {
  const title =
    document.getElementById(
      "characterHouseModalLabel"
    );


  const description =
    document.getElementById(
      "characterHouseDescription"
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  const changing =
    Boolean(
      currentPendingHouseId
    );


  if (title) {
    title.textContent =
      changing
        ? "Alterar Crônica"
        : "Selecionar Crônica";
  }


  if (description) {
    description.textContent =
      changing
        ? "Selecione a nova Crônica que deverá receber a solicitação de vínculo deste personagem."
        : "Selecione a Crônica que deverá receber a solicitação de vínculo deste personagem.";
  }


  if (submitButton) {
    submitButton.textContent =
      changing
        ? "Alterar vínculo"
        : "Solicitar vínculo";
  }
}


// =============================================
// Load Chronicles
// =============================================

async function loadAvailableHouses(
  query = ""
) {
  const list =
    document.getElementById(
      "characterHouseList"
    );


  const count =
    document.getElementById(
      "characterHouseResultCount"
    );


  if (!list) {
    return;
  }


  // =============================================
  // Cancel previous search
  // =============================================

  houseSearchAbortController
    ?.abort();


  houseSearchAbortController =
    new AbortController();


  list.innerHTML = `
    <div
      class="text-secondary small py-2"
    >
      Pesquisando Crônicas...
    </div>
  `;


  if (count) {
    count.textContent =
      "";
  }


  updateSubmitButton();


  try {
    availableHouses =
      await searchAvailableHouses(
        query,
        {
          limit:
            20,

          signal:
            houseSearchAbortController
              .signal,
        }
      );


    renderAvailableHouses(
      query
    );

  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      return;
    }


    console.error(
      "[CHARACTER HOUSE] Erro ao pesquisar Crônicas:",
      error
    );


    availableHouses =
      [];


    list.innerHTML = `
      <div
        class="alert alert-danger mb-0"
        role="alert"
      >
        Não foi possível carregar as Crônicas disponíveis.
      </div>
    `;


    if (count) {
      count.textContent =
        "";
    }
  }
}


// =============================================
// Render Chronicles
// =============================================

function renderAvailableHouses(
  query = ""
) {
  const list =
    document.getElementById(
      "characterHouseList"
    );


  const count =
    document.getElementById(
      "characterHouseResultCount"
    );


  if (!list) {
    return;
  }


  // =============================================
  // Empty
  // =============================================

  if (
    availableHouses.length ===
    0
  ) {
    list.innerHTML = `
      <div
        class="text-secondary small py-2"
      >
        ${
          query
            ? "Nenhuma Crônica encontrada."
            : "Nenhuma Crônica disponível."
        }
      </div>
    `;


    if (count) {
      count.textContent =
        "0 resultados";
    }


    updateSubmitButton();


    return;
  }


  // =============================================
  // Results
  // =============================================

  list.innerHTML =
    availableHouses
      .map(
        (house) => {
          const id =
            escapeHouseHtml(
              house.id
            );


          const name =
            escapeHouseHtml(
              house.name
            );


          const isCurrent =
            String(
              currentPendingHouseId
            ) ===
            String(
              house.id
            );


          const checked =
            String(
              selectedHouseId
            ) ===
            String(
              house.id
            );


          return `
            <label
              class="
                d-flex
                align-items-center
                gap-3
                border
                border-secondary
                rounded
                p-3
                mb-2
                ${
                  isCurrent
                    ? "opacity-75"
                    : ""
                }
              "
            >

              <input
                class="
                  form-check-input
                  mt-0
                  character-house-radio
                "
                type="radio"
                name="characterHouseRequestChoice"
                value="${id}"
                ${
                  checked
                    ? "checked"
                    : ""
                }
                ${
                  isCurrent
                    ? "disabled"
                    : ""
                }
              >


              <span
                class="text-light flex-grow-1"
              >
                ${name}
              </span>


              ${
                isCurrent
                  ? `
                    <span
                      class="
                        badge
                        border
                        border-secondary
                        text-secondary
                        bg-transparent
                      "
                    >
                      Atual
                    </span>
                  `
                  : ""
              }

            </label>
          `;
        }
      )
      .join("");


  // =============================================
  // Radio listeners
  // =============================================

  list
    .querySelectorAll(
      ".character-house-radio:not(:disabled)"
    )
    .forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          () => {
            selectedHouseId =
              String(
                radio.value ||
                ""
              );


            updateSubmitButton();
          }
        );
      }
    );


  // =============================================
  // Result counter
  // =============================================

  if (count) {
    count.textContent =
      availableHouses.length ===
      20
        ? "Até 20 resultados exibidos"
        : `${availableHouses.length} ${
            availableHouses.length === 1
              ? "resultado"
              : "resultados"
          }`;
  }


  updateSubmitButton();
}


// =============================================
// Submit Chronicle request
// =============================================

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


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  hideCharacterHouseAlert();


  try {
    setHouseRequestLoading(
      submitButton,
      true
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


    // =============================================
    // Update changed character
    // =============================================

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
      false
    );
  }
}


// =============================================
// Remove pending request
// =============================================

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


// =============================================
// Modal creation
// =============================================

function ensureCharacterHouseModal() {
  let modal =
    document.getElementById(
      "characterHouseModal"
    );


  if (modal) {
    return modal;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML = `
    <div
      class="modal fade"
      id="characterHouseModal"
      tabindex="-1"
      aria-labelledby="characterHouseModalLabel"
      aria-hidden="true"
    >

      <div
        class="
          modal-dialog
          modal-dialog-centered
        "
      >

        <div
          class="
            modal-content
            bg-dark
            border
            border-danger
          "
        >

          <div
            class="
              modal-header
              border-secondary
            "
          >

            <h2
              id="characterHouseModalLabel"
              class="modal-title h5 text-light"
            >
              Selecionar Crônica
            </h2>


            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Fechar"
            ></button>

          </div>


          <form
            id="characterHouseForm"
          >

            <div
              class="modal-body"
            >

              <div
                id="characterHouseAlert"
                class="alert d-none"
                role="alert"
              ></div>


              <p
                id="characterHouseDescription"
                class="text-secondary small"
              >
                Selecione a Crônica que deverá receber
                a solicitação de vínculo deste personagem.
              </p>


              <!-- ============================== -->
              <!-- Search -->
              <!-- ============================== -->

              <div class="mb-3">

                <label
                  for="characterHouseSearch"
                  class="form-label text-secondary"
                >
                  Buscar Crônica
                </label>


                <input
                  id="characterHouseSearch"
                  type="search"
                  class="
                    form-control
                    bg-black
                    text-light
                    border-secondary
                  "
                  placeholder="Digite o nome da Crônica..."
                  autocomplete="off"
                >

              </div>


              <!-- ============================== -->
              <!-- Result count -->
              <!-- ============================== -->

              <div
                id="characterHouseResultCount"
                class="text-secondary small mb-2"
              ></div>


              <!-- ============================== -->
              <!-- Results -->
              <!-- ============================== -->

              <div
                id="characterHouseList"
                style="
                  max-height: 260px;
                  overflow-y: auto;
                "
              ></div>


              <p
                class="
                  text-secondary
                  small
                  mb-0
                  mt-3
                "
              >
                Até a aprovação, você poderá alterar
                ou remover esta solicitação e continuar
                editando normalmente o personagem.
              </p>

            </div>


            <div
              class="
                modal-footer
                border-secondary
              "
            >

              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>


              <button
                id="confirmCharacterHouseButton"
                type="submit"
                class="btn btn-blood"
                disabled
              >
                Solicitar vínculo
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  `;


  modal =
    wrapper.firstElementChild;


  const root =
    document.getElementById(
      "overlay-root"
    ) ||
    document.body;


  root.appendChild(
    modal
  );


  return modal;
}


// =============================================
// Submit button
// =============================================

function updateSubmitButton() {
  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (!submitButton) {
    return;
  }


  submitButton.disabled =
    !selectedHouseId;
}


// =============================================
// Close modal
// =============================================

function closeCharacterHouseModal() {
  const modalElement =
    document.getElementById(
      "characterHouseModal"
    );


  if (!modalElement) {
    return;
  }


  const modal =
    getBootstrapModal(
      modalElement
    );


  modal?.hide();
}


// =============================================
// Bootstrap helper
// =============================================

function getBootstrapModal(
  element
) {
  if (
    !window.bootstrap?.Modal
  ) {
    return null;
  }


  return window.bootstrap.Modal
    .getOrCreateInstance(
      element
    );
}


// =============================================
// Reset
// =============================================

function resetCharacterHouseModal() {
  selectedCharacterId =
    null;


  selectedHouseId =
    "";


  currentPendingHouseId =
    "";


  availableHouses =
    [];


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


function resetCharacterHouseModalContent() {
  hideCharacterHouseAlert();


  const searchInput =
    document.getElementById(
      "characterHouseSearch"
    );


  const list =
    document.getElementById(
      "characterHouseList"
    );


  const count =
    document.getElementById(
      "characterHouseResultCount"
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (searchInput) {
    searchInput.value =
      "";
  }


  if (list) {
    list.innerHTML =
      "";
  }


  if (count) {
    count.textContent =
      "";
  }


  if (submitButton) {
    submitButton.disabled =
      true;
  }
}


// =============================================
// Loading
// =============================================

function setHouseRequestLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }


  const changing =
    Boolean(
      currentPendingHouseId
    );


  if (loading) {
    button.disabled =
      true;


    button.textContent =
      changing
        ? "Alterando..."
        : "Solicitando...";


    return;
  }


  button.textContent =
    changing
      ? "Alterar vínculo"
      : "Solicitar vínculo";


  button.disabled =
    !selectedHouseId;
}


// =============================================
// Alert
// =============================================

function showCharacterHouseAlert(
  message
) {
  const alert =
    document.getElementById(
      "characterHouseAlert"
    );


  if (!alert) {
    return;
  }


  alert.textContent =
    message;


  alert.className =
    "alert alert-danger";
}


function hideCharacterHouseAlert() {
  const alert =
    document.getElementById(
      "characterHouseAlert"
    );


  if (!alert) {
    return;
  }


  alert.textContent =
    "";


  alert.className =
    "alert d-none";
}