const CHARACTER_CREATION_NOTICE_KEY =
  "bynight_character_creation_notice";


function isCharacterCreationNoticeHidden() {
  try {
    return (
      localStorage.getItem(
        CHARACTER_CREATION_NOTICE_KEY
      ) ===
      "hidden"
    );

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível consultar a preferência do aviso de criação:",
      error
    );


    return false;
  }
}


function saveCharacterCreationNoticeHidden() {
  try {
    localStorage.setItem(
      CHARACTER_CREATION_NOTICE_KEY,
      "hidden"
    );


    return true;

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível salvar a preferência do aviso de criação:",
      error
    );


    return false;
  }
}


export function createCharacterCreationNotice() {
  if (
    isCharacterCreationNoticeHidden()
  ) {
    return "";
  }


  return `
    <div
      id="characterCreationNotice"
      class="
        alert
        alert-dark
        character-creation-notice
        border
        border-secondary
        small
        mb-3
      "
      role="note"
    >

      <div
        class="fw-semibold text-light mb-1"
      >
        Criação de personagem
      </div>

      <div
        class="text-secondary"
      >
        O estado da ficha é independente do vínculo
        com uma Crônica. Todo personagem começa com
        a ficha aguardando a distribuição inicial de
        pontos e permanece nesse estado até que a
        criação inicial seja concluída.
      </div>

      <div
        class="character-creation-notice-footer"
      >

        <label
          class="character-creation-notice-check"
          for="characterCreationNoticeConfirm"
        >

          <input
            id="characterCreationNoticeConfirm"
            class="form-check-input"
            type="checkbox"
          >

          <span>
            Entendi este aviso
          </span>

        </label>

        <button
          id="hideCharacterCreationNotice"
          type="button"
          class="
            btn
            btn-sm
            character-creation-notice-hide-button
          "
          disabled
        >
          Não mostrar mais
        </button>

      </div>

    </div>
  `;
}


export function setupCharacterCreationNotice(
  container
) {
  const notice =
    container.querySelector(
      "#characterCreationNotice"
    );


  if (!notice) {
    return;
  }


  const checkbox =
    notice.querySelector(
      "#characterCreationNoticeConfirm"
    );


  const hideButton =
    notice.querySelector(
      "#hideCharacterCreationNotice"
    );


  if (
    !checkbox ||
    !hideButton
  ) {
    return;
  }


  checkbox.addEventListener(
    "change",
    () => {
      hideButton.disabled =
        !checkbox.checked;
    }
  );


  hideButton.addEventListener(
    "click",
    () => {
      if (
        !checkbox.checked
      ) {
        return;
      }


      saveCharacterCreationNoticeHidden();


      notice.remove();
    }
  );
}