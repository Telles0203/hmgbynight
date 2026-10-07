import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getInfluenceEntries,
  getInfluenceLabel,
} from "../../creation/form/influence/characterCreationInfluenceCatalog.js";

import {
  getBackgroundAllocationPurchaseCounts,
  getBackgroundAllocationSpent,
  normalizeBackgroundAllocationPurchaseOrder,
} from "../../creation/form/background/characterCreationBackgroundAllocation.js";

import {
  getStateFreeTraitPurchaseOrder,
} from "../../creation/freeTraits/characterCreationFreeTraitPurchases.js";


function normalizeInfluenceProgress(
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


function createInfluenceProgress(
  progress,
  state
) {
  const normalized =
    normalizeInfluenceProgress(
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


function createInfluenceCostNotice(
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


function createInfluenceList(
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


  const order =
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


  const purchases =
    getBackgroundAllocationPurchaseCounts(
      order
    )
      .influences;


  const entries =
    getInfluenceEntries(
      state
    )
      .sort(
        (
          first,
          second
        ) =>
          getInfluenceLabel(
            first.influence
          ).localeCompare(
            getInfluenceLabel(
              second.influence
            )
          )
      );


  if (
    entries.length ===
      0
  ) {
    return `
      <div class="character-sheet-empty">
        Nenhuma influência cadastrada.
      </div>
    `;
  }


  return `
    <div
      class="
        character-creation-map-list
        character-influence-sheet-list
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
                character-influence-sheet-row
                ${(
                  purchases[
                    entry.influence
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
                  character-influence-sheet-name
                "
              >
                ${escapeSheetHtml(
                  getInfluenceLabel(
                    entry.influence
                  )
                )}
              </span>

              <span
                class="
                  character-sheet-value
                "
              >
                ${Number(
                  entry.level
                )}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}


export function createCharacterInfluenceContent({
  state,
  progress,
  backgroundFreeTraitCost = 0,
  showFreeTraitMarkers = true,
}) {
  return `
    ${createInfluenceProgress(
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
      Pool compartilhado com Antecedentes.
    </small>

    ${createInfluenceList(
      state,
      progress,
      showFreeTraitMarkers
    )}

    ${createInfluenceCostNotice(
      backgroundFreeTraitCost,
      showFreeTraitMarkers
    )}
  `;
}
