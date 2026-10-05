function updateNavbarAuth(user) {
  const guestElements =
    document.querySelectorAll(
      '#navbar [data-auth="guest"]'
    );

  const userElements =
    document.querySelectorAll(
      '#navbar [data-auth="user"]'
    );

  if (user) {
    guestElements.forEach((element) => {
      element.classList.add("d-none");
    });

    userElements.forEach((element) => {
      element.classList.remove("d-none");
    });

    return;
  }

  guestElements.forEach((element) => {
    element.classList.remove("d-none");
  });

  userElements.forEach((element) => {
    element.classList.add("d-none");
  });
}


function markCurrentNavbarRoute() {
  const currentRoute =
    window.location.pathname
      .replace(/^\/+|\/+$/g, "") ||
    "home";


  document
    .querySelectorAll(
      "#navbar a.nav-link[data-route]"
    )
    .forEach((link) => {
      const isCurrentRoute =
        link.dataset.route ===
        currentRoute;


      link.classList.toggle(
        "active-route",
        isCurrentRoute
      );


      if (isCurrentRoute) {
        link.setAttribute(
          "aria-current",
          "page"
        );

        return;
      }


      link.removeAttribute(
        "aria-current"
      );
    });
}


async function refreshNavbarAuth(
  forceRefresh = false
) {
  let user = null;

  if (
    typeof window.sessionMe ===
    "function"
  ) {
    user = await window.sessionMe(
      forceRefresh
    );
  }

  updateNavbarAuth(user);
  markCurrentNavbarRoute();

  return user;
}


async function loadNavbar() {
  try {
    const response = await fetch(
      "/src/components/navbar.html"
    );

    if (!response.ok) {
      throw new Error(
        "Não foi possível carregar a navbar."
      );
    }

    const html =
      await response.text();

    const navbar =
      document.getElementById(
        "navbar"
      );

    if (!navbar) {
      return;
    }

    navbar.innerHTML = html;

    await refreshNavbarAuth();

  } catch (error) {
    console.error(
      "[NAVBAR] Erro ao carregar navbar:",
      error
    );
  }
}


loadNavbar();


window.refreshNavbarAuth =
  refreshNavbarAuth;

window.updateNavbarAuth =
  updateNavbarAuth;