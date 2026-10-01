async function loadMainUser(forceRefresh = false) {
  const greeting =
    document.getElementById("mainGreeting");

  const loading =
    document.getElementById("loadingScreen");

  const main =
    document.getElementById("mainPage");

  const emailValidationContainer =
    document.getElementById(
      "emailValidationContainer"
    );

  if (!greeting) {
    return;
  }

  greeting.textContent = "";

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

    // ==============================
    // Email validation
    // ==============================

    if (user.isEmailValid === false) {
      if (
        emailValidationContainer
      ) {
        const modalResponse =
          await fetch(
            "/src/pages/emailValidationModal.html"
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

        setupEmailValidationHandlers();
      }
    } else if (
      emailValidationContainer
    ) {
      emailValidationContainer.innerHTML =
        "";
    }

    // ==============================
    // Greeting
    // ==============================

    greeting.textContent =
      user.name
        ? `Olá ${user.name}.`
        : "Olá.";

    // ==============================
    // Show main page
    // ==============================

    if (loading) {
      loading.style.display = "none";
    }

    if (main) {
      main.style.display = "block";
    }
  } catch (error) {
    console.error(
      "[MAIN] Erro ao carregar usuário:",
      error
    );

    if (loading) {
      loading.style.display = "none";
    }

    greeting.textContent =
      "Não foi possível carregar seus dados.";

    if (main) {
      main.style.display = "block";
    }
  }
}

function setupEmailValidationHandlers() {
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

  // ==============================
  // Validate token
  // ==============================

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

        // Atualiza os dados da sessão
        // porque isEmailValid mudou.
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

  // ==============================
  // Resend token
  // ==============================

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
        } catch (error) {
          console.error(
            "[EMAIL VALIDATION] Erro ao reenviar:",
            error
          );

          showEmailValidationAlert(
            "Falha ao enviar um novo código.",
            "danger"
          );
        } finally {
          resendButton.disabled =
            false;

          resendButton.textContent =
            "Enviar novo token";
        }
      }
    );
  }
}

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

    alert.role = "alert";

    warningBox
      .querySelector(".card-body")
      ?.appendChild(alert);
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

  alert.textContent = message;
}

window.loadMainUser =
  loadMainUser;