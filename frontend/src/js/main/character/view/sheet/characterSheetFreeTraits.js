import {
  escapeSheetHtml,
  humanizeSheetKey,
} from "./characterSheetCommon.js";


const FREE_TRAIT_SOURCE_LABELS = {
  base:
    "Criação",

  negativeTraits:
    "Traits Negativos",

  flaws:
    "Defeitos",

  derangement:
    "Derangement",

  moralitySacrifice:
    "Moralidade sacrificada",
};


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


function getSourceLabel(
  key
) {
  return (
    FREE_TRAIT_SOURCE_LABELS[
      key
    ] ||
    humanizeSheetKey(
      key
    )
  );
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


function createGainValue(
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


  return `+${normalized}`;
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


function createFreeTraitSources(
  freeTraits
) {
  const sources =
    freeTraits
      ?.sources ||
    {};


  const entries =
    Object.entries(
      sources
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
    <div class="character-free-trait-sources">

      <div class="character-free-trait-summary-title">
        Resumo dos ganhos
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
                  getSourceLabel(
                    key
                  )
                )}
              </span>

              <span
                class="
                  character-sheet-value
                  character-free-trait-gain
                "
              >
                ${escapeSheetHtml(
                  createGainValue(
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

      ${createFreeTraitSources(
        freeTraits
      )}

      <div class="character-free-trait-totals">

        <div class="character-sheet-row">

          <span class="character-sheet-label">
            Total disponível
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

      <div class="character-free-trait-summary-title">
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