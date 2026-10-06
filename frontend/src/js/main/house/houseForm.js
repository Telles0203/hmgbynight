import {
  loadHouses,
} from "./houses.js";


function setupHouseFormHandlers() {
  const form =
    document.getElementById(
      "createHouseForm"
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


  form.addEventListener(
    "submit",
    handleCreateHouseSubmit
  );


  const modalElement =
    document.getElementById(
      "createHouseModal"
    );


  modalElement?.addEventListener(
    "hidden.bs.modal",
    () => {
      form.reset();

      hideHouseAlert();
    }
  );
}


async function handleCreateHouseSubmit(
  event
) {
  event.preventDefault();


  const form =
    event.currentTarget;


  const nameInput =
    document.getElementById(
      "houseName"
    );


  const saveButton =
    document.getElementById(
      "saveHouseButton"
    );


  const name =
    String(
      nameInput?.value ||
      ""
    ).trim();


  hideHouseAlert();


  if (!name) {
    showHouseAlert(
      "Informe o nome da Crônica."
    );


    nameInput?.focus();

    return;
  }


  try {
    setHouseLoading(
      saveButton,
      true
    );


    const response =
      await fetch(
        "/api/houses",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              name,
            }),
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (
      !response.ok ||
      !data?.ok
    ) {
      showHouseAlert(
        data?.error ||
          "Não foi possível criar a Crônica."
      );


      return;
    }


    await loadHouses();


    form.reset();


    closeCreateHouseModal();

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao criar Crônica:",
      error
    );


    showHouseAlert(
      "Erro de conexão com o servidor."
    );

  } finally {
    setHouseLoading(
      saveButton,
      false
    );
  }
}


function closeCreateHouseModal() {
  const modalElement =
    document.getElementById(
      "createHouseModal"
    );


  if (
    !modalElement ||
    !window.bootstrap
  ) {
    return;
  }


  const modal =
    window.bootstrap.Modal
      .getOrCreateInstance(
        modalElement
      );


  modal.hide();
}


function setHouseLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }


  button.disabled =
    loading;


  button.textContent =
    loading
      ? "Criando..."
      : "Criar Crônica";
}


function showHouseAlert(
  message
) {
  const alert =
    document.getElementById(
      "createHouseAlert"
    );


  if (!alert) {
    return;
  }


  alert.textContent =
    message;


  alert.className =
    "alert alert-danger";
}


function hideHouseAlert() {
  const alert =
    document.getElementById(
      "createHouseAlert"
    );


  if (!alert) {
    return;
  }


  alert.textContent =
    "";


  alert.className =
    "alert d-none";
}


window.setupHouseFormHandlers =
  setupHouseFormHandlers;