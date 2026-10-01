function getCurrentRoute() {
  const route = window.location.pathname
    .replace(/^\/+|\/+$/g, "")
    .trim();

  return route || "home";
}

function isValidRoute(route) {
  return /^[a-zA-Z0-9_-]+$/.test(route);
}

function updateNavbar(route) {
  document.querySelectorAll("#navbar a.nav-link").forEach((link) => {
    const onclick = link.getAttribute("onclick");
    const listItem = link.closest("li");

    if (!listItem) {
      return;
    }

    if (
      onclick &&
      onclick.includes(`loadPage('${route}'`)
    ) {
      listItem.style.display = "none";
    } else {
      listItem.style.display = "";
    }
  });
}

function runPageScripts(route) {
  if (
    route === "main" &&
    typeof window.loadMainUser === "function"
  ) {
    window.loadMainUser();
  }

  if (
    route === "login" &&
    typeof window.onLoginPageLoaded === "function"
  ) {
    window.onLoginPageLoaded();
  }

  if (
    route === "register" &&
    typeof window.onRegisterPageLoaded === "function"
  ) {
    window.onRegisterPageLoaded();
  }
}

async function checkRouteAccess(route) {
  const protectedRoutes = [
    "main",
    "login",
    "register",
  ];

  if (!protectedRoutes.includes(route)) {
    return {
      allowed: true,
      redirect: null,
    };
  }

  if (typeof window.requireAuth !== "function") {
    console.error(
      "[ROUTER] requireAuth não está disponível."
    );

    return {
      allowed: route !== "main",
      redirect: route === "main" ? "login" : null,
    };
  }

  return window.requireAuth(route);
}

async function loadPage(
  route,
  options = {}
) {
  const {
    updateHistory = true,
    replaceHistory = false,
    checkAuth = true,
  } = options;

  if (!isValidRoute(route)) {
    showNotFound();
    return;
  }

  try {
    // ==============================
    // Route protection
    // ==============================

    if (checkAuth) {
      const access = await checkRouteAccess(route);

      if (!access.allowed && access.redirect) {
        return loadPage(access.redirect, {
          updateHistory: true,
          replaceHistory: true,
          checkAuth: false,
        });
      }
    }

    // ==============================
    // Load page
    // ==============================

    const response = await fetch(
      `/src/pages/${route}.html`
    );

    if (!response.ok) {
      throw new Error(
        `Página não encontrada: ${route}`
      );
    }

    const html = await response.text();

    const pageContent =
      document.getElementById("page-content");

    if (!pageContent) {
      throw new Error(
        "Elemento #page-content não encontrado."
      );
    }

    pageContent.innerHTML = `
      <div class="container-fluid pt-5">
        <div class="container content-conteiner pt-3">
          ${html}
        </div>
      </div>
    `;

    // ==============================
    // Browser history
    // ==============================

    if (updateHistory) {
      const newUrl = `/${route}`;

      if (replaceHistory) {
        history.replaceState(
          { route },
          "",
          newUrl
        );
      } else if (
        window.location.pathname !== newUrl
      ) {
        history.pushState(
          { route },
          "",
          newUrl
        );
      }
    }

    // ==============================
    // Page initialization
    // ==============================

    runPageScripts(route);
    updateNavbar(route);
  } catch (error) {
    console.error(
      "[ROUTER] Erro ao carregar página:",
      error
    );

    showNotFound();
  }
}

function showNotFound() {
  const pageContent =
    document.getElementById("page-content");

  if (!pageContent) {
    return;
  }

  pageContent.innerHTML = `
    <div class="container-fluid pt-5">
      <div class="container content-conteiner pt-3">
        <h1>404</h1>
        <p>Página não encontrada.</p>
      </div>
    </div>
  `;
}

// ==============================
// Browser back / forward
// ==============================

window.addEventListener(
  "popstate",
  async () => {
    const route = getCurrentRoute();

    await loadPage(route, {
      updateHistory: false,
    });
  }
);

// ==============================
// Initial route
// ==============================

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const route = getCurrentRoute();

    await loadPage(route, {
      updateHistory: true,
      replaceHistory: true,
    });
  }
);

window.loadPage = loadPage;