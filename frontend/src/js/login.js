function showLoginAlert(message) {
  const alertElement =
    document.getElementById("loginAlert");

  if (!alertElement) {
    return;
  }

  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
  alertElement.classList.add(
    "alert",
    "alert-danger"
  );
}

function hideLoginAlert() {
  const alertElement =
    document.getElementById("loginAlert");

  if (!alertElement) {
    return;
  }

  alertElement.textContent = "";
  alertElement.classList.add("d-none");
}

function onLoginPageLoaded() {
  hideLoginAlert();
}

document.addEventListener(
  "submit",
  async (event) => {
    if (
      !(event.target instanceof HTMLFormElement) ||
      event.target.id !== "loginForm"
    ) {
      return;
    }

    event.preventDefault();

    hideLoginAlert();

    const email =
      document.getElementById("email")
        ?.value
        ?.trim();

    const password =
      document.getElementById("password")
        ?.value;

    const loginButton =
      document.getElementById("btnLogin");

    if (!email || !password) {
      showLoginAlert(
        "Informe o e-mail e a senha."
      );

      return;
    }

    try {
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = "Entrando...";
      }

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        showLoginAlert(
          data?.error || "Falha no login."
        );

        return;
      }

      if (typeof window.loadPage === "function") {
        await window.loadPage("main");
      } else {
        window.location.href = "/main";
      }
    } catch (error) {
      console.error(
        "[LOGIN] Erro ao realizar login:",
        error
      );

      showLoginAlert(
        "Erro de conexão ao tentar entrar."
      );
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = "Entrar";
      }
    }
  }
);

window.onLoginPageLoaded =
  onLoginPageLoaded;