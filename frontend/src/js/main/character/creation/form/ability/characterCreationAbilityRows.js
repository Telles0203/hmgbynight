import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  createAbilityOptions,
} from "./characterCreationAbilityCatalog.js";


export function createAbilityRow(
  ability = "",
  level = 1,
  maximum = 5
) {
  const normalizedLevel =
    Number.isInteger(
      Number(
        level
      )
    )
      ? Math.max(
          1,
          Math.min(
            maximum,
            Number(
              level
            )
          )
        )
      : 1;


  const selected =
    Boolean(
      ability
    );


  return `
    <div
      class="character-creation-map-row"
      data-creation-map="abilities"
      data-creation-map-type="ability"
    >

      <select
        class="
          form-select
          form-select-sm
          bg-black
          text-light
          border-secondary
        "
        data-creation-ability-key
      >
        ${createAbilityOptions(
          ability
        )}
      </select>

      <div
        class="
          d-inline-flex
          align-items-center
          justify-content-end
          gap-2
          flex-shrink-0
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
          data-character-creation-ability-action="decrease"
          ${!selected ||
          normalizedLevel <= 1
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
          style="min-width: 1.5rem;"
          data-creation-ability-level
        >
          ${normalizedLevel}
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
          data-character-creation-ability-action="increase"
          ${!selected ||
          normalizedLevel >= maximum
            ? "disabled"
            : ""}
        >
          +
        </button>

      </div>

      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        data-character-creation-remove-row
        aria-label="Remover Habilidade"
        title="Remover Habilidade"
      >
        ×
      </button>

    </div>
  `;
}


export function createAbilityRows(
  values,
  maximum
) {
  const entries =
    Object.entries(
      values ||
      {}
    );


  if (
    entries.length ===
    0
  ) {
    return createAbilityRow(
      "",
      1,
      maximum
    );
  }


  return entries
    .map(
      ([
        ability,
        level,
      ]) =>
        createAbilityRow(
          ability,
          level,
          maximum
        )
    )
    .join("");
}


export function readAbilityMap(
  form
) {
  const abilities =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const ability =
          String(
            row.querySelector(
              "[data-creation-ability-key]"
            )?.value ||
            ""
          )
            .trim()
            .toLowerCase();


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          );


        if (
          ability &&
          Number.isInteger(
            level
          ) &&
          level >
            0
        ) {
          abilities[
            ability
          ] =
            (
              abilities[
                ability
              ] ||
              0
            ) +
            level;
        }
      }
    );


  return abilities;
}
