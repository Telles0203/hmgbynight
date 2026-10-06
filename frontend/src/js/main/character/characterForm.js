import {
  getSelectedCreateCharacterChronicleId,
  prepareCreateCharacterChronicleSelector,
  resetCreateCharacterChronicleSelector,
  setupCreateCharacterChronicleSelector,
} from "./characterChronicleSelector.js";


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


  alert.textContent =
    "";


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


  sectSelect?.addEventListener(
    "change",
    () => {
      window
        .updateOtherSectVisibility
        ?.();
    }
  );


  setupCreateCharacterChronicleSelector();


  modalElement?.addEventListener(
    "show.bs.modal",
    () => {
      hideCharacterAlert();


      prepareCreateCharacterChronicleSelector();
    }
  );


  form.addEventListener(
    "submit",
    handleCreateCharacterSubmit
  );


  modalElement?.addEventListener(
    "hidden.bs.modal",
    () => {
      form.reset();


      hideCharacterAlert();


      resetCreateCharacterChronicleSelector();


      window
        .updateOtherSectVisibility
        ?.();
    }
  );
}


async function handleCreateCharacterSubmit(
  event
) {
  event.preventDefault();


  const form =
    event.currentTarget;


  const modalElement =
    document.getElementById(
      "createCharacterModal"
    );


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
    nameInput
      ?.value
      ?.trim();


  const sect =
    window
      .getSelectedSect
      ?.() ||
    "";


  const clan =
    clanSelect
      ?.value ||
    "";


  const requestedMotherHouseId =
    getSelectedCreateCharacterChronicleId();


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
              sect,
              clan,
              requestedMotherHouseId,
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
      showCharacterAlert(
        data?.error ||
          "Não foi possível criar o personagem."
      );


      return;
    }


    const requestedChronicle =
      Boolean(
        data.character
          ?.pendingMotherHouse
      );


    showCharacterAlert(
      requestedChronicle
        ? "Personagem criado e solicitação de Crônica enviada."
        : "Personagem criado com sucesso.",

      "success"
    );


    form.reset();


    resetCreateCharacterChronicleSelector();


    window
      .updateOtherSectVisibility
      ?.();


    await window
      .loadCharacters
      ?.();


    setTimeout(
      () => {
        if (
          modalElement &&
          window.bootstrap
        ) {
          window.bootstrap.Modal
            .getOrCreateInstance(
              modalElement
            )
            .hide();
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


window.showCharacterAlert =
  showCharacterAlert;


window.hideCharacterAlert =
  hideCharacterAlert;


window.setupCharacterFormHandlers =
  setupCharacterFormHandlers;