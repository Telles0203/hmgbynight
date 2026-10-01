function showForgotPasswordAlert(
  message,
  type = "danger"
) {
  const alertBox =
    document.getElementById(
      "forgotPasswordAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.className = "alert";

  alertBox.classList.add(
    type === "success"
      ? "alert-success"
      : "alert-danger"
  );

  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function hideForgotPasswordAlert() {
  const alertBox =
    document.getElementById(
      "forgotPasswordAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.textContent = "";
  alertBox.className = "alert d-none";
}

function onForgotPasswordPageLoaded() {
  hideForgotPasswordAlert();
}

document.addEventListener(
  "submit",
  async (event) => {
    if (
      !(event.target instanceof HTMLFormElement) ||
      event.target.id !==
        "forgotPasswordForm"
    ) {
      return;
    }

    event.preventDefault();

    hideForgotPasswordAlert();

    const email =
      document.getElementById(
        "forgotPasswordEmail"
      )
        ?.value
        ?.trim();

    const button =
      document.getElementById(
        "forgotPasswordButton"
      );

    if (!email) {
      showForgotPasswordAlert(
        "Informe o e-mail.",
        "danger"
      );

      return;
    }

    try {
      if (button) {
        button.disabled = true;
        button.textContent = "Enviando...";
      }

      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data?.ok) {
        showForgotPasswordAlert(
          data?.error ||
            "Não foi possível processar a solicitação.",
          "danger"
        );

        return;
      }

      showForgotPasswordAlert(
        data?.message ||
          "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
        "success"
      );

      const emailInput =
        document.getElementById(
          "forgotPasswordEmail"
        );

      if (emailInput) {
        emailInput.value = "";
      }
    } catch (error) {
      console.error(
        "[FORGOT PASSWORD] Erro:",
        error
      );

      showForgotPasswordAlert(
        "Erro de conexão com o servidor.",
        "danger"
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Enviar link";
      }
    }
  }
);

window.onForgotPasswordPageLoaded =
  onForgotPasswordPageLoaded;