import {
  toggleChronicleManagement,
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


  setupChronicleListEvents(
    container
  );


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

    <div
      id="chronicleCreateArea"
      class="mt-3"
    >
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
      class="chronicle-card"
      data-house-id="${id}"
    >

      <div class="chronicle-card-header">

        <div class="chronicle-card-identity">

          <h3
            class="
              chronicle-card-name
              h6
              text-light
              mb-1
            "
          >
            ${name}
          </h3>

          <div class="text-secondary small">
            ${role} · ${plan}
          </div>

        </div>


        <button
          type="button"
          class="
            chronicle-open-button
            btn
            btn-sm
          "
          data-house-id="${id}"
          aria-label="Abrir Crônica"
          title="Abrir Crônica"
        >
          ›
        </button>

      </div>


      <div class="chronicle-card-details">
        <div class="chronicle-card-details-inner"></div>
      </div>

    </article>
  `;
}


function setupChronicleListEvents(
  container
) {
  container.removeEventListener(
    "click",
    handleChronicleListClick
  );


  container.addEventListener(
    "click",
    handleChronicleListClick
  );
}


function handleChronicleListClick(
  event
) {
  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (!target) {
    return;
  }


  const button =
    target.closest(
      ".chronicle-open-button"
    );


  if (
    !button ||
    !event.currentTarget
      .contains(
        button
      )
  ) {
    return;
  }


  const houseId =
    String(
      button.dataset
        .houseId ||
      ""
    ).trim();


  if (!houseId) {
    return;
  }


  toggleChronicleManagement(
    houseId
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


  const header =
    body.querySelector(
      ":scope > .mb-4"
    );


  if (
    header &&
    !header.id
  ) {
    header.id =
      "housePanelHeader";
  }


  let container =
    body.querySelector(
      "#houseListContainer"
    );


  if (container) {
    return container;
  }


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