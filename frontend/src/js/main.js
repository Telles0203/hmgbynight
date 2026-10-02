let emailResendCountdownInterval = null;
let characterOptionsCache = null;
let charactersCache = [];

// ==============================
// Main user
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

  if (!greeting) {
    return;
  }

  greeting.textContent = "";

  if (verifiedMainContent) {
    verifiedMainContent.style.display =
      "none";
  }

  try {
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
      } else {
        window.location.href =
          "/login";
      }

      return;
    }

    greeting.textContent =
      user.name
        ? `Olá ${user.name}.`
        : "Olá.";

    // ==============================
    // Email validation
    // ==============================

    if (user.isEmailValid !== true) {
      if (verifiedMainContent) {
        verifiedMainContent.style.display =
          "none";
      }

      if (
        emailValidationContainer
      ) {
        const modalResponse =
          await fetch(
            "/src/pages/emailValidationModal.html",
            {
              cache: "no-store",
            }
          );

        if (!modalResponse.ok) {
          throw new Error(
            "Não foi possível carregar a validação de e-mail."
          );
        }

        const modalHtml =
          await modalResponse.text();

        emailValidationContainer.innerHTML =
          modalHtml;

        const initialRetryAfter =
          Number(
            user.emailVerificationRetryAfter ||
            0
          );

        setupEmailValidationHandlers(
          initialRetryAfter
        );
      }
    } else {
      if (
        emailValidationContainer
      ) {
        emailValidationContainer.innerHTML =
          "";
      }

      clearEmailResendCountdown();

      if (verifiedMainContent) {
        verifiedMainContent.style.display =
          "block";
      }

      setupCharacterFormHandlers();

      await loadCharacterOptions();
      await loadCharacters();
    }

    if (loading) {
      loading.style.display =
        "none";
    }

    if (main) {
      main.style.display =
        "block";
    }
  } catch (error) {
    console.error(
      "[MAIN] Erro ao carregar usuário:",
      error
    );

    if (loading) {
      loading.style.display =
        "none";
    }

    if (
      emailValidationContainer
    ) {
      emailValidationContainer.innerHTML = `
        <div class="alert alert-danger">
          Não foi possível carregar seus dados.
        </div>
      `;
    }

    if (main) {
      main.style.display =
        "block";
    }
  }
}

// ==============================
// Character options
// ==============================

async function loadCharacterOptions() {
  try {
    const response =
      await fetch(
        "/api/characters/options",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
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
          "Não foi possível carregar as opções do personagem."
      );
    }

    characterOptionsCache = {
      sects: Array.isArray(
        data.sects
      )
        ? data.sects
        : [],

      clans: Array.isArray(
        data.clans
      )
        ? data.clans
        : [],
    };

    populateCharacterOptions();
  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
      error
    );

    showCharacterAlert(
      "Não foi possível carregar as opções de criação."
    );
  }
}

function populateCharacterOptions() {
  const sectSelect =
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

  if (
    !sectSelect ||
    !otherSectSelect ||
    !clanSelect ||
    !characterOptionsCache
  ) {
    return;
  }

  const mainSectValues = [
    "camarilla",
    "anarch",
    "sabbat",
  ];

  // ==============================
  // Main sects
  // ==============================

  sectSelect.innerHTML = "";

  const emptySectOption =
    document.createElement(
      "option"
    );

  emptySectOption.value = "";

  emptySectOption.textContent =
    "Selecione a seita";

  sectSelect.appendChild(
    emptySectOption
  );

  mainSectValues.forEach(
    (sectValue) => {
      const sect =
        characterOptionsCache
          .sects
          .find(
            (option) =>
              option.value ===
              sectValue
          );

      if (!sect) {
        return;
      }

      const option =
        document.createElement(
          "option"
        );

      option.value =
        sect.value;

      option.textContent =
        sect.label;

      sectSelect.appendChild(
        option
      );
    }
  );

  const otherOption =
    document.createElement(
      "option"
    );

  otherOption.value =
    "other";

  otherOption.textContent =
    "Outras opções";

  sectSelect.appendChild(
    otherOption
  );

  // ==============================
  // Other sects
  // ==============================

  otherSectSelect.innerHTML = "";

  const emptyOtherSectOption =
    document.createElement(
      "option"
    );

  emptyOtherSectOption.value = "";

  emptyOtherSectOption.textContent =
    "Selecione uma opção";

  otherSectSelect.appendChild(
    emptyOtherSectOption
  );

  characterOptionsCache.sects
    .filter(
      (sect) =>
        !mainSectValues.includes(
          sect.value
        )
    )
    .forEach(
      (sect) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          sect.value;

        option.textContent =
          sect.label;

        otherSectSelect.appendChild(
          option
        );
      }
    );

  // ==============================
  // Clans
  // ==============================

  clanSelect.innerHTML = "";

  const emptyClanOption =
    document.createElement(
      "option"
    );

  emptyClanOption.value = "";

  emptyClanOption.textContent =
    "Selecione o clã";

  clanSelect.appendChild(
    emptyClanOption
  );

  characterOptionsCache.clans.forEach(
    (clan) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        clan.value;

      option.textContent =
        clan.label;

      clanSelect.appendChild(
        option
      );
    }
  );

  updateOtherSectVisibility();
}

function getSectLabel(
  sectValue
) {
  if (!characterOptionsCache) {
    return sectValue || "";
  }

  const sect =
    characterOptionsCache
      .sects
      .find(
        (option) =>
          option.value ===
          sectValue
      );

  return (
    sect?.label ||
    sectValue ||
    ""
  );
}

// ==============================
// Sect selection
// ==============================

function updateOtherSectVisibility() {
  const sectSelect =
    document.getElementById(
      "characterSect"
    );

  const otherSectSelect =
    document.getElementById(
      "characterOtherSect"
    );

  const otherSectContainer =
    document.getElementById(
      "otherSectContainer"
    );

  if (
    !sectSelect ||
    !otherSectSelect ||
    !otherSectContainer
  ) {
    return;
  }

  const showOther =
    sectSelect.value === "other";

  otherSectContainer
    .classList
    .toggle(
      "d-none",
      !showOther
    );

  otherSectSelect.required =
    showOther;

  otherSectSelect.disabled =
    !showOther;

  if (!showOther) {
    otherSectSelect.value = "";
  }
}

function getSelectedSect() {
  const sectSelect =
    document.getElementById(
      "characterSect"
    );

  const otherSectSelect =
    document.getElementById(
      "characterOtherSect"
    );

  if (!sectSelect) {
    return "";
  }

  if (
    sectSelect.value === "other"
  ) {
    return (
      otherSectSelect?.value ||
      ""
    );
  }

  return sectSelect.value;
}

// ==============================
// Character list
// ==============================

async function loadCharacters() {
  try {
    const response =
      await fetch(
        "/api/characters",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
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
          "Não foi possível carregar os personagens."
      );
    }

    renderCharacters(
      Array.isArray(
        data.characters
      )
        ? data.characters
        : []
    );
  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar personagens:",
      error
    );

    renderCharacterError();
  }
}

function renderCharacters(
  characters
) {
  charactersCache =
    characters;

  const createButton =
    document.getElementById(
      "createCharacterButton"
    );

  if (!createButton) {
    return;
  }

  const container =
    createButton.closest(
      ".mt-auto"
    );

  if (!container) {
    return;
  }

  if (characters.length === 0) {
    container.innerHTML = `
      <p class="text-secondary small">
        Você ainda não possui personagens cadastrados.
      </p>

      <button
        id="createCharacterButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createCharacterModal"
      >
        Criar meu primeiro personagem
      </button>
    `;

    return;
  }

  const characterCards =
    characters
      .map(
        (character) => {
          const characterId =
            escapeHtml(
              character.id
            );

          const characterName =
            escapeHtml(
              character.name
            );

          const clanName =
            escapeHtml(
              character.clanDisplayName ||
              character.clan ||
              ""
            );

          const sectName =
            escapeHtml(
              getSectLabel(
                character.sect
              )
            );

          const houseText =
            character.motherHouse
              ? "Vinculado a uma House"
              : "Sem House";

          return `
            <div
              class="border border-secondary rounded p-3 mb-2"
            >
              <div
                class="d-flex justify-content-between align-items-center gap-3"
              >

                <div>

                  <h3
                    class="h6 text-light mb-1"
                  >
                    ${characterName}
                  </h3>

                  ${
                    clanName
                      ? `
                        <div
                          class="text-secondary small"
                        >
                          ${clanName}
                        </div>
                      `
                      : ""
                  }

                  <div
                    class="text-secondary small"
                  >
                    ${
                      sectName
                        ? `${sectName} · `
                        : ""
                    }${houseText}
                  </div>

                </div>

                <button
                  type="button"
                  class="btn btn-outline-light btn-sm"
                  data-character-id="${characterId}"
                  onclick="openCharacterView(this.dataset.characterId)"
                >
                  Abrir →
                </button>

              </div>
            </div>
          `;
        }
      )
      .join("");

  container.innerHTML = `
    <div
      id="characterList"
      class="mb-3"
    >
      ${characterCards}
    </div>

    <button
      id="createCharacterButton"
      type="button"
      class="btn btn-blood w-100"
      data-bs-toggle="modal"
      data-bs-target="#createCharacterModal"
    >
      + Criar personagem
    </button>
  `;
}

function renderCharacterError() {
  charactersCache = [];

  const createButton =
    document.getElementById(
      "createCharacterButton"
    );

  if (!createButton) {
    return;
  }

  const container =
    createButton.closest(
      ".mt-auto"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="alert alert-danger mb-3"
      role="alert"
    >
      Não foi possível carregar seus personagens.
    </div>

    <button
      id="createCharacterButton"
      type="button"
      class="btn btn-blood w-100"
      data-bs-toggle="modal"
      data-bs-target="#createCharacterModal"
    >
      + Criar personagem
    </button>
  `;
}

function escapeHtml(value) {
  const element =
    document.createElement(
      "div"
    );

  element.textContent =
    String(value || "");

  return element.innerHTML;
}

// ==============================
// Character view
// ==============================

function openCharacterView(
  characterId
) {
  const character =
    charactersCache.find(
      (item) =>
        String(item.id) ===
        String(characterId)
    );

  if (!character) {
    console.error(
      "[CHARACTER] Personagem não encontrado."
    );

    return;
  }

  const slider =
    document.getElementById(
      "mainSlider"
    );

  const nameElement =
    document.getElementById(
      "selectedCharacterName"
    );

  const metaElement =
    document.getElementById(
      "selectedCharacterMeta"
    );

  if (
    !slider ||
    !nameElement ||
    !metaElement
  ) {
    return;
  }

  nameElement.textContent =
    character.name;

  const clanName =
    character.clanDisplayName ||
    character.clan ||
    "";

  const sectName =
    getSectLabel(
      character.sect
    );

  metaElement.textContent =
    [
      clanName,
      sectName,
    ]
      .filter(Boolean)
      .join(" · ");

  slider.classList.add(
    "character-open"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function closeCharacterView() {
  const slider =
    document.getElementById(
      "mainSlider"
    );

  if (!slider) {
    return;
  }

  slider.classList.remove(
    "character-open"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==============================
// Character creation
// ==============================

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

  alert.textContent = "";

  alert.className =
    "alert d-none";
}

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

  if (sectSelect) {
    sectSelect.addEventListener(
      "change",
      () => {
        updateOtherSectVisibility();
      }
    );
  }

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
        nameInput?.value?.trim();

      const sect =
        getSelectedSect();

      const clan =
        clanSelect?.value ||
        "";

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

      if (!sect) {
        showCharacterAlert(
          "Selecione a seita do personagem."
        );

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
              method: "POST",

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

        showCharacterAlert(
          "Personagem criado com sucesso.",
          "success"
        );

        form.reset();

        updateOtherSectVisibility();

        await loadCharacters();

        setTimeout(
          () => {
            if (
              modalElement &&
              window.bootstrap
            ) {
              const modal =
                bootstrap.Modal
                  .getOrCreateInstance(
                    modalElement
                  );

              modal.hide();
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

  if (modalElement) {
    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        form.reset();

        hideCharacterAlert();

        updateOtherSectVisibility();
      }
    );
  }
}

// ==============================
// Resend countdown
// ==============================

function clearEmailResendCountdown() {
  if (
    emailResendCountdownInterval
  ) {
    clearInterval(
      emailResendCountdownInterval
    );

    emailResendCountdownInterval =
      null;
  }
}

function startEmailResendCountdown(
  button,
  seconds
) {
  clearEmailResendCountdown();

  let remainingSeconds =
    Math.max(
      0,
      Math.ceil(
        Number(seconds) || 0
      )
    );

  if (
    !button ||
    remainingSeconds <= 0
  ) {
    if (button) {
      button.disabled = false;

      button.textContent =
        "Enviar novo token";
    }

    return;
  }

  button.disabled = true;

  button.textContent =
    `Reenviar em ${remainingSeconds}s`;

  emailResendCountdownInterval =
    setInterval(
      () => {
        remainingSeconds -= 1;

        if (
          remainingSeconds <= 0
        ) {
          clearEmailResendCountdown();

          button.disabled =
            false;

          button.textContent =
            "Enviar novo token";

          return;
        }

        button.textContent =
          `Reenviar em ${remainingSeconds}s`;
      },
      1000
    );
}

// ==============================
// Email validation
// ==============================

function setupEmailValidationHandlers(
  initialRetryAfter = 0
) {
  const validateButton =
    document.getElementById(
      "validateEmailButton"
    );

  const resendButton =
    document.getElementById(
      "resendTokenButton"
    );

  const tokenInput =
    document.getElementById(
      "emailTokenInput"
    );

  if (
    !validateButton ||
    !tokenInput
  ) {
    return;
  }

  if (
    resendButton &&
    initialRetryAfter > 0
  ) {
    startEmailResendCountdown(
      resendButton,
      initialRetryAfter
    );
  }

  validateButton.addEventListener(
    "click",
    async () => {
      const token =
        tokenInput.value.trim();

      tokenInput.classList.remove(
        "border-danger",
        "border-success"
      );

      if (!token) {
        tokenInput.classList.add(
          "border-danger"
        );

        tokenInput.focus();

        showEmailValidationAlert(
          "Informe o código de validação.",
          "danger"
        );

        return;
      }

      try {
        validateButton.disabled =
          true;

        validateButton.textContent =
          "Validando...";

        const response =
          await fetch(
            "/api/auth/email/verify-email-token",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  token,
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
          tokenInput.classList.add(
            "border-danger"
          );

          tokenInput.focus();

          showEmailValidationAlert(
            data?.error ||
              "Código inválido ou expirado.",
            "danger"
          );

          return;
        }

        tokenInput.classList.add(
          "border-success"
        );

        showEmailValidationAlert(
          "E-mail validado com sucesso.",
          "success"
        );

        tokenInput.value = "";

        clearEmailResendCountdown();

        await loadMainUser(true);
      } catch (error) {
        console.error(
          "[EMAIL VALIDATION] Erro ao validar:",
          error
        );

        tokenInput.classList.add(
          "border-danger"
        );

        showEmailValidationAlert(
          "Falha ao validar o código.",
          "danger"
        );
      } finally {
        validateButton.disabled =
          false;

        validateButton.textContent =
          "Validar e-mail";
      }
    }
  );

  if (resendButton) {
    resendButton.addEventListener(
      "click",
      async () => {
        try {
          resendButton.disabled =
            true;

          resendButton.textContent =
            "Enviando...";

          const response =
            await fetch(
              "/api/auth/email/send-token",
              {
                method: "POST",

                credentials:
                  "include",
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
            showEmailValidationAlert(
              data?.error ||
                "Não foi possível enviar um novo código.",
              "danger"
            );

            if (
              data?.retryAfter
            ) {
              startEmailResendCountdown(
                resendButton,
                data.retryAfter
              );
            } else {
              resendButton.disabled =
                false;

              resendButton.textContent =
                "Enviar novo token";
            }

            return;
          }

          tokenInput.classList.remove(
            "border-danger",
            "border-success"
          );

          tokenInput.value = "";
          tokenInput.focus();

          showEmailValidationAlert(
            "Novo código enviado para seu e-mail.",
            "success"
          );

          startEmailResendCountdown(
            resendButton,
            data?.retryAfter || 60
          );
        } catch (error) {
          console.error(
            "[EMAIL VALIDATION] Erro ao reenviar:",
            error
          );

          showEmailValidationAlert(
            "Falha ao enviar um novo código.",
            "danger"
          );

          resendButton.disabled =
            false;

          resendButton.textContent =
            "Enviar novo token";
        }
      }
    );
  }
}

// ==============================
// Email validation alert
// ==============================

function showEmailValidationAlert(
  message,
  type = "danger"
) {
  const warningBox =
    document.getElementById(
      "emailValidationWarning"
    );

  if (!warningBox) {
    return;
  }

  let alert =
    document.getElementById(
      "emailValidationAlert"
    );

  if (!alert) {
    alert =
      document.createElement(
        "div"
      );

    alert.id =
      "emailValidationAlert";

    alert.className =
      "alert mt-3";

    alert.role =
      "alert";

    warningBox
      .querySelector(
        ".card-body"
      )
      ?.appendChild(
        alert
      );
  }

  alert.classList.remove(
    "alert-danger",
    "alert-success"
  );

  alert.classList.add(
    type === "success"
      ? "alert-success"
      : "alert-danger"
  );

  alert.textContent =
    message;
}

// ==============================
// Globals
// ==============================

window.loadMainUser =
  loadMainUser;

window.openCharacterView =
  openCharacterView;

window.closeCharacterView =
  closeCharacterView;