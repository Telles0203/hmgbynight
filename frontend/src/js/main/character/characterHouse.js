// =============================================
// Character House
// =============================================

let selectedCharacterId =
  null;

let onHouseRequestCompleted =
  null;


// =============================================
// Character House field
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
  // Approved House
  // =============================================

  if (motherHouse) {
    const houseName =
      escapeHouseHtml(
        motherHouse.name ||
        "House vinculada"
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
  // Pending House
  // =============================================

  if (pendingMotherHouse) {
    const houseName =
      escapeHouseHtml(
        pendingMotherHouse.name ||
        "House"
      );


    return `
      <span
        class="character-house-field d-flex flex-column gap-1"
      >

        <span class="text-light">
          ${houseName}
        </span>

        <span
          class="text-warning small"
        >
          Aguardando aprovação
        </span>

      </span>
    `;
  }


  // =============================================
  // No House
  // =============================================

  return `
    <span
      class="character-house-field"
    >

      <button
        type="button"
        class="btn btn-outline-light btn-sm character-house-select-button"
        data-character-id="${characterId}"
      >
        Selecionar House
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


  const button =
    target.closest(
      ".character-house-select-button"
    );


  if (
    !button ||
    !container.contains(
      button
    )
  ) {
    return false;
  }


  const characterId =
    String(
      button.dataset.characterId ||
      ""
    ).trim();


  if (!characterId) {
    return true;
  }


  openCharacterHouseModal(
    characterId
  );


  return true;
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


  selectedCharacterId =
    characterId;


  resetCharacterHouseModalContent();


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


  await loadAvailableHouses();
}


// =============================================
// Load Houses
// =============================================

async function loadAvailableHouses() {
  const list =
    document.getElementById(
      "characterHouseList"
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (!list) {
    return;
  }


  list.innerHTML = `
    <div
      class="text-secondary small"
    >
      Carregando Houses...
    </div>
  `;


  if (submitButton) {
    submitButton.disabled =
      true;
  }


  try {
    const response =
      await fetch(
        "/api/houses",
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
        "Não foi possível carregar as Houses."
      );
    }


    const houses =
      Array.isArray(
        data.houses
      )
        ? data.houses
        : [];


    renderAvailableHouses(
      houses
    );

  } catch (error) {
    console.error(
      "[CHARACTER HOUSE] Erro ao carregar Houses:",
      error
    );


    list.innerHTML = `
      <div
        class="alert alert-danger mb-0"
        role="alert"
      >
        Não foi possível carregar as Houses disponíveis.
      </div>
    `;
  }
}


// =============================================
// Render Houses
// =============================================

function renderAvailableHouses(
  houses
) {
  const list =
    document.getElementById(
      "characterHouseList"
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (!list) {
    return;
  }


  if (
    houses.length ===
    0
  ) {
    list.innerHTML = `
      <div
        class="text-secondary small"
      >
        Nenhuma House disponível.
      </div>
    `;


    if (submitButton) {
      submitButton.disabled =
        true;
    }


    return;
  }


  list.innerHTML =
    houses
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


          return `
            <label
              class="d-flex align-items-center gap-3 border border-secondary rounded p-3 mb-2"
            >

              <input
                class="form-check-input mt-0 character-house-radio"
                type="radio"
                name="characterHouse"
                value="${id}"
              >

              <span class="text-light">
                ${name}
              </span>

            </label>
          `;
        }
      )
      .join("");


  list
    .querySelectorAll(
      ".character-house-radio"
    )
    .forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          () => {
            if (
              submitButton
            ) {
              submitButton.disabled =
                false;
            }
          }
        );
      }
    );
}


// =============================================
// Submit House request
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


  const selectedHouse =
    document.querySelector(
      'input[name="characterHouse"]:checked'
    );


  if (!selectedHouse) {
    showCharacterHouseAlert(
      "Selecione uma House."
    );

    return;
  }


  const houseId =
    String(
      selectedHouse.value ||
      ""
    ).trim();


  const characterId =
    selectedCharacterId;


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
        "Não foi possível solicitar o vínculo com a House."
      );

      return;
    }


    // =============================================
    // Atualiza somente o personagem alterado
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
      "[CHARACTER HOUSE] Erro ao solicitar House:",
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
        class="modal-dialog modal-dialog-centered"
      >

        <div
          class="modal-content bg-dark border border-danger"
        >

          <div
            class="modal-header border-secondary"
          >

            <h2
              id="characterHouseModalLabel"
              class="modal-title h5 text-light"
            >
              Selecionar House mãe
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
                class="text-secondary small"
              >
                Selecione a House que deverá receber
                a solicitação de vínculo deste personagem.
              </p>


              <div
                id="characterHouseList"
              ></div>


              <p
                class="text-secondary small mb-0 mt-3"
              >
                O personagem somente será vinculado
                após a House aceitar a solicitação.
              </p>

            </div>


            <div
              class="modal-footer border-secondary"
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


  resetCharacterHouseModalContent();
}


function resetCharacterHouseModalContent() {
  hideCharacterHouseAlert();


  const list =
    document.getElementById(
      "characterHouseList"
    );


  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (list) {
    list.innerHTML =
      "";
  }


  if (submitButton) {
    submitButton.disabled =
      true;

    submitButton.textContent =
      "Solicitar vínculo";
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


  button.disabled =
    loading;


  button.textContent =
    loading
      ? "Solicitando..."
      : "Solicitar vínculo";
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


// =============================================
// Escape
// =============================================

function escapeHouseHtml(
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