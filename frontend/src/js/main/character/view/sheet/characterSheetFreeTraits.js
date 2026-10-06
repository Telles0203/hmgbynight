import {
  escapeSheetHtml,
  humanizeSheetKey,
} from "./characterSheetCommon.js";


const FREE_TRAIT_SPENDING_LABELS = {
  attributes:
    "Atributos",

  abilities:
    "Habilidades",

  specializations:
    "Especializações",

  disciplines:
    "Disciplinas",

  backgrounds:
    "Antecedentes",

  virtues:
    "Virtudes",

  morality:
    "Moralidade",

  willpower:
    "Força de Vontade",

  merits:
    "Qualidades",
};


function normalizeValue(
  value
) {
  const normalized =
    Number(
      value
    );


  return Number.isFinite(
    normalized
  )
    ? normalized
    : 0;
}


function getSpendingLabel(
  key
) {
  return (
    FREE_TRAIT_SPENDING_LABELS[
      key
    ] ||
    humanizeSheetKey(
      key
    )
  );
}


function createCostValue(
  value
) {
  const normalized =
    Math.max(
      0,
      normalizeValue(
        value
      )
    );


  if (
    normalized ===
    0
  ) {
    return "0";
  }


  return `-${normalized}`;
}


export function createFreeTraitContent(
  creation
) {
  const freeTraits =
    creation
      ?.freeTraits ||
    {};


  const available =
    normalizeValue(
      freeTraits.available
    );


  const spent =
    normalizeValue(
      freeTraits.spent
    );


  const remaining =
    normalizeValue(
      freeTraits.remaining
    );


  return `
    <div class="character-creation-free-compact">

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Disponíveis
        </span>

        <span class="character-sheet-value">
          ${available}
        </span>

      </div>

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Gastos
        </span>

        <span
          class="
            character-sheet-value
            ${
              spent >
                0
                ? "character-free-trait-cost"
                : ""
            }
          "
        >
          ${createCostValue(
            spent
          )}
        </span>

      </div>

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Restantes
        </span>

        <span
          class="
            character-sheet-value
            ${
              remaining <
                0
                ? "character-free-trait-cost"
                : ""
            }
          "
        >
          ${remaining}
        </span>

      </div>

    </div>
  `;
}


export function createFreeTraitSpending(
  creation
) {
  const spending =
    creation
      ?.freeTraits
      ?.spending ||
    {};


  const entries =
    Object.entries(
      spending
    )
      .map(
        ([
          key,
          value,
        ]) => [
          key,
          normalizeValue(
            value
          ),
        ]
      )
      .filter(
        ([
          ,
          value,
        ]) =>
          value >
          0
      );


  if (
    entries.length ===
      0
  ) {
    return "";
  }


  return `
    <div class="character-free-trait-spending">

      <div class="character-free-trait-spending-title">
        Resumo do gasto
      </div>

      ${entries
        .map(
          ([
            key,
            value,
          ]) => `
            <div class="character-sheet-row">

              <span class="character-sheet-label">
                ${escapeSheetHtml(
                  getSpendingLabel(
                    key
                  )
                )}
              </span>

              <span
                class="
                  character-sheet-value
                  character-free-trait-cost
                "
              >
                ${escapeSheetHtml(
                  createCostValue(
                    value
                  )
                )}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}