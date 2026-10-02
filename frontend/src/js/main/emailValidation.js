let emailResendCountdownInterval = null;

// ==============================
// Resend countdown
// ==============================

function clearEmailResendCountdown() {
  if (!emailResendCountdownInterval) {
    return;
  }

  clearInterval(
    emailResendCountdownInterval
  );

  emailResendCountdownInterval = null;
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

          button.disabled = false;

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
// Validation handlers
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
    validateButton.dataset.bound ===
    "true"
  ) {
    return;
  }

  validateButton.dataset.bound =
    "true";

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
        validateButton.disabled = true;

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

        if (
          typeof window.loadMainUser ===
          "function"
        ) {
          await window.loadMainUser(
            true
          );
        }
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
        validateButton.disabled = false;

        validateButton.textContent =
          "Validar e-mail";
      }
    }
  );

  if (!resendButton) {
    return;
  }

  if (
    resendButton.dataset.bound ===
    "true"
  ) {
    return;
  }

  resendButton.dataset.bound =
    "true";

  resendButton.addEventListener(
    "click",
    async () => {
      try {
        resendButton.disabled = true;

        resendButton.textContent =
          "Enviando...";

        const response =
          await fetch(
            "/api/auth/email/send-token",
            {
              method: "POST",
              credentials: "include",
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

          if (data?.retryAfter) {
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

        resendButton.disabled = false;

        resendButton.textContent =
          "Enviar novo token";
      }
    }
  );
}

// ==============================
// Alert
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

window.clearEmailResendCountdown =
  clearEmailResendCountdown;

window.startEmailResendCountdown =
  startEmailResendCountdown;

window.setupEmailValidationHandlers =
  setupEmailValidationHandlers;

window.showEmailValidationAlert =
  showEmailValidationAlert;