import {
  openChronicleManagement,
} from "./chronicleManagement.js";


window.ByNightMain =
  window.ByNightMain || {};


window.ByNightMain.house =
  window.ByNightMain.house || {
    houses:
      [],
  };


export async function loadHouses() {
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
        .catch(
          () => ({})
        );


    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
          "Não foi possível carregar as Crônicas."
      );
    }


    const houses =
      Array.isArray(
        data.houses
      )
        ? data.houses
        : [];


    window.ByNightMain
      .house
      .houses =
        houses;


    renderHouses(
      houses
    );

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao carregar Crônicas:",
      error
    );


    window.ByNightMain
      .house
      .houses =
        [];


    renderHouseError();
  }
}


export function renderHouses(
  houses
) {
  const container =
    getHouseListContainer();


  if (!container) {
    return;
  }


  if (
    houses.length ===
    0
  ) {
    container.innerHTML = `
      <p class="text-secondary small">
        Você ainda não possui nenhuma Crônica cadastrada.
      </p>

      <button
        id="createHouseButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createHouseModal"
      >
        Criar minha primeira Crônica
      </button>
    `;


    return;
  }


  const cards =
    houses
      .map(
        (house) =>
          createHouseCard(
            house
          )
      )
      .join("");


  container.innerHTML = `
    <div id="houseList">
      ${cards}
    </div>

    <div class="mt-3">

      <button
        id="createHouseButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createHouseModal"
      >
        + Criar Crônica
      </button>

    </div>
  `;


  setupChronicleOpenButtons(
    container
  );
}


function createHouseCard(
  house
) {
  const id =
    escapeHouseHtml(
      house.id
    );


  const name =
    escapeHouseHtml(
      house.name
    );


  const role =
    escapeHouseHtml(
      getHouseRoleLabel(
        house.role
      )
    );


  const plan =
    escapeHouseHtml(
      getHousePlanLabel(
        house.plan
      )
    );


  return `
    <article
      class="
        border
        border-secondary
        rounded
        p-3
        mb-2
      "
      data-house-id="${id}"
    >

      <div
        class="
          d-flex
          align-items-center
          justify-content-between
          gap-3
        "
      >

        <div class="min-w-0">

          <h3
            class="h6 text-light mb-1"
          >
            ${name}
          </h3>

          <div
            class="text-secondary small"
          >
            ${role} · ${plan}
          </div>

        </div>


        <button
          type="button"
          class="
            btn
            btn-outline-light
            btn-sm
            chronicle-open-button
          "
          data-house-id="${id}"
        >
          Abrir
        </button>

      </div>

    </article>
  `;
}


function setupChronicleOpenButtons(
  container
) {
  container
    .querySelectorAll(
      ".chronicle-open-button"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const houseId =
              button.dataset
                .houseId;


            if (!houseId) {
              return;
            }


            await openChronicleManagement(
              houseId
            );
          }
        );
      }
    );
}


function getHouseListContainer() {
  const panel =
    document.getElementById(
      "housePanel"
    );


  if (!panel) {
    return null;
  }


  const body =
    panel.querySelector(
      ".card-body"
    );


  if (!body) {
    return null;
  }


  let container =
    body.querySelector(
      "#houseListContainer"
    );


  if (container) {
    return container;
  }


  const header =
    body.querySelector(
      ".mb-4"
    );


  Array
    .from(
      body.children
    )
    .forEach(
      (child) => {
        if (
          child !==
          header
        ) {
          child.remove();
        }
      }
    );


  container =
    document.createElement(
      "div"
    );


  container.id =
    "houseListContainer";


  body.appendChild(
    container
  );


  return container;
}


function getHouseRoleLabel(
  role
) {
  switch (role) {
    case "owner":
      return "Proprietário";

    case "admin":
      return "Administrador";

    case "narrator":
      return "Narrador";

    case "member":
      return "Jogador";

    default:
      return "Membro";
  }
}


function getHousePlanLabel(
  plan
) {
  switch (plan) {
    case "free":
      return "Plano Free";

    default:
      return "Plano Free";
  }
}


function renderHouseError() {
  const container =
    getHouseListContainer();


  if (!container) {
    return;
  }


  container.innerHTML = `
    <div
      class="alert alert-danger"
      role="alert"
    >
      Não foi possível carregar suas Crônicas.
    </div>
  `;
}


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


window.loadHouses =
  loadHouses;


window.renderHouses =
  renderHouses;