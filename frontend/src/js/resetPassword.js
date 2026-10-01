function showResetPasswordAlert(
  message,
  type = "danger"
) {
  const alertBox =
    document.getElementById(
      "resetPasswordAlert"
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

function hideResetPasswordAlert() {
  const alertBox =
    document.getElementById(
      "resetPasswordAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.textContent = "";
  alertBox.className = "alert d-none";
}

function getResetPasswordToken() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("token");
}

function onResetPasswordPageLoaded() {
  hideResetPasswordAlert();

  const token =
    getResetPasswordToken();

  if (!token) {
    showResetPasswordAlert(
      "Link de recuperação inválido.",
      "danger"
    );
  }
}

document.addEventListener(
  "submit",
  async (event) => {
    if (
      !(event.target instanceof HTMLFormElement) ||
      event.target.id !==
        "resetPasswordForm"
    ) {
      return;
    }

    event.preventDefault();

    hideResetPasswordAlert();

    const token =
      getResetPasswordToken();

    const password =
      document.getElementById(
        "newPassword"
      )?.value;

    const confirmPassword =
      document.getElementById(
        "confirmPassword"
      )?.value;

    const button =
      document.getElementById(
        "resetPasswordButton"
      );

    if (!token) {
      showResetPasswordAlert(
        "Link de recuperação inválido.",
        "danger"
      );

      return;
    }

    if (!password || !confirmPassword) {
      showResetPasswordAlert(
        "Preencha os dois campos de senha.",
        "danger"
      );

      return;
    }

    if (password.length < 6) {
      showResetPasswordAlert(
        "A senha deve possuir pelo menos 6 caracteres.",
        "danger"
      );

      return;
    }

    if (password !== confirmPassword) {
      showResetPasswordAlert(
        "As senhas não coincidem.",
        "danger"
      );

      return;
    }

    let passwordChanged = false;

    try {
      if (button) {
        button.disabled = true;
        button.textContent =
          "Alterando...";
      }

      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data?.ok) {
        showResetPasswordAlert(
          data?.error ||
            "Não foi possível alterar a senha.",
          "danger"
        );

        return;
      }

      passwordChanged = true;

      showResetPasswordAlert(
        "Senha alterada com sucesso. Você já pode entrar com a nova senha.",
        "success"
      );

      const newPasswordInput =
        document.getElementById(
          "newPassword"
        );

      const confirmPasswordInput =
        document.getElementById(
          "confirmPassword"
        );

      if (newPasswordInput) {
        newPasswordInput.value = "";
        newPasswordInput.disabled = true;
      }

      if (confirmPasswordInput) {
        confirmPasswordInput.value = "";
        confirmPasswordInput.disabled = true;
      }

      if (button) {
        button.disabled = false;
        button.type = "button";
        button.textContent =
          "Ir para login";

        button.onclick = async () => {
          if (
            typeof window.loadPage ===
            "function"
          ) {
            await window.loadPage(
              "login"
            );
          } else {
            window.location.href =
              "/login";
          }
        };
      }
    } catch (error) {
      console.error(
        "[RESET PASSWORD] Erro:",
        error
      );

      showResetPasswordAlert(
        "Erro de conexão com o servidor.",
        "danger"
      );
    } finally {
      if (
        button &&
        !passwordChanged
      ) {
        button.disabled = false;
        button.textContent =
          "Alterar senha";
      }
    }
  }
);

window.onResetPasswordPageLoaded =
  onResetPasswordPageLoaded;