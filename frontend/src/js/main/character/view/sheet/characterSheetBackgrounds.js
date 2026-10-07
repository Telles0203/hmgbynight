import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getBackgroundLabel,
} from "../../creation/form/background/characterCreationBackgroundCatalog.js";


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


  const fallbackSpent =
    Object.values(
      state?.backgrounds ||
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


function createBackgroundList(
  state
) {
  const entries =
    Object.entries(
      state?.backgrounds ||
      {}
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
          getBackgroundLabel(
            first
          ).localeCompare(
            getBackgroundLabel(
              second
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
          ([
            background,
            level,
          ]) => `
            <div
              class="
                character-sheet-row
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
                    background
                  )
                )}
              </span>

              <span
                class="
                  character-sheet-value
                "
              >
                ${Number(
                  level
                )}
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
}) {
  return `
    ${createBackgroundProgress(
      progress,
      state
    )}

    ${createBackgroundList(
      state
    )}
  `;
}
