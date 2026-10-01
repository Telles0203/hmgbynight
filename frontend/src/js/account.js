let originalAccountName = "";

function showAccountAlert(
  message,
  type = "danger"
) {
  const alertBox =
    document.getElementById(
      "accountAlert"
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

function hideAccountAlert() {
  const alertBox =
    document.getElementById(
      "accountAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.textContent = "";
  alertBox.className =
    "alert d-none";
}

function showDeleteAccountAlert(
  message
) {
  const alertBox =
    document.getElementById(
      "deleteAccountAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.textContent = message;
  alertBox.classList.remove(
    "d-none"
  );
}

function hideDeleteAccountAlert() {
  const alertBox =
    document.getElementById(
      "deleteAccountAlert"
    );

  if (!alertBox) {
    return;
  }

  alertBox.textContent = "";
  alertBox.classList.add(
    "d-none"
  );
}

function updateAccountEmailStatus(
  isEmailValid
) {
  const status =
    document.getElementById(
      "accountEmailStatus"
    );

  if (!status) {
    return;
  }

  if (isEmailValid) {
    status.textContent =
      "Verificado";

    status.className =
      "badge bg-success";

    return;
  }

  status.textContent =
    "Não verificado";

  status.className =
    "badge bg-warning text-dark";
}

function setNameEditMode(
  editing
) {
  const nameInput =
    document.getElementById(
      "accountName"
    );

  const editButton =
    document.getElementById(
      "editNameButton"
    );

  const saveButton =
    document.getElementById(
      "saveNameButton"
    );

  const cancelButton =
    document.getElementById(
      "cancelNameButton"
    );

  if (!nameInput) {
    return;
  }

  nameInput.disabled = !editing;

  editButton?.classList.toggle(
    "d-none",
    editing
  );

  saveButton?.classList.toggle(
    "d-none",
    !editing
  );

  cancelButton?.classList.toggle(
    "d-none",
    !editing
  );

  if (editing) {
    nameInput.focus();
    nameInput.select();
  }
}

function setPasswordEditMode(
  editing
) {
  const changeButton =
    document.getElementById(
      "changePasswordButton"
    );

  const passwordForm =
    document.getElementById(
      "changePasswordForm"
    );

  if (!passwordForm) {
    return;
  }

  passwordForm.classList.toggle(
    "d-none",
    !editing
  );

  changeButton?.classList.toggle(
    "d-none",
    editing
  );

  if (editing) {
    document
      .getElementById(
        "currentPassword"
      )
      ?.focus();
  }
}

function clearPasswordFields() {
  const currentPassword =
    document.getElementById(
      "currentPassword"
    );

  const newPassword =
    document.getElementById(
      "newAccountPassword"
    );

  const confirmPassword =
    document.getElementById(
      "confirmAccountPassword"
    );

  if (currentPassword) {
    currentPassword.value = "";
  }

  if (newPassword) {
    newPassword.value = "";
  }

  if (confirmPassword) {
    confirmPassword.value = "";
  }
}

function clearDeleteAccountFields() {
  const passwordInput =
    document.getElementById(
      "deleteAccountPassword"
    );

  if (passwordInput) {
    passwordInput.value = "";
  }

  hideDeleteAccountAlert();
}

async function loadAccountUser() {
  try {
    if (
      typeof window.sessionMe !==
      "function"
    ) {
      throw new Error(
        "Controle de sessão indisponível."
      );
    }

    const user =
      await window.sessionMe();

    if (!user) {
      await window.loadPage(
        "login"
      );

      return;
    }

    const nameInput =
      document.getElementById(
        "accountName"
      );

    const emailInput =
      document.getElementById(
        "accountEmail"
      );

    originalAccountName =
      user.name || "";

    if (nameInput) {
      nameInput.value =
        originalAccountName;
    }

    if (emailInput) {
      emailInput.value =
        user.email || "";
    }

    updateAccountEmailStatus(
      user.isEmailValid === true
    );
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao carregar conta:",
      error
    );
  }
}

async function saveAccountName() {
  hideAccountAlert();

  const nameInput =
    document.getElementById(
      "accountName"
    );

  const saveButton =
    document.getElementById(
      "saveNameButton"
    );

  if (!nameInput) {
    return;
  }

  const name =
    nameInput.value.trim();

  if (
    name.length < 2 ||
    name.length > 40
  ) {
    showAccountAlert(
      "O nome deve possuir entre 2 e 40 caracteres."
    );

    return;
  }

  try {
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent =
        "Salvando...";
    }

    const response = await fetch(
      "/api/auth/account/name",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (
      !response.ok ||
      !data?.ok
    ) {
      showAccountAlert(
        data?.error ||
          "Não foi possível alterar o nome."
      );

      return;
    }

    originalAccountName =
      name;

    if (
      typeof window.setSessionUser ===
        "function" &&
      data.user
    ) {
      window.setSessionUser(
        data.user
      );
    }

    setNameEditMode(false);

    showAccountAlert(
      "Nome alterado com sucesso.",
      "success"
    );
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao alterar nome:",
      error
    );

    showAccountAlert(
      "Erro de conexão com o servidor."
    );
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent =
        "Salvar";
    }
  }
}

async function saveAccountPassword() {
  hideAccountAlert();

  const currentPasswordInput =
    document.getElementById(
      "currentPassword"
    );

  const newPasswordInput =
    document.getElementById(
      "newAccountPassword"
    );

  const confirmPasswordInput =
    document.getElementById(
      "confirmAccountPassword"
    );

  const saveButton =
    document.getElementById(
      "savePasswordButton"
    );

  const currentPassword =
    currentPasswordInput?.value || "";

  const newPassword =
    newPasswordInput?.value || "";

  const confirmPassword =
    confirmPasswordInput?.value || "";

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    showAccountAlert(
      "Preencha todos os campos de senha."
    );

    return;
  }

  if (
    newPassword.length < 6
  ) {
    showAccountAlert(
      "A nova senha deve possuir pelo menos 6 caracteres."
    );

    return;
  }

  if (
    newPassword !==
    confirmPassword
  ) {
    showAccountAlert(
      "As novas senhas não coincidem."
    );

    return;
  }

  try {
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent =
        "Salvando...";
    }

    const response = await fetch(
      "/api/auth/account/password",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (
      !response.ok ||
      !data?.ok
    ) {
      showAccountAlert(
        data?.error ||
          "Não foi possível alterar a senha."
      );

      return;
    }

    clearPasswordFields();

    if (
      typeof window.clearSessionUser ===
      "function"
    ) {
      window.clearSessionUser();
    }

    if (
      typeof window.updateNavbarAuth ===
      "function"
    ) {
      window.updateNavbarAuth(
        null
      );
    }

    await window.loadPage(
      "login",
      {
        updateHistory: true,
        replaceHistory: true,
        checkAuth: false,
      }
    );
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao alterar senha:",
      error
    );

    showAccountAlert(
      "Erro de conexão com o servidor."
    );
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent =
        "Salvar nova senha";
    }
  }
}

async function deleteAccount() {
  hideDeleteAccountAlert();

  const passwordInput =
    document.getElementById(
      "deleteAccountPassword"
    );

  const deleteButton =
    document.getElementById(
      "confirmDeleteAccountButton"
    );

  const currentPassword =
    passwordInput?.value || "";

  if (!currentPassword) {
    showDeleteAccountAlert(
      "Informe sua senha atual."
    );

    return;
  }

  try {
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.textContent =
        "Excluindo...";
    }

    const response = await fetch(
      "/api/auth/account",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          currentPassword,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (
      !response.ok ||
      !data?.ok
    ) {
      showDeleteAccountAlert(
        data?.error ||
          "Não foi possível excluir a conta."
      );

      return;
    }

    if (
      typeof window.clearSessionUser ===
      "function"
    ) {
      window.clearSessionUser();
    }

    if (
      typeof window.updateNavbarAuth ===
      "function"
    ) {
      window.updateNavbarAuth(
        null
      );
    }

    const modalElement =
      document.getElementById(
        "deleteAccountModal"
      );

    if (
      modalElement &&
      window.bootstrap
    ) {
      const modal =
        bootstrap.Modal.getOrCreateInstance(
          modalElement
        );

      modalElement.addEventListener(
        "hidden.bs.modal",
        async () => {
          await window.loadPage(
            "home",
            {
              updateHistory: true,
              replaceHistory: true,
              checkAuth: false,
            }
          );
        },
        {
          once: true,
        }
      );

      modal.hide();

      return;
    }

    await window.loadPage(
      "home",
      {
        updateHistory: true,
        replaceHistory: true,
        checkAuth: false,
      }
    );
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao excluir conta:",
      error
    );

    showDeleteAccountAlert(
      "Erro de conexão com o servidor."
    );
  } finally {
    if (deleteButton) {
      deleteButton.disabled = false;
      deleteButton.textContent =
        "Excluir definitivamente";
    }
  }
}

async function onAccountPageLoaded() {
  await loadAccountUser();

  const editNameButton =
    document.getElementById(
      "editNameButton"
    );

  const saveNameButton =
    document.getElementById(
      "saveNameButton"
    );

  const cancelNameButton =
    document.getElementById(
      "cancelNameButton"
    );

  const nameInput =
    document.getElementById(
      "accountName"
    );

  const changePasswordButton =
    document.getElementById(
      "changePasswordButton"
    );

  const savePasswordButton =
    document.getElementById(
      "savePasswordButton"
    );

  const cancelPasswordButton =
    document.getElementById(
      "cancelPasswordButton"
    );

  const deleteButton =
    document.getElementById(
      "confirmDeleteAccountButton"
    );

  const deleteModal =
    document.getElementById(
      "deleteAccountModal"
    );

  editNameButton?.addEventListener(
    "click",
    () => {
      hideAccountAlert();

      originalAccountName =
        nameInput?.value || "";

      setNameEditMode(true);
    }
  );

  saveNameButton?.addEventListener(
    "click",
    saveAccountName
  );

  cancelNameButton?.addEventListener(
    "click",
    () => {
      if (nameInput) {
        nameInput.value =
          originalAccountName;
      }

      hideAccountAlert();
      setNameEditMode(false);
    }
  );

  changePasswordButton?.addEventListener(
    "click",
    () => {
      hideAccountAlert();
      clearPasswordFields();
      setPasswordEditMode(true);
    }
  );

  savePasswordButton?.addEventListener(
    "click",
    saveAccountPassword
  );

  cancelPasswordButton?.addEventListener(
    "click",
    () => {
      hideAccountAlert();
      clearPasswordFields();
      setPasswordEditMode(false);
    }
  );

  deleteButton?.addEventListener(
    "click",
    deleteAccount
  );

  deleteModal?.addEventListener(
    "hidden.bs.modal",
    () => {
      clearDeleteAccountFields();
    }
  );
}

window.loadAccountUser =
  loadAccountUser;

window.onAccountPageLoaded =
  onAccountPageLoaded;