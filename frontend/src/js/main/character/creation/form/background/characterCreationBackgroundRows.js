import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getBackgroundLabel,
} from "./characterCreationBackgroundCatalog.js";


function createStandardBackgroundControls(
  level,
  maximum
) {
  return `
    <div
      class="
        character-creation-background-controls
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
        data-character-creation-background-action="decrease"
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
        data-creation-background-level
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
        data-character-creation-background-action="increase"
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
        data-character-creation-remove-background
        aria-label="Remover Antecedente"
        title="Remover Antecedente"
      >
        ×
      </button>

    </div>
  `;
}


function createInfluenceBackgroundControls(
  level
) {
  return `
    <div
      class="
        character-creation-background-controls
      "
    >
      <span
        class="
          fw-semibold
          text-center
        "
        data-creation-background-level
      >
        ${level}
      </span>
    </div>
  `;
}


export function createBackgroundRow(
  entry,
  maximum
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


  const influence =
    entry?.specialMode ===
    "influence";


  return `
    <div
      class="
        character-creation-background-row
      "
      data-creation-background-row
      data-creation-background-key="${escapeSheetHtml(
        entry?.background ||
        ""
      )}"
      data-creation-background-special-mode="${influence
        ? "influence"
        : "standard"}"
    >

      <div
        class="
          character-creation-background-name
        "
      >

        <span>
          ${escapeSheetHtml(
            getBackgroundLabel(
              entry?.background
            )
          )}
        </span>

        ${influence
          ? `
            <small
              class="
                character-background-special-badge
              "
            >
              Influências
            </small>
          `
          : ""}

      </div>

      ${influence
        ? createInfluenceBackgroundControls(
            level
          )
        : createStandardBackgroundControls(
            level,
            maximum
          )}

    </div>
  `;
}


export function createBackgroundRows(
  entries,
  maximum
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


  return entries
    .map(
      (
        entry
      ) =>
        createBackgroundRow(
          entry,
          maximum
        )
    )
    .join("");
}


export function readBackgrounds(
  form
) {
  const backgrounds =
    {};


  form
    .querySelectorAll(
      "[data-creation-background-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationBackgroundKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const level =
          Number(
            row.querySelector(
              "[data-creation-background-level]"
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
          backgrounds[
            key
          ] =
            level;
        }
      }
    );


  return backgrounds;
}
