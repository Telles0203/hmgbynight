import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";


const GENERATION_HELP_TEXT =
  "Laws of the Night Revised, página 95. Um personagem começa normalmente na 13ª Geração. Cada nível do Antecedente Geração reduz a geração em um passo, até a 8ª Geração com cinco níveis. A Geração também determina limites como Sangue, gasto de Sangue por turno e Força de Vontade.";


const MORALITY_APPROVAL_MESSAGE =
  "Esta Trilha requer aprovação da Narração.";


function moralityPathRequiresApproval(
  moralityPath
) {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.moralityPaths ||
    [];


  const option =
    options.find(
      (
        item
      ) =>
        String(
          item.value
        ) ===
        String(
          moralityPath
        )
    );


  return (
    option
      ?.requiresNarratorApproval ===
    true
  );
}


function createMoralityApprovalIndicator(
  moralityPath
) {
  if (
    !moralityPathRequiresApproval(
      moralityPath
    )
  ) {
    return "";
  }


  return `
    <span
      class="character-sheet-warning-inline"
      title="${escapeSheetHtml(
        MORALITY_APPROVAL_MESSAGE
      )}"
      aria-label="${escapeSheetHtml(
        MORALITY_APPROVAL_MESSAGE
      )}"
    >
      !
    </span>
  `;
}


function createIdentityFieldRow({
  characterId,
  field,
  label,
  value,
  displayValue,
  editable,
}) {
  const safeCharacterId =
    escapeSheetHtml(
      characterId
    );


  const safeField =
    escapeSheetHtml(
      field
    );


  const safeLabel =
    escapeSheetHtml(
      label
    );


  const safeDisplayValue =
    escapeSheetHtml(
      displayValue ||
      value ||
      ""
    );


  return `
    <div
      class="
        character-sheet-row
        character-identity-row
      "
      data-character-id="${safeCharacterId}"
      data-character-field="${safeField}"
    >

      <span class="character-sheet-label">
        ${safeLabel}
      </span>

      <span
        class="
          character-sheet-value
          character-identity-value
        "
      >

        <span class="character-inline-display">

          <span class="character-field-display">
            ${safeDisplayValue || "—"}
          </span>

          ${
            field ===
              "moralityPath"
              ? createMoralityApprovalIndicator(
                  value
                )
              : ""
          }

          ${
            editable
              ? `
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
                  "
                  data-character-identity-action="edit"
                  aria-label="Editar ${safeLabel}"
                  title="Editar ${safeLabel}"
                >
                  ✎
                </button>
              `
              : ""
          }

        </span>

      </span>

    </div>
  `;
}


function createEditableFieldRow({
  characterId,
  field,
  label,
  value,
  editLabel,
  editable,
}) {
  const safeCharacterId =
    escapeSheetHtml(
      characterId
    );


  const safeField =
    escapeSheetHtml(
      field
    );


  const safeLabel =
    escapeSheetHtml(
      label
    );


  const safeValue =
    escapeSheetHtml(
      value ||
      ""
    );


  const safeEditLabel =
    escapeSheetHtml(
      editLabel
    );


  return `
    <div
      class="
        character-sheet-row
        character-editable-row
      "
      data-character-id="${safeCharacterId}"
      data-character-field="${safeField}"
    >

      <span class="character-sheet-label">
        ${safeLabel}
      </span>

      <span
        class="
          character-sheet-value
          character-editable-value
        "
      >

        <span class="character-inline-display">

          <span class="character-field-display">
            ${safeValue || "—"}
          </span>

          ${
            editable
              ? `
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
                  "
                  data-character-inline-action="edit"
                  aria-label="${safeEditLabel}"
                  title="${safeEditLabel}"
                >
                  ✎
                </button>
              `
              : ""
          }

        </span>

      </span>

    </div>
  `;
}


function createGenerationRow(
  generation
) {
  const displayValue =
    formatGeneration(
      generation
    );


  const safeHelpText =
    escapeSheetHtml(
      GENERATION_HELP_TEXT
    );


  return `
    <div class="character-sheet-row">

      <span
        class="
          character-sheet-label
          d-inline-flex
          align-items-center
          gap-1
        "
      >

        <span>
          Geração
        </span>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            rounded-circle
            p-0
            character-sheet-help-button
            character-generation-help
          "
          aria-label="Informações sobre Geração"
          data-bs-toggle="popover"
          data-bs-trigger="focus"
          data-bs-placement="top"
          data-bs-container="body"
          data-bs-title="Geração"
          data-bs-content="${safeHelpText}"
          title="Geração"
        >
          ?
        </button>

      </span>

      <span class="character-sheet-value">
        ${escapeSheetHtml(
          displayValue
        )}
      </span>

    </div>
  `;
}


function formatGeneration(
  generation
) {
  const numeric =
    Number(
      generation
    );


  if (
    Number.isInteger(
      numeric
    ) &&
    numeric >
      0
  ) {
    return `${numeric}ª`;
  }


  const normalized =
    String(
      generation ||
      ""
    ).trim();


  if (
    normalized
  ) {
    return normalized;
  }


  return "13ª";
}


export function createVampireSection({
  characterId,
  concept,
  clan,
  clanValue,
  generation,
  sect,
  moralityPath,
  moralityPathLabel,
  house,
  editable,
}) {
  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
    >

      <h4 class="character-sheet-title">
        Vampiro
      </h4>

      ${createEditableFieldRow({
        characterId,

        field:
          "concept",

        label:
          "Conceito",

        value:
          concept,

        editLabel:
          "Editar conceito",

        editable,
      })}

      ${createIdentityFieldRow({
        characterId,

        field:
          "clan",

        label:
          "Clã",

        value:
          clanValue,

        displayValue:
          clan,

        editable,
      })}

      ${createGenerationRow(
        generation
      )}

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Seita
        </span>

        <span class="character-sheet-value">
          ${escapeSheetHtml(
            sect ||
            "—"
          )}
        </span>

      </div>

      ${createIdentityFieldRow({
        characterId,

        field:
          "moralityPath",

        label:
          "Trilha Moral",

        value:
          moralityPath,

        displayValue:
          moralityPathLabel,

        editable,
      })}

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Crônica
        </span>

        <span class="character-sheet-value">
          ${house}
        </span>

      </div>

    </section>
  `;
}


export function createPersonalitySection({
  characterId,
  title,
  natureLabel,
  demeanorLabel,
  editable,
}) {
  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
    >

      <h4 class="character-sheet-title">
        Personalidade
      </h4>

      ${createEditableFieldRow({
        characterId,

        field:
          "nature",

        label:
          "Natureza",

        value:
          natureLabel,

        editLabel:
          "Editar Natureza",

        editable,
      })}

      ${createEditableFieldRow({
        characterId,

        field:
          "demeanor",

        label:
          "Comportamento",

        value:
          demeanorLabel,

        editLabel:
          "Editar Comportamento",

        editable,
      })}

      ${createIdentityFieldRow({
        characterId,

        field:
          "title",

        label:
          "Título",

        value:
          title,

        displayValue:
          title,

        editable,
      })}

    </section>
  `;
}


export {
  GENERATION_HELP_TEXT,
};