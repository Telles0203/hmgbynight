import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getInfluenceLabel,
} from "./characterCreationInfluenceCatalog.js";


export function createInfluenceRow(
  entry,
  maximum,
  freeTraitLevel = 0
) {
  const level =
    Math.max(
      0,
      Math.min(
        maximum,
        Number(
          entry?.level
        ) ||
        0
      )
    );


  return `
    <div
      class="
        character-creation-influence-row
        ${freeTraitLevel > 0
          ? "is-free-trait-spend"
          : ""}
      "
      data-creation-influence-row
      data-creation-influence-key="${escapeSheetHtml(
        entry?.influence ||
        ""
      )}"
      data-creation-free-trait-level="${Math.max(
        0,
        Number(
          freeTraitLevel
        ) ||
        0
      )}"
    >

      <div
        class="
          character-creation-influence-name
        "
      >
        ${escapeSheetHtml(
          getInfluenceLabel(
            entry?.influence
          )
        )}
      </div>

      <div
        class="
          character-creation-influence-controls
        "
      >

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            py-0
            px-2
          "
          data-character-creation-influence-action="decrease"
          ${level <= 0
            ? "disabled"
            : ""}
        >
          −
        </button>

        <span
          class="
            fw-semibold
            text-center
          "
          data-creation-influence-level
        >
          ${level}
        </span>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            py-0
            px-2
          "
          data-character-creation-influence-action="increase"
          ${level >= maximum
            ? "disabled"
            : ""}
        >
          +
        </button>

        <button
          type="button"
          class="
            btn
            btn-outline-danger
            btn-sm
            py-0
            px-2
          "
          data-character-creation-remove-influence
          aria-label="Remover Influência"
          title="Remover Influência"
        >
          ×
        </button>

      </div>

    </div>
  `;
}


export function createInfluenceRows(
  entries,
  maximum,
  freeTraitPurchases = {}
) {
  if (
    !Array.isArray(
      entries
    ) ||
    entries.length ===
      0
  ) {
    return "";
  }


  return [
    ...entries,
  ]
    .sort(
      (
        first,
        second
      ) =>
        getInfluenceLabel(
          first?.influence
        ).localeCompare(
          getInfluenceLabel(
            second?.influence
          )
        )
    )
    .map(
      (
        entry
      ) =>
        createInfluenceRow(
          entry,
          maximum,
          freeTraitPurchases[
            entry.influence
          ] ||
          0
        )
    )
    .join("");
}


export function readInfluences(
  form
) {
  const influences =
    {};


  form
    .querySelectorAll(
      "[data-creation-influence-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationInfluenceKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const level =
          Number(
            row.querySelector(
              "[data-creation-influence-level]"
            )?.textContent
          );


        if (
          key &&
          Number.isInteger(
            level
          ) &&
          level >
            0
        ) {
          influences[
            key
          ] =
            level;
        }
      }
    );


  return influences;
}
