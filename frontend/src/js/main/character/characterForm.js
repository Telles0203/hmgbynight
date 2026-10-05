import {
  escapeHouseHtml,
  searchAvailableHouses,
} from "../house/houseSearch.js";


// =============================================
// House search state
// =============================================

let selectedCreateHouseId =
  "";

let createHouseSearchTimer =
  null;

let createHouseAbortController =
  null;


// =============================================
// Alerts
// =============================================

function showCharacterAlert(
  message,
  type = "danger"
) {
  const alert =
    document.getElementById(
      "createCharacterAlert"
    );


  if (!alert) {
    return;
  }


  alert.className =
    "alert";


  alert.classList.add(
    type === "success"
      ? "alert-success"
      : "alert-danger"
  );


  alert.textContent =
    message;
}


function hideCharacterAlert() {
  const alert =
    document.getElementById(
      "createCharacterAlert"
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
// Search Houses
// =============================================

async function loadCreateCharacterHouses(
  query = ""
) {
  const list =
    document.getElementById(
      "createCharacterHouseList"
    );


  const count =
    document.getElementById(
      "createCharacterHouseCount"
    );


  if (!list) {
    return;
  }


  createHouseAbortController
    ?.abort();


  createHouseAbortController =
    new AbortController();


  list.innerHTML = `
    <div class="text-secondary small py-2">
      Pesquisando Houses...
    </div>
  `;


  if (count) {
    count.textContent =
      "";
  }


  try {
    const houses =
      await searchAvailableHouses(
        query,
        {
          limit:
            20,

          signal:
            createHouseAbortController
              .signal,
        }
      );


    renderCreateCharacterHouses(
      houses,
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
      "[CHARACTER] Erro ao pesquisar Houses:",
      error
    );


    list.innerHTML = `
      <div class="text-warning small py-2">
        Não foi possível pesquisar as Houses.
        Você ainda pode criar o personagem sem House.
      </div>
    `;


    if (count) {
      count.textContent =
        "";
    }
  }
}


// =============================================
// Render results
// =============================================

function renderCreateCharacterHouses(
  houses,
  query = ""
) {
  const list =
    document.getElementById(
      "createCharacterHouseList"
    );


  const count =
    document.getElementById(
      "createCharacterHouseCount"
    );


  const noneRadio =
    document.getElementById(
      "createCharacterHouseNone"
    );


  if (!list) {
    return;
  }


  if (noneRadio) {
    noneRadio.checked =
      !selectedCreateHouseId;
  }


  if (
    houses.length ===
    0
  ) {
    list.innerHTML = `
      <div class="text-secondary small py-2">
        ${
          query
            ? "Nenhuma House encontrada."
            : "Nenhuma House disponível."
        }
      </div>
    `;


    if (count) {
      count.textContent =
        "0 resultados";
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


          const checked =
            String(
              selectedCreateHouseId
            ) ===
            String(
              house.id
            );


          return `
            <label
              class="d-flex align-items-center gap-3 border border-secondary rounded p-2 mb-2"
            >

              <input
                class="form-check-input mt-0 create-character-house-radio"
                type="radio"
                name="createCharacterHouseChoice"
                value="${id}"
                ${
                  checked
                    ? "checked"
                    : ""
                }
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
      ".create-character-house-radio"
    )
    .forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          () => {
            selectedCreateHouseId =
              String(
                radio.value ||
                ""
              );
          }
        );
      }
    );


  if (count) {
    count.textContent =
      houses.length === 20
        ? "Até 20 resultados exibidos"
        : `${houses.length} ${
            houses.length === 1
              ? "resultado"
              : "resultados"
          }`;
  }
}


// =============================================
// Reset House selector
// =============================================

function resetCreateCharacterHouseSelector() {
  selectedCreateHouseId =
    "";


  if (
    createHouseSearchTimer
  ) {
    clearTimeout(
      createHouseSearchTimer
    );

    createHouseSearchTimer =
      null;
  }


  createHouseAbortController
    ?.abort();


  createHouseAbortController =
    null;


  const searchInput =
    document.getElementById(
      "createCharacterHouseSearch"
    );


  const noneRadio =
    document.getElementById(
      "createCharacterHouseNone"
    );


  const list =
    document.getElementById(
      "createCharacterHouseList"
    );


  const count =
    document.getElementById(
      "createCharacterHouseCount"
    );


  if (searchInput) {
    searchInput.value =
      "";
  }


  if (noneRadio) {
    noneRadio.checked =
      true;
  }


  if (list) {
    list.innerHTML =
      "";
  }


  if (count) {
    count.textContent =
      "";
  }
}


// =============================================
// Setup
// =============================================

function setupCharacterFormHandlers() {
  const form =
    document.getElementById(
      "createCharacterForm"
    );


  const modalElement =
    document.getElementById(
      "createCharacterModal"
    );


  const sectSelect =
    document.getElementById(
      "characterSect"
    );


  const houseSearchInput =
    document.getElementById(
      "createCharacterHouseSearch"
    );


  const noneHouseRadio =
    document.getElementById(
      "createCharacterHouseNone"
    );


  if (!form) {
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


  // =============================================
  // Sect
  // =============================================

  sectSelect?.addEventListener(
    "change",
    () => {
      window
        .updateOtherSectVisibility
        ?.();
    }
  );


  // =============================================
  // House search
  // =============================================

  houseSearchInput?.addEventListener(
    "input",
    () => {
      selectedCreateHouseId =
        "";


      if (
        noneHouseRadio
      ) {
        noneHouseRadio.checked =
          true;
      }


      if (
        createHouseSearchTimer
      ) {
        clearTimeout(
          createHouseSearchTimer
        );
      }


      createHouseSearchTimer =
        setTimeout(
          () => {
            loadCreateCharacterHouses(
              houseSearchInput.value
            );
          },

          250
        );
    }
  );


  noneHouseRadio?.addEventListener(
    "change",
    () => {
      if (
        noneHouseRadio.checked
      ) {
        selectedCreateHouseId =
          "";
      }
    }
  );


  // =============================================
  // Modal opening
  // =============================================

  modalElement?.addEventListener(
    "show.bs.modal",
    () => {
      hideCharacterAlert();


      selectedCreateHouseId =
        "";


      if (
        houseSearchInput
      ) {
        houseSearchInput.value =
          "";
      }


      if (
        noneHouseRadio
      ) {
        noneHouseRadio.checked =
          true;
      }


      loadCreateCharacterHouses(
        ""
      );
    }
  );


  // =============================================
  // Submit
  // =============================================

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();


      const nameInput =
        document.getElementById(
          "characterName"
        );


      const primarySectSelect =
        document.getElementById(
          "characterSect"
        );


      const otherSectSelect =
        document.getElementById(
          "characterOtherSect"
        );


      const clanSelect =
        document.getElementById(
          "characterClan"
        );


      const saveButton =
        document.getElementById(
          "saveCharacterButton"
        );


      const name =
        nameInput
          ?.value
          ?.trim();


      const sect =
        window
          .getSelectedSect
          ?.() ||
        "";


      const clan =
        clanSelect
          ?.value ||
        "";


      const requestedMotherHouseId =
        selectedCreateHouseId ||
        null;


      hideCharacterAlert();


      if (!name) {
        showCharacterAlert(
          "Informe o nome do personagem."
        );

        nameInput?.focus();

        return;
      }


      if (
        !primarySectSelect?.value
      ) {
        showCharacterAlert(
          "Selecione a seita do personagem."
        );

        primarySectSelect?.focus();

        return;
      }


      if (
        primarySectSelect.value ===
          "other" &&
        !otherSectSelect?.value
      ) {
        showCharacterAlert(
          "Selecione uma das outras seitas."
        );

        otherSectSelect?.focus();

        return;
      }


      if (!clan) {
        showCharacterAlert(
          "Selecione o clã do personagem."
        );

        clanSelect?.focus();

        return;
      }


      try {
        if (saveButton) {
          saveButton.disabled =
            true;

          saveButton.textContent =
            "Criando...";
        }


        const response =
          await fetch(
            "/api/characters",
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
                  name,
                  sect,
                  clan,
                  requestedMotherHouseId,
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
          showCharacterAlert(
            data?.error ||
            "Não foi possível criar o personagem."
          );

          return;
        }


        const requestedHouse =
          Boolean(
            data.character
              ?.pendingMotherHouse
          );


        showCharacterAlert(
          requestedHouse
            ? "Personagem criado e solicitação de House enviada."
            : "Personagem criado com sucesso.",

          "success"
        );


        form.reset();


        resetCreateCharacterHouseSelector();


        window
          .updateOtherSectVisibility
          ?.();


        await window
          .loadCharacters
          ?.();


        setTimeout(
          () => {
            if (
              modalElement &&
              window.bootstrap
            ) {
              window.bootstrap.Modal
                .getOrCreateInstance(
                  modalElement
                )
                .hide();
            }
          },

          500
        );

      } catch (error) {
        console.error(
          "[CHARACTER] Erro ao criar personagem:",
          error
        );


        showCharacterAlert(
          "Erro de conexão com o servidor."
        );

      } finally {
        if (saveButton) {
          saveButton.disabled =
            false;

          saveButton.textContent =
            "Criar personagem";
        }
      }
    }
  );


  // =============================================
  // Modal closed
  // =============================================

  modalElement?.addEventListener(
    "hidden.bs.modal",
    () => {
      form.reset();


      hideCharacterAlert();


      resetCreateCharacterHouseSelector();


      window
        .updateOtherSectVisibility
        ?.();
    }
  );
}


// =============================================
// Globals
// =============================================

window.showCharacterAlert =
  showCharacterAlert;


window.hideCharacterAlert =
  hideCharacterAlert;


window.setupCharacterFormHandlers =
  setupCharacterFormHandlers;