// =============================================
// ByNight Main - Houses
// =============================================

window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.house =
  window.ByNightMain.house || {
    houses: [],
  };


// =============================================
// Load Houses
// =============================================

export async function loadHouses() {
  try {
    const response =
      await fetch(
        "/api/houses",
        {
          method: "GET",

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


    window.ByNightMain
      .house
      .houses =
        houses;


    renderHouses(
      houses
    );

  } catch (error) {
    console.error(
      "[HOUSE] Erro ao carregar Houses:",
      error
    );


    window.ByNightMain
      .house
      .houses =
        [];


    renderHouseError();
  }
}


// =============================================
// Render Houses
// =============================================

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
        Você ainda não possui nenhuma House cadastrada.
      </p>

      <button
        id="createHouseButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createHouseModal"
      >
        Criar minha primeira House
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
        + Criar House
      </button>

    </div>
  `;
}


// =============================================
// House card
// =============================================

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
      class="border border-secondary rounded p-3 mb-2"
      data-house-id="${id}"
    >

      <div
        class="d-flex align-items-center justify-content-between gap-3"
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
          class="btn btn-outline-secondary btn-sm"
          disabled
        >
          Abrir
        </button>

      </div>

    </article>
  `;
}


// =============================================
// House container
// =============================================

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


// =============================================
// Role labels
// =============================================

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
      return "Membro";

    default:
      return "Membro";
  }
}


// =============================================
// Plan labels
// =============================================

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


// =============================================
// Error
// =============================================

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
      Não foi possível carregar suas Houses.
    </div>
  `;
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


// =============================================
// Temporary globals
// =============================================

window.loadHouses =
  loadHouses;

window.renderHouses =
  renderHouses;