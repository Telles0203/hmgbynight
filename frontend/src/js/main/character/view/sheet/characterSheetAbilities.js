import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getAbilityDisplayLabel,
} from "../../creation/data/abilityCatalog.js";


function normalizeAbilityProgress(
  progress,
  state
) {
  const total =
    Number(
      progress
        ?.points
        ?.total
    );


  const spent =
    Number(
      progress
        ?.totalLevels
    );


  const fallbackSpent =
    Object.values(
      state?.abilities ||
      {}
    ).reduce(
      (
        sum,
        level
      ) => {
        const normalized =
          Number(
            level
          );


        return (
          sum +
          (
            Number.isInteger(
              normalized
            ) &&
            normalized >
              0
              ? normalized
              : 0
          )
        );
      },
      0
    );


  return {
    total:
      Number.isInteger(
        total
      )
        ? total
        : 5,

    spent:
      Number.isInteger(
        spent
      )
        ? spent
        : fallbackSpent,
  };
}


function createCostNotice(
  label,
  cost
) {
  const normalized =
    Number(
      cost
    );


  if (
    !Number.isFinite(
      normalized
    ) ||
    normalized <=
      0
  ) {
    return "";
  }


  return `
    <small class="character-free-trait-inline-cost">
      ${escapeSheetHtml(
        label
      )}:
      -${normalized} Free Trait${normalized === 1 ? "" : "s"}
    </small>
  `;
}


function createAbilityList(
  state
) {
  const abilities =
    state?.abilities ||
    {};


  const specializations =
    state?.specializations ||
    {};


  const entries =
    Object.entries(
      abilities
    )
      .filter(
        ([
          ,
          level,
        ]) =>
          Number(
            level
          ) >
          0
      )
      .sort(
        ([
          first,
        ], [
          second,
        ]) =>
          getAbilityDisplayLabel(
            first
          ).localeCompare(
            getAbilityDisplayLabel(
              second
            )
          )
      );


  if (
    entries.length ===
    0
  ) {
    return `
      <div class="character-sheet-empty">
        Nenhuma habilidade cadastrada.
      </div>
    `;
  }


  return `
    <div class="character-creation-map-list">

      ${entries
        .map(
          ([
            entryKey,
            level,
          ]) => {
            const specialization =
              String(
                specializations?.[
                  entryKey
                ] ||
                ""
              ).trim();


            return `
              <div class="character-sheet-row">

                <span class="character-sheet-label">

                  ${specialization
                    ? `
                      <small class="character-creation-specialization">
                        [${escapeSheetHtml(
                          specialization
                        )}]
                      </small>
                    `
                    : ""}

                  ${escapeSheetHtml(
                    getAbilityDisplayLabel(
                      entryKey
                    )
                  )}

                </span>

                <span class="character-sheet-value">
                  ${Number(
                    level
                  )}
                </span>

              </div>
            `;
          }
        )
        .join("")}

    </div>
  `;
}


export function createCharacterAbilityContent({
  state,
  progress,
  abilityFreeTraitCost,
  specializationFreeTraitCost,
}) {
  const normalized =
    normalizeAbilityProgress(
      progress,
      state
    );


  const highlight =
    normalized.spent >
    normalized.total;


  return `
    <div
      class="
        d-flex
        justify-content-end
        mb-2
      "
    >
      <span
        class="
          badge
          rounded-pill
          border
          bg-transparent
          ${highlight
            ? "border-danger text-danger"
            : "border-secondary text-secondary"}
        "
      >
        ${escapeSheetHtml(
          normalized.spent
        )}/${escapeSheetHtml(
          normalized.total
        )}
      </span>
    </div>

    ${createAbilityList(
      state
    )}

    ${createCostNotice(
      "Extra da criação",
      abilityFreeTraitCost
    )}

    ${createCostNotice(
      "Especializações",
      specializationFreeTraitCost
    )}
  `;
}
