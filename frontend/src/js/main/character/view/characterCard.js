import {
  createCharacterSheet,
} from "./characterSheet.js";

import {
  createCharacterDeleteControls,
} from "../characterDelete.js";

import {
  createCharacterHouseField,
} from "../characterHouse.js";


export function createCharacterCard(
  character
) {
  const id =
    escapeCharacterHtml(
      character.id
    );


  const name =
    escapeCharacterHtml(
      character.name
    );


  const title =
    escapeCharacterHtml(
      character.title ||
      ""
    );


  const clan =
    escapeCharacterHtml(
      character.clanDisplayName ||
      character.clan ||
      ""
    );


  const sect =
    escapeCharacterHtml(
      window.getSectLabel?.(
        character.sect
      ) ||
      character.sect ||
      ""
    );


  const hasHouse =
    Boolean(
      character.motherHouse
    );


  const canEditSheet =
    character.editState
      ?.canEdit ??
    !hasHouse;


  const houseSummary =
    getCharacterHouseSummary(
      character
    );


  const houseField =
    createCharacterHouseField(
      character
    );


  return `
    <article
      class="character-card"
      data-character-id="${id}"
    >

      <div
        class="character-card-header"
      >

        <div
          class="character-card-identity"
        >

          <h3
            class="character-card-name h6 text-light mb-1"
          >
            ${name}
          </h3>

          <div
            class="
              character-title-summary
              text-secondary
              small
              ${
                title
                  ? ""
                  : "d-none"
              }
            "
          >
            ${title}
          </div>

          <div
            class="character-status-slot mb-2"
          >
            ${createCharacterStatuses(
              character
            )}
          </div>

          <div
            class="
              character-clan-summary
              text-secondary
              small
            "
          >
            ${clan}
          </div>

          <div
            class="
              text-secondary
              small
              character-house-summary
            "
          >
            ${
              sect
                ? `${sect} · `
                : ""
            }${escapeCharacterHtml(
              houseSummary
            )}
          </div>

        </div>

        ${
          !hasHouse
            ? createCharacterDeleteControls(
                id
              )
            : ""
        }

        <button
          type="button"
          class="
            btn
            btn-outline-light
            btn-sm
            character-open-button
          "
          data-character-id="${id}"
        >
          Abrir →
        </button>

      </div>

      ${createCharacterSheet({
        characterId:
          character.id,

        title:
          character.title ||
          "",

        concept:
          character.concept ||
          "",

        natureLabel:
          character.natureLabel ||
          "",

        demeanorLabel:
          character.demeanorLabel ||
          "",

        moralityPathLabel:
          character.moralityPathLabel ||
          "Humanidade",

        moralityRating:
          Number.isFinite(
            character.moralityRating
          )
            ? character.moralityRating
            : null,

        activeVirtues:
          Array.isArray(
            character.activeVirtues
          )
            ? character.activeVirtues
            : [],

        virtuePoints:
          character.virtuePoints ||
          {
            total:
              7,

            spent:
              0,

            remaining:
              7,

            complete:
              false,
          },

        canEditDirectly:
          canEditSheet,

        canEditVirtues:
          canEditSheet,

        clan,

        clanValue:
          character.clan ||
          "",

        sect,

        house:
          houseField,
      })}

    </article>
  `;
}


export function createCharacterStatuses(
  character
) {
  const sheetStatus =
    getCharacterSheetStatus(
      character
    );


  const chronicleStatus =
    getCharacterChronicleStatus(
      character
    );


  return `
    <div
      class="character-lifecycle-statuses"
    >

      ${createStatusMarkup({
        type:
          "sheet",

        status:
          sheetStatus,

        title:
          "Status da ficha",
      })}

      ${createStatusMarkup({
        type:
          "chronicle",

        status:
          chronicleStatus,

        title:
          "Vínculo com Crônica",
      })}

    </div>
  `;
}


function createStatusMarkup({
  type,
  status,
  title,
}) {
  const safeKey =
    escapeCharacterHtml(
      status.key
    );


  const safeLabel =
    escapeCharacterHtml(
      status.label
    );


  const safeDescription =
    escapeCharacterHtml(
      status.description
    );


  const safeTitle =
    escapeCharacterHtml(
      title
    );


  const dataAttribute =
    type ===
      "sheet"
      ? "data-character-sheet-status"
      : "data-character-chronicle-status";


  return `
    <div
      class="
        character-lifecycle-status
        character-lifecycle-status-${type}
      "
      ${dataAttribute}="${safeKey}"
    >

      <span
        class="
          badge
          rounded-pill
          character-lifecycle-badge
        "
      >
        ${safeLabel}
      </span>

      <button
        type="button"
        class="
          btn
          btn-sm
          p-0
          border-0
          bg-transparent
          text-secondary
          character-status-help
        "
        data-bs-toggle="popover"
        data-bs-trigger="focus"
        data-bs-placement="top"
        data-bs-title="${safeTitle}"
        data-bs-content="${safeDescription}"
        aria-label="${safeTitle}"
        title="${safeTitle}"
      >
        <span
          class="
            badge
            rounded-circle
            border
            border-secondary
            text-secondary
            bg-transparent
          "
        >
          ?
        </span>
      </button>

    </div>
  `;
}


function getCharacterSheetStatus(
  character
) {
  const lifecycle =
    String(
      character
        ?.sheetStatus
        ?.key ||
      character
        ?.sheetLifecycle ||
      "initial_distribution_pending"
    );


  let status;


  if (
    lifecycle ===
    "initial_review_pending"
  ) {
    status = {
      key:
        "initial_review_pending",

      label:
        character
          ?.sheetStatus
          ?.label ||
        "FICHA INICIAL AGUARDANDO APROVAÇÃO DA CRÔNICA",

      description:
        character
          ?.sheetStatus
          ?.description ||
        "A distribuição inicial foi enviada para a Crônica e aguarda análise da Narração.",
    };

  } else if (
    lifecycle ===
    "active"
  ) {
    status = {
      key:
        "active",

      label:
        character
          ?.sheetStatus
          ?.label ||
        "FICHA ATIVA",

      description:
        character
          ?.sheetStatus
          ?.description ||
        "A criação inicial deste personagem foi concluída.",
    };

  } else {
    status = {
      key:
        "initial_distribution_pending",

      label:
        "PONTOS DE ATENÇÃO",

      description:
        character
          ?.sheetStatus
          ?.description ||
        "Ficha aguardando distribuição inicial de pontos. A criação inicial deste personagem ainda não foi concluída. Os pontos e campos obrigatórios da ficha ainda precisam ser finalizados.",
    };
  }


  if (
    character.editState
      ?.mode ===
    "approval_draft"
  ) {
    status.description +=
      " Como o personagem já pertence a uma Crônica, as alterações realizadas pelo jogador são salvas em um rascunho separado e não modificam a ficha oficial até a aprovação da Narração.";
  }


  const draftFields =
    Array.isArray(
      character.sheetDraft
        ?.fields
    )
      ? character.sheetDraft
          .fields
      : [];


  if (
    draftFields.length >
    0
  ) {
    status.description +=
      ` Existem ${draftFields.length} campo${draftFields.length === 1 ? "" : "s"} com alterações salvas no rascunho.`;
  }


  return status;
}


function getCharacterChronicleStatus(
  character
) {
  if (
    character?.motherHouse
  ) {
    return {
      key:
        "linked",

      label:
        "CRÔNICA VINCULADA",

      description:
        "Este personagem já está vinculado a uma Crônica.",
    };
  }


  if (
    character
      ?.pendingMotherHouse
  ) {
    return {
      key:
        "pending",

      label:
        "VÍNCULO PENDENTE",

      description:
        "Este personagem solicitou vínculo com uma Crônica e aguarda aprovação.",
    };
  }


  return {
    key:
      "none",

    label:
      "SEM CRÔNICA",

    description:
      "Este personagem ainda não está vinculado a uma Crônica.",
  };
}


export function getCharacterHouseSummary(
  character
) {
  if (
    character.motherHouse
  ) {
    return (
      character.motherHouse.name ||
      "Crônica vinculada"
    );
  }


  if (
    character.pendingMotherHouse
  ) {
    return (
      character
        .pendingMotherHouse
        .name ||
      "Crônica solicitada"
    );
  }


  return "Sem Crônica";
}


export function setupCharacterPopovers(
  container
) {
  if (
    !window.bootstrap?.Popover
  ) {
    console.warn(
      "[CHARACTER] Bootstrap Popover não disponível."
    );


    return;
  }


  const elements =
    container.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );


  elements.forEach(
    (
      element
    ) => {
      window.bootstrap
        .Popover
        .getOrCreateInstance(
          element
        );
    }
  );
}


function escapeCharacterHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ?? ""
    );


  return element.innerHTML;
}