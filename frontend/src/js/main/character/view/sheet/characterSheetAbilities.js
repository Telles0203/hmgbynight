import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getAbilityDisplayLabel,
} from "../../creation/data/abilityCatalog.js";

import {
  getFreeTraitPurchaseCounts,
  getStateFreeTraitPurchaseOrder,
  normalizeFreeTraitPurchaseOrder,
} from "../../creation/freeTraits/characterCreationFreeTraitPurchases.js";


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


function getEffectiveAbilityEntries(
  state,
  progress,
  freeTraitPurchases = {}
) {
  const purchased =
    state?.abilities ||
    {};


  const granted =
    progress?.grantedAbilities &&
    typeof progress
      .grantedAbilities ===
      "object"
      ? progress
          .grantedAbilities
      : {};


  const keys =
    new Set([
      ...Object.keys(
        purchased
      ),

      ...Object.keys(
        granted
      ),
    ]);


  return Array.from(
    keys
  )
    .map(
      (
        entryKey
      ) => {
        const purchasedLevel =
          Math.max(
            0,
            Number(
              purchased[
                entryKey
              ]
            ) ||
            0
          );


        const grantedLevel =
          Math.max(
            0,
            Number(
              granted[
                entryKey
              ]
            ) ||
            0
          );


        return {
          entryKey,

          purchasedLevel,

          grantedLevel,

          level:
            purchasedLevel +
            grantedLevel,

          freeTraitLevel:
            freeTraitPurchases[
              entryKey
            ] ||
            0,
        };
      }
    )
    .filter(
      (
        entry
      ) =>
        entry.level >
        0
    )
    .sort(
      (
        first,
        second
      ) =>
        getAbilityDisplayLabel(
          first.entryKey
        ).localeCompare(
          getAbilityDisplayLabel(
            second.entryKey
          )
        )
    );
}


function createAbilityList(
  state,
  progress,
  showFreeTraitMarkers
) {
  const specializations =
    state?.specializations ||
    {};


  const total =
    Number(
      progress
        ?.points
        ?.total
    );


  const freeTraitOrder =
    showFreeTraitMarkers
      ? normalizeFreeTraitPurchaseOrder({
          order:
            getStateFreeTraitPurchaseOrder(
              state,
              "abilities"
            ),

          values:
            state?.abilities,

          total:
            Number.isInteger(
              total
            )
              ? total
              : 5,
        })
      : [];


  const entries =
    getEffectiveAbilityEntries(
      state,
      progress,
      getFreeTraitPurchaseCounts(
        freeTraitOrder
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
          (
            entry
          ) => {
            const specialization =
              String(
                specializations?.[
                  entry.entryKey
                ] ||
                ""
              ).trim();


            return `
              <div
                class="
                  character-sheet-row
                  character-ability-sheet-row
                  ${entry.freeTraitLevel > 0
                    ? "is-free-trait-spend"
                    : ""}
                "
              >

                <span class="character-sheet-label">

                  ${specialization
                    ? `
                      <span class="character-creation-specialization">
                        [${escapeSheetHtml(
                          specialization
                        )}]
                      </span>
                    `
                    : ""}

                  ${escapeSheetHtml(
                    getAbilityDisplayLabel(
                      entry.entryKey
                    )
                  )}

                  ${entry.grantedLevel >
                    0
                      ? `
                        <small
                          class="
                            character-creation-clan-grant-badge
                          "
                        >
                          Clã +${entry.grantedLevel}
                        </small>
                      `
                      : ""}

                </span>

                <span class="character-sheet-value">
                  ${entry.level}
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
  showFreeTraitMarkers = true,
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
      state,
      progress,
      showFreeTraitMarkers
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
