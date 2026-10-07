import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getBackgroundLabel,
} from "../../creation/form/background/characterCreationBackgroundCatalog.js";

import {
  getBackgroundAllocationPurchaseCounts,
  getBackgroundAllocationSpent,
  normalizeBackgroundAllocationPurchaseOrder,
} from "../../creation/form/background/characterCreationBackgroundAllocation.js";

import {
  createCreationRuleErrorNotice,
  createGenerationApprovalNotice,
} from "../../creation/form/background/characterCreationBackgroundNotices.js";

import {
  getStateFreeTraitPurchaseOrder,
} from "../../creation/freeTraits/characterCreationFreeTraitPurchases.js";


function normalizeBackgroundProgress(
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
        : getBackgroundAllocationSpent(
            state?.backgrounds,
            state?.influences
          ),
  };
}


function createBackgroundProgress(
  progress,
  state
) {
  const normalized =
    normalizeBackgroundProgress(
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
  `;
}


function createBackgroundCostNotice(
  cost,
  show
) {
  const normalized =
    Number(
      cost
    );


  if (
    !show ||
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
      Pool compartilhado:
      -${normalized} Free Trait${normalized === 1 ? "" : "s"}
    </small>
  `;
}


function createBackgroundList(
  state,
  progress,
  showFreeTraitMarkers
) {
  const total =
    Number(
      progress
        ?.points
        ?.total
    );


  const freeTraitOrder =
    showFreeTraitMarkers
      ? normalizeBackgroundAllocationPurchaseOrder({
          order:
            getStateFreeTraitPurchaseOrder(
              state,
              "backgrounds"
            ),

          backgrounds:
            state?.backgrounds,

          influences:
            state?.influences,

          total:
            Number.isInteger(
              total
            )
              ? total
              : 5,
        })
      : [];


  const freeTraitPurchases =
    getBackgroundAllocationPurchaseCounts(
      freeTraitOrder
    )
      .backgrounds;


  const purchased =
    state?.backgrounds ||
    {};


  const granted =
    progress
      ?.grantedBackgrounds ||
    {};


  const entries =
    Array.from(
      new Set([
        ...Object.keys(
          purchased
        ),

        ...Object.keys(
          granted
        ),
      ])
    )
      .map(
        (
          background
        ) => {
          const purchasedLevel =
            Math.max(
              0,
              Number(
                purchased[
                  background
                ]
              ) ||
              0
            );


          const grantedLevel =
            Math.max(
              0,
              Number(
                granted[
                  background
                ]
              ) ||
              0
            );


          return {
            background,

            purchasedLevel,

            grantedLevel,

            level:
              purchasedLevel +
              grantedLevel,
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
          getBackgroundLabel(
            first.background
          ).localeCompare(
            getBackgroundLabel(
              second.background
            )
          )
      );


  if (
    entries.length ===
      0
  ) {
    return `
      <div
        class="
          character-sheet-empty
        "
      >
        Nenhum antecedente cadastrado.
      </div>
    `;
  }


  return `
    <div
      class="
        character-creation-map-list
        character-background-sheet-list
      "
    >

      ${entries
        .map(
          (
            entry
          ) => `
            <div
              class="
                character-sheet-row
                character-background-sheet-row
                ${(
                  freeTraitPurchases[
                    entry.background
                  ] ||
                  0
                ) > 0
                  ? "is-free-trait-spend"
                  : ""}
              "
            >

              <span
                class="
                  character-sheet-label
                  character-background-sheet-name
                "
              >
                ${escapeSheetHtml(
                  getBackgroundLabel(
                    entry.background
                  )
                )}

                ${entry.grantedLevel > 0
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

              <span
                class="
                  character-sheet-value
                "
              >
                ${entry.level}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}


export function createCharacterBackgroundContent({
  state,
  progress,
  backgroundFreeTraitCost = 0,
  showFreeTraitMarkers = true,
}) {
  return `
    ${createBackgroundProgress(
      progress,
      state
    )}

    <small
      class="
        d-block
        text-secondary
        text-center
        mb-2
      "
    >
      Pool compartilhado com Influências.
    </small>

    ${createBackgroundList(
      state,
      progress,
      showFreeTraitMarkers
    )}

    ${createGenerationApprovalNotice(
      state
    )}

    ${createCreationRuleErrorNotice(
      progress
    )}

    ${createBackgroundCostNotice(
      backgroundFreeTraitCost,
      showFreeTraitMarkers
    )}
  `;
}
