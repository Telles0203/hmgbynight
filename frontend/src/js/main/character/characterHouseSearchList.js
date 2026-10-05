import {
  escapeHouseHtml,
  searchAvailableHouses,
} from "../house/houseSearch.js";


export async function loadCharacterHouseOptions({
  query = "",
  currentPendingHouseId = "",
  selectedHouseId = "",
  signal,
  onSelect,
}) {
  const list =
    document.getElementById(
      "characterHouseList"
    );


  const count =
    document.getElementById(
      "characterHouseResultCount"
    );


  if (!list) {
    return [];
  }


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


  try {
    const houses =
      await searchAvailableHouses(
        query,
        {
          limit:
            20,

          signal,
        }
      );


    renderCharacterHouseOptions({
      houses,
      query,
      currentPendingHouseId,
      selectedHouseId,
      onSelect,
    });


    return houses;

  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      return null;
    }


    console.error(
      "[CHARACTER HOUSE] Erro ao pesquisar Crônicas:",
      error
    );


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


    return [];
  }
}


function renderCharacterHouseOptions({
  houses,
  query,
  currentPendingHouseId,
  selectedHouseId,
  onSelect,
}) {
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


  if (
    !Array.isArray(
      houses
    ) ||
    houses.length ===
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


  list
    .querySelectorAll(
      ".character-house-radio:not(:disabled)"
    )
    .forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          () => {
            if (
              typeof onSelect ===
              "function"
            ) {
              onSelect(
                String(
                  radio.value ||
                  ""
                )
              );
            }
          }
        );
      }
    );


  if (count) {
    count.textContent =
      houses.length ===
      20
        ? "Até 20 resultados exibidos"
        : `${houses.length} ${
            houses.length === 1
              ? "resultado"
              : "resultados"
          }`;
  }
}