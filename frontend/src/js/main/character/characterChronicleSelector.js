import {
  searchAvailableHouses,
} from "../house/houseSearch.js";


let selectedChronicleId =
  "";

let searchTimer =
  null;

let searchAbortController =
  null;


function escapeHtml(
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


async function loadChronicles(
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


  searchAbortController
    ?.abort();


  searchAbortController =
    new AbortController();


  const controller =
    searchAbortController;


  list.innerHTML = `
    <div class="text-secondary small py-2">
      Pesquisando Crônicas...
    </div>
  `;


  if (count) {
    count.textContent =
      "";
  }


  try {
    const chronicles =
      await searchAvailableHouses(
        query,
        {
          limit:
            20,

          signal:
            controller.signal,
        }
      );


    if (
      searchAbortController !==
      controller
    ) {
      return;
    }


    renderChronicles(
      chronicles,
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
      "[CHARACTER] Erro ao pesquisar Crônicas:",
      error
    );


    list.innerHTML = `
      <div class="text-warning small py-2">
        Não foi possível pesquisar as Crônicas.
        Você ainda pode criar o personagem sem Crônica.
      </div>
    `;


    if (count) {
      count.textContent =
        "";
    }

  } finally {
    if (
      searchAbortController ===
      controller
    ) {
      searchAbortController =
        null;
    }
  }
}


function renderChronicles(
  chronicles,
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
      !selectedChronicleId;
  }


  if (
    !Array.isArray(
      chronicles
    ) ||
    chronicles.length ===
      0
  ) {
    list.innerHTML = `
      <div class="text-secondary small py-2">
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


    return;
  }


  list.innerHTML =
    chronicles
      .map(
        (chronicle) => {
          const id =
            escapeHtml(
              chronicle.id
            );


          const name =
            escapeHtml(
              chronicle.name
            );


          const checked =
            String(
              selectedChronicleId
            ) ===
            String(
              chronicle.id
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
            selectedChronicleId =
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
      chronicles.length ===
        20
        ? "Até 20 resultados exibidos"
        : `${chronicles.length} ${
            chronicles.length ===
              1
              ? "resultado"
              : "resultados"
          }`;
  }
}


export function setupCreateCharacterChronicleSelector() {
  const searchInput =
    document.getElementById(
      "createCharacterHouseSearch"
    );


  const noneRadio =
    document.getElementById(
      "createCharacterHouseNone"
    );


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
        selectedChronicleId =
          "";


        if (noneRadio) {
          noneRadio.checked =
            true;
        }


        if (searchTimer) {
          clearTimeout(
            searchTimer
          );
        }


        searchTimer =
          setTimeout(
            () => {
              loadChronicles(
                searchInput.value
              );
            },
            250
          );
      }
    );
  }


  if (
    noneRadio &&
    noneRadio.dataset.bound !==
      "true"
  ) {
    noneRadio.dataset.bound =
      "true";


    noneRadio.addEventListener(
      "change",
      () => {
        if (
          noneRadio.checked
        ) {
          selectedChronicleId =
            "";
        }
      }
    );
  }
}


export async function prepareCreateCharacterChronicleSelector() {
  resetCreateCharacterChronicleSelector();


  const noneRadio =
    document.getElementById(
      "createCharacterHouseNone"
    );


  if (noneRadio) {
    noneRadio.checked =
      true;
  }


  await loadChronicles(
    ""
  );
}


export function resetCreateCharacterChronicleSelector() {
  selectedChronicleId =
    "";


  if (searchTimer) {
    clearTimeout(
      searchTimer
    );


    searchTimer =
      null;
  }


  searchAbortController
    ?.abort();


  searchAbortController =
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


export function getSelectedCreateCharacterChronicleId() {
  return (
    selectedChronicleId ||
    null
  );
}