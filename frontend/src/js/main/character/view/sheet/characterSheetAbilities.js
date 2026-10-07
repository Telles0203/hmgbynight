import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  createCreationMapList,
} from "./characterSheetCreationLists.js";

import {
  createFreeTraitCostNotice,
} from "./characterSheetCreationResources.js";

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


function createAbilityLabels(
  state,
  fallbackLabels
) {
  return Object.fromEntries(
    Object.keys(
      state?.abilities ||
      {}
    ).map(
      (
        entryKey
      ) => [
        entryKey,

        getAbilityDisplayLabel(
          entryKey
        ) ||
        fallbackLabels?.[
          entryKey
        ] ||
        entryKey,
      ]
    )
  );
}


export function createCharacterAbilityContent({
  state,
  progress,
  freeTraitCost,
  labels,
}) {
  const normalized =
    normalizeAbilityProgress(
      progress,
      state
    );


  const highlight =
    normalized.spent >
    normalized.total;


  const abilityLabels =
    createAbilityLabels(
      state,
      labels
    );


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

    ${createCreationMapList(
      state?.abilities,
      "Nenhuma habilidade cadastrada.",
      state?.specializations,
      abilityLabels
    )}

    ${createFreeTraitCostNotice(
      freeTraitCost
    )}
  `;
}
