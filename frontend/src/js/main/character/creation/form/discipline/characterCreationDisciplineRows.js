import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getDisciplineLabel,
} from "../../data/clanRuleCatalog.js";


export function createDisciplineRow(
  entry,
  maximum
) {
  const level =
    Number.isInteger(
      entry.level
    )
      ? Math.max(
          0,
          Math.min(
            maximum,
            entry.level
          )
        )
      : 0;


  return `
    <div
      class="
        character-creation-discipline-row
      "
      data-creation-discipline-row
      data-creation-discipline-key="${escapeSheetHtml(
        entry.discipline
      )}"
      data-creation-discipline-clan="${entry.clan
        ? "true"
        : "false"}"
    >

      <div
        class="
          character-creation-discipline-name
        "
      >

        <span>
          ${escapeSheetHtml(
            getDisciplineLabel(
              entry.discipline
            )
          )}
        </span>

        <small>
          ${entry.clan
            ? "Clã"
            : "Fora do clã"}
        </small>

      </div>

      <div
        class="
          character-creation-discipline-controls
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
          data-character-creation-discipline-action="decrease"
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
          data-creation-discipline-level
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
          data-character-creation-discipline-action="increase"
          ${level >= maximum
            ? "disabled"
            : ""}
        >
          +
        </button>

      </div>

    </div>
  `;
}


export function createDisciplineRows(
  entries,
  maximum
) {
  return entries
    .map(
      (
        entry
      ) =>
        createDisciplineRow(
          entry,
          maximum
        )
    )
    .join("");
}


export function readFixedDisciplines(
  form
) {
  const disciplines =
    {};


  form
    .querySelectorAll(
      "[data-creation-discipline-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationDisciplineKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const level =
          Number(
            row.querySelector(
              "[data-creation-discipline-level]"
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
          disciplines[
            key
          ] =
            level;
        }
      }
    );


  return disciplines;
}
