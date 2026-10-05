export function ensureCharacterHouseModal() {
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


          <form id="characterHouseForm">

            <div class="modal-body">

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


              <div
                id="characterHouseResultCount"
                class="text-secondary small mb-2"
              ></div>


              <div
                id="characterHouseList"
                class="character-house-modal-list"
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


export function showCharacterHouseModal(
  element
) {
  const modal =
    getBootstrapModal(
      element
    );


  if (!modal) {
    return false;
  }


  modal.show();


  return true;
}


export function updateCharacterHouseModalMode(
  changing
) {
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


export function updateCharacterHouseSubmitButton(
  enabled
) {
  const submitButton =
    document.getElementById(
      "confirmCharacterHouseButton"
    );


  if (!submitButton) {
    return;
  }


  submitButton.disabled =
    !enabled;
}


export function closeCharacterHouseModal() {
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


export function resetCharacterHouseModalContent() {
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


export function setHouseRequestLoading(
  button,
  loading,
  {
    changing = false,
    hasSelection = false,
  } = {}
) {
  if (!button) {
    return;
  }


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
    !hasSelection;
}


export function showCharacterHouseAlert(
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


export function hideCharacterHouseAlert() {
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