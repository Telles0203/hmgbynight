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

  sectSelect?.addEventListener(
    "change",
    () => {
      window.updateOtherSectVisibility?.();
    }
  );

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
        window.getSelectedSect?.() ||
        "";

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

        window.updateOtherSectVisibility?.();

        await window.loadCharacters?.();

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

  modalElement?.addEventListener(
    "hidden.bs.modal",
    () => {
      form.reset();

      hideCharacterAlert();

      window.updateOtherSectVisibility?.();
    }
  );
}

window.showCharacterAlert =
  showCharacterAlert;

window.hideCharacterAlert =
  hideCharacterAlert;

window.setupCharacterFormHandlers =
  setupCharacterFormHandlers;