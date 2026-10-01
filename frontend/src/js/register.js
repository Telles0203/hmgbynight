function showRegisterAlert(type, message) {
  const alertBox =
    document.getElementById("registerAlert");

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

function hideRegisterAlert() {
  const alertBox =
    document.getElementById("registerAlert");

  if (!alertBox) {
    return;
  }

  alertBox.textContent = "";
  alertBox.className = "alert d-none";
}

function onRegisterPageLoaded() {
  hideRegisterAlert();
}

async function handleRegisterSubmit() {
  const name =
    document.getElementById("name")
      ?.value
      ?.trim();

  const email =
    document.getElementById("email")
      ?.value
      ?.trim();

  const password =
    document.getElementById("password")
      ?.value;

  const registerButton =
    document.getElementById("btnRegister");

  hideRegisterAlert();

  if (!name || !email || !password) {
    showRegisterAlert(
      "error",
      "Preencha todos os campos."
    );

    return;
  }

  try {
    if (registerButton) {
      registerButton.disabled = true;
      registerButton.textContent =
        "Criando...";
    }

    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok || !data?.ok) {
      showRegisterAlert(
        "error",
        data?.error ||
          "Não foi possível criar a conta."
      );

      return;
    }

    const sessionUser = {
      ...data.user,

      emailVerificationRetryAfter:
        Number(
          data?.emailVerification
            ?.retryAfter || 0
        ),
    };

    // Atualiza cache da sessão
    if (
      typeof window.setSessionUser ===
      "function"
    ) {
      window.setSessionUser(
        sessionUser
      );
    }

    // Atualiza navbar
    if (
      typeof window.updateNavbarAuth ===
      "function"
    ) {
      window.updateNavbarAuth(
        sessionUser
      );
    }

    if (
      data?.emailVerification?.sent ===
      false
    ) {
      showRegisterAlert(
        "success",
        "Conta criada com sucesso. O e-mail de verificação não pôde ser enviado agora."
      );
    } else {
      showRegisterAlert(
        "success",
        "Conta criada com sucesso."
      );
    }

    setTimeout(async () => {
      if (
        typeof window.loadPage ===
        "function"
      ) {
        await window.loadPage(
          "main"
        );
      } else {
        window.location.href =
          "/main";
      }
    }, 1500);
  } catch (error) {
    console.error(
      "[REGISTER] Erro ao criar conta:",
      error
    );

    showRegisterAlert(
      "error",
      "Erro de conexão com o servidor."
    );
  } finally {
    if (registerButton) {
      registerButton.disabled = false;
      registerButton.textContent =
        "Criar conta";
    }
  }
}

document.addEventListener(
  "submit",
  async (event) => {
    if (
      !(
        event.target instanceof
        HTMLFormElement
      ) ||
      event.target.id !==
        "registerForm"
    ) {
      return;
    }

    event.preventDefault();

    await handleRegisterSubmit();
  }
);

window.onRegisterPageLoaded =
  onRegisterPageLoaded;