import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";


export const GENERATION_APPROVAL_MESSAGE =
  "Generation requer aprovação da Narração durante a criação do personagem.";


function createNotice(
  title,
  message
) {
  return `
    <div
      class="
        character-creation-pending
      "
    >

      <span
        class="
          character-creation-pending-icon
        "
      >
        !
      </span>

      <div>

        <strong>
          ${escapeSheetHtml(
            title
          )}
        </strong>

        <small>
          ${escapeSheetHtml(
            message
          )}
        </small>

      </div>

    </div>
  `;
}


export function createGenerationApprovalNotice(
  state
) {
  const generation =
    Number(
      state
        ?.backgrounds
        ?.generation
    ) ||
    0;


  if (
    generation <=
    0
  ) {
    return "";
  }


  return createNotice(
    "Aprovação da Narração necessária",
    GENERATION_APPROVAL_MESSAGE
  );
}


export function createPendingClanChoiceNotice(
  progress
) {
  const pending =
    Array.isArray(
      progress
        ?.pendingClanGrantChoices
    )
      ? progress
          .pendingClanGrantChoices
      : [];


  if (
    pending.length ===
    0
  ) {
    return "";
  }


  const suffix =
    pending.length ===
    1
      ? "Existe 1 benefício de clã obrigatório ainda não selecionado."
      : `Existem ${pending.length} benefícios de clã obrigatórios ainda não selecionados.`;


  return createNotice(
    "Benefício de clã pendente",
    `${suffix} Abra Influências e faça a escolha antes de concluir a criação.`
  );
}


export function createCreationRuleErrorNotice(
  progress
) {
  const errors =
    Array.isArray(
      progress?.errors
    )
      ? [
          ...new Set(
            progress.errors
              .map(
                (
                  error
                ) =>
                  String(
                    error ||
                    ""
                  ).trim()
              )
              .filter(
                Boolean
              )
          ),
        ]
      : [];


  if (
    errors.length ===
    0
  ) {
    return "";
  }


  return `
    <div
      class="
        character-creation-pending
      "
    >

      <span
        class="
          character-creation-pending-icon
        "
      >
        !
      </span>

      <div>

        <strong>
          Ajuste necessário
        </strong>

        ${errors
          .map(
            (
              error
            ) => `
              <small class="d-block">
                ${escapeSheetHtml(
                  error
                )}
              </small>
            `
          )
          .join("")}

      </div>

    </div>
  `;
}
