let mainStylesPromise = null;
let emailValidationModulePromise = null;
let characterModulesPromise = null;

// ==============================
// Main stylesheet
// ==============================

function loadMainStyles() {
  if (mainStylesPromise) {
    return mainStylesPromise;
  }

  mainStylesPromise =
    new Promise(
      (resolve, reject) => {
        const existingLink =
          document.getElementById(
            "mainStylesheet"
          );

        if (existingLink) {
          resolve();
          return;
        }

        const link =
          document.createElement(
            "link"
          );

        link.id =
          "mainStylesheet";

        link.rel =
          "stylesheet";

        link.href =
          "/src/css/main.css";

        link.addEventListener(
          "load",
          resolve,
          {
            once: true,
          }
        );

        link.addEventListener(
          "error",
          () => {
            reject(
              new Error(
                "Não foi possível carregar o estilo do Main."
              )
            );
          },
          {
            once: true,
          }
        );

        document.head.appendChild(
          link
        );
      }
    );

  return mainStylesPromise;
}

// ==============================
// Module loader
// ==============================

async function loadEmailValidationModule() {
  if (!emailValidationModulePromise) {
    emailValidationModulePromise =
      import(
        "/src/js/main/emailValidation.js"
      );
  }

  await emailValidationModulePromise;
}

async function loadCharacterModules() {
  if (!characterModulesPromise) {
    characterModulesPromise =
      Promise.all([
        import(
          "/src/js/main/character/characterOptions.js"
        ),

        import(
          "/src/js/main/character/characters.js"
        ),

        import(
          "/src/js/main/character/view/characterView.js"
        ),

        import(
          "/src/js/main/character/characterForm.js"
        ),
      ]);
  }

  await characterModulesPromise;
}

// ==============================
// Main
// ==============================

async function loadMainUser(
  forceRefresh = false
) {
  const greeting =
    document.getElementById(
      "mainGreeting"
    );

  const loading =
    document.getElementById(
      "loadingScreen"
    );

  const main =
    document.getElementById(
      "mainPage"
    );

  const verifiedMainContent =
    document.getElementById(
      "verifiedMainContent"
    );

  const emailValidationContainer =
    document.getElementById(
      "emailValidationContainer"
    );

  if (!main) {
    return;
  }

  if (verifiedMainContent) {
    verifiedMainContent.style.display =
      "none";
  }

  try {
    await loadMainStyles();

    if (
      typeof window.sessionMe !==
      "function"
    ) {
      throw new Error(
        "Gerenciador de sessão não disponível."
      );
    }

    const user =
      await window.sessionMe(
        forceRefresh
      );

    if (!user) {
      await redirectToLogin();
      return;
    }

    if (greeting) {
      greeting.textContent =
        user.name
          ? `Olá ${user.name}.`
          : "Olá.";
    }

    // ==============================
    // Email não validado
    // ==============================

    if (
      user.isEmailValid !== true
    ) {
      await loadEmailValidationModule();

      await showEmailValidation(
        user,
        emailValidationContainer
      );

      showMainPage(
        loading,
        main
      );

      return;
    }

    // ==============================
    // Email validado
    // ==============================

    if (
      emailValidationContainer
    ) {
      emailValidationContainer.innerHTML =
        "";
    }

    if (
      typeof window.clearEmailResendCountdown ===
      "function"
    ) {
      window.clearEmailResendCountdown();
    }

    if (verifiedMainContent) {
      verifiedMainContent.style.display =
        "block";
    }

    await loadCharacterModules();

    resetMainView();

    await initializeMainModules();

    showMainPage(
      loading,
      main
    );
  } catch (error) {
    console.error(
      "[MAIN] Erro ao carregar:",
      error
    );

    showMainError(
      emailValidationContainer
    );

    showMainPage(
      loading,
      main
    );
  }
}

// ==============================
// Initialize modules
// ==============================

async function initializeMainModules() {
  if (
    typeof window.setupCharacterFormHandlers ===
    "function"
  ) {
    window.setupCharacterFormHandlers();
  }

  if (
    typeof window.loadCharacterOptions ===
    "function"
  ) {
    await window.loadCharacterOptions();
  }

  if (
    typeof window.loadCharacters ===
    "function"
  ) {
    await window.loadCharacters();
  }
}

// ==============================
// Email validation
// ==============================

async function showEmailValidation(
  user,
  container
) {
  if (!container) {
    return;
  }

  const response =
    await fetch(
      "/src/pages/emailValidationModal.html",
      {
        cache: "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar a validação de e-mail."
    );
  }

  container.innerHTML =
    await response.text();

  const retryAfter =
    Number(
      user.emailVerificationRetryAfter ||
      0
    );

  if (
    typeof window.setupEmailValidationHandlers ===
    "function"
  ) {
    window.setupEmailValidationHandlers(
      retryAfter
    );
  }
}

// ==============================
// Reset view
// ==============================

function resetMainView() {
  const dashboard =
    document.getElementById(
      "mainDashboard"
    );

  const overview =
    document.getElementById(
      "characterPanelOverview"
    );

  const detail =
    document.getElementById(
      "characterPanelDetail"
    );

  dashboard?.classList.remove(
    "character-focus",
    "house-focus"
  );

  if (overview) {
    overview.classList.remove(
      "d-none",
      "is-leaving",
      "is-entering"
    );
  }

  if (detail) {
    detail.classList.add(
      "d-none"
    );

    detail.classList.remove(
      "is-visible"
    );
  }
}

// ==============================
// Helpers
// ==============================

function showMainPage(
  loading,
  main
) {
  if (loading) {
    loading.style.display =
      "none";
  }

  if (main) {
    main.style.display =
      "block";
  }
}

function showMainError(
  container
) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="alert alert-danger"
      role="alert"
    >
      Não foi possível carregar seus dados.
    </div>
  `;
}

async function redirectToLogin() {
  if (
    typeof window.loadPage ===
    "function"
  ) {
    await window.loadPage(
      "login",
      {
        checkAuth: false,
        replaceHistory: true,
      }
    );

    return;
  }

  window.location.href =
    "/login";
}

// ==============================
// Global
// ==============================

window.loadMainUser =
  loadMainUser;