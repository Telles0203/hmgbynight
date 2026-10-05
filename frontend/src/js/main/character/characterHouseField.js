import {
  escapeHouseHtml,
} from "../house/houseSearch.js";


export function createCharacterHouseField(
  character
) {
  const characterId =
    escapeHouseHtml(
      character?.id
    );


  const motherHouse =
    character?.motherHouse;


  const pendingMotherHouse =
    character?.pendingMotherHouse;


  if (motherHouse) {
    const houseName =
      escapeHouseHtml(
        motherHouse.name ||
        "Crônica vinculada"
      );


    return `
      <span
        class="character-house-field text-light"
      >
        ${houseName}
      </span>
    `;
  }


  if (pendingMotherHouse) {
    const houseName =
      escapeHouseHtml(
        pendingMotherHouse.name ||
        "Crônica"
      );


    return `
      <span
        class="character-house-field"
      >

        <span
          class="character-house-pending-info"
        >

          <span
            class="
              d-flex
              flex-column
              align-items-start
              gap-1
            "
          >

            <span class="text-light">
              ${houseName}
            </span>


            <span
              class="text-secondary small"
            >
              Vínculo pendente
            </span>

          </span>


          <button
            type="button"
            class="
              btn
              btn-link
              btn-sm
              text-secondary
              text-decoration-none
              p-0
              character-inline-edit-button
              character-house-edit-button
            "
            data-character-id="${characterId}"
            aria-label="Editar vínculo com a Crônica"
            title="Editar vínculo com a Crônica"
            aria-expanded="false"
          >
            ✎
          </button>

        </span>


        <span
          class="
            character-house-actions
            d-none
          "
        >

          <button
            type="button"
            class="
              btn
              btn-outline-light
              btn-sm
              character-house-change-button
            "
            data-character-id="${characterId}"
          >
            Alterar Crônica
          </button>


          <button
            type="button"
            class="
              btn
              btn-outline-danger
              btn-sm
              character-house-remove-button
            "
            data-character-id="${characterId}"
          >
            Remover solicitação
          </button>


          <button
            type="button"
            class="
              btn
              btn-outline-secondary
              btn-sm
              character-house-edit-cancel-button
            "
            data-character-id="${characterId}"
          >
            Cancelar
          </button>

        </span>

      </span>
    `;
  }


  return `
    <span
      class="character-house-field"
    >

      <button
        type="button"
        class="
          btn
          btn-outline-light
          btn-sm
          character-house-select-button
        "
        data-character-id="${characterId}"
      >
        Selecionar Crônica
      </button>

    </span>
  `;
}