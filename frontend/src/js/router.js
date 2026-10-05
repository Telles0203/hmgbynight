function getCurrentRoute() {
  const route =
    window.location.pathname
      .replace(/^\/+|\/+$/g, "")
      .trim();

  return route || "home";
}


function isValidRoute(route) {
  return /^[a-zA-Z0-9_-]+$/.test(route);
}


function updateNavbarRoute(route) {
  document
    .querySelectorAll(
      "#navbar a.nav-link[data-route]"
    )
    .forEach((link) => {
      const linkRoute =
        link.dataset.route;

      const listItem =
        link.closest("li");

      if (!listItem) {
        return;
      }

      listItem.classList.toggle(
        "route-hidden",
        linkRoute === route
      );
    });
}


async function runPageScripts(route) {
  if (
    route === "main" &&
    typeof window.loadMainUser ===
      "function"
  ) {
    await window.loadMainUser();
  }

  if (
    route === "account" &&
    typeof window.onAccountPageLoaded ===
      "function"
  ) {
    await window.onAccountPageLoaded();
  }

  if (
    route === "login" &&
    typeof window.onLoginPageLoaded ===
      "function"
  ) {
    window.onLoginPageLoaded();
  }

  if (
    route === "register" &&
    typeof window.onRegisterPageLoaded ===
      "function"
  ) {
    window.onRegisterPageLoaded();
  }

  if (
    route === "forgot-password" &&
    typeof window.onForgotPasswordPageLoaded ===
      "function"
  ) {
    window.onForgotPasswordPageLoaded();
  }

  if (
    route === "reset-password" &&
    typeof window.onResetPasswordPageLoaded ===
      "function"
  ) {
    window.onResetPasswordPageLoaded();
  }
}


async function checkRouteAccess(route) {
  const authRoutes = [
    "main",
    "account",
    "login",
    "register",
  ];

  if (!authRoutes.includes(route)) {
    return {
      allowed: true,
      redirect: null,
      user: null,
    };
  }

  if (
    typeof window.requireAuth !==
    "function"
  ) {
    console.error(
      "[ROUTER] requireAuth não está disponível."
    );

    return {
      allowed:
        route !== "main" &&
        route !== "account",

      redirect:
        route === "main" ||
        route === "account"
          ? "login"
          : null,

      user: null,
    };
  }

  return window.requireAuth(route);
}


function showNotFound() {
  const pageContent =
    document.getElementById(
      "page-content"
    );

  if (!pageContent) {
    return;
  }

  pageContent.innerHTML = `
    <div class="container-fluid pt-5">
      <div class="container content-conteiner pt-3">
        <div class="text-center py-5">
          <h1 class="text-light">
            Página não encontrada
          </h1>

          <p class="text-secondary">
            A página solicitada não existe.
          </p>

          <button
            type="button"
            class="btn btn-danger"
            data-route="home"
          >
            Ir para Home
          </button>
        </div>
      </div>
    </div>
  `;
}


async function loadPage(
  route,
  options = {}
) {
  const {
    updateHistory = true,
    replaceHistory = false,
    checkAuth = true,
    preserveQuery = false,
  } = options;

  if (!isValidRoute(route)) {
    showNotFound();
    return;
  }

  try {
    if (checkAuth) {
      const access =
        await checkRouteAccess(route);

      if (
        !access.allowed &&
        access.redirect
      ) {
        return loadPage(
          access.redirect,
          {
            updateHistory: true,
            replaceHistory: true,
            checkAuth: false,
          }
        );
      }
    }

    const response = await fetch(
      `/src/pages/${route}.html`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Página não encontrada: ${route}`
      );
    }

    const html =
      await response.text();

    const pageContent =
      document.getElementById(
        "page-content"
      );

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

    if (updateHistory) {
      let newUrl = `/${route}`;

      if (
        preserveQuery &&
        window.location.search
      ) {
        newUrl +=
          window.location.search;
      }

      if (replaceHistory) {
        history.replaceState(
          { route },
          "",
          newUrl
        );

      } else if (
        window.location.pathname !==
          `/${route}` ||
        (
          preserveQuery &&
          window.location.search
        )
      ) {
        history.pushState(
          { route },
          "",
          newUrl
        );
      }
    }

    updateNavbarRoute(route);

    await runPageScripts(route);

  } catch (error) {
    console.error(
      "[ROUTER] Erro ao carregar página:",
      error
    );

    showNotFound();
  }
}


document.addEventListener(
  "click",
  async (event) => {
    const routeElement =
      event.target.closest(
        "[data-route]"
      );

    if (routeElement) {
      const route =
        routeElement.dataset.route;

      if (route) {
        event.preventDefault();

        await loadPage(route);
      }

      return;
    }


    const actionElement =
      event.target.closest(
        '[data-action="logout"]'
      );

    if (!actionElement) {
      return;
    }

    event.preventDefault();

    if (
      typeof window.logoutUser ===
      "function"
    ) {
      await window.logoutUser();
    }
  }
);


window.addEventListener(
  "popstate",
  async () => {
    const route =
      getCurrentRoute();

    await loadPage(route, {
      updateHistory: false,
    });
  }
);


document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const route =
      getCurrentRoute();

    await loadPage(route, {
      updateHistory: true,
      replaceHistory: true,
      preserveQuery:
        route === "reset-password",
    });
  }
);


window.loadPage =
  loadPage;