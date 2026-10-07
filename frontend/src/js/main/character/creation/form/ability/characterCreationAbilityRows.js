import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  abilityRequiresFocus,
  createAbilityEntryKey,
  getAbilityLabel,
  parseAbilityEntryKey,
} from "../../data/abilityCatalog.js";

import {
  createAbilityOptions,
  createAbilityFocusEditor,
} from "./characterCreationAbilityCatalog.js";


function readAbilityFocus(
  row
) {
  const ability =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    !abilityRequiresFocus(
      ability
    )
  ) {
    return "";
  }


  const select =
    row.querySelector(
      "[data-creation-ability-focus]"
    );


  const selected =
    String(
      select?.value ||
      ""
    );


  if (
    selected !==
    "__custom__"
  ) {
    return selected
      .trim()
      .toLowerCase();
  }


  return String(
    row.querySelector(
      "[data-creation-ability-custom-focus]"
    )?.value ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}


export function createAbilityRow(
  entryKey = "",
  level = 1,
  maximum = 5
) {
  const parsed =
    parseAbilityEntryKey(
      entryKey
    );


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
      parsed.ability
    );


  return `
    <div
      class="character-creation-map-row"
      data-creation-map="abilities"
      data-creation-map-type="ability"
      data-creation-ability-base="${escapeSheetHtml(
        parsed.ability
      )}"
    >

      <div
        class="
          d-flex
          flex-column
          gap-2
          flex-grow-1
        "
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
            parsed.ability
          )}
        </select>

        ${createAbilityFocusEditor(
          parsed.ability,
          parsed.focus
        )}

      </div>

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
        entryKey,
        level,
      ]) =>
        createAbilityRow(
          entryKey,
          level,
          maximum
        )
    )
    .join("");
}


export function refreshCharacterCreationAbilityFocus(
  row
) {
  if (!row) {
    return;
  }


  const ability =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const previousAbility =
    String(
      row.dataset
        .creationAbilityBase ||
      ""
    )
      .trim()
      .toLowerCase();


  const focus =
    previousAbility ===
    ability
      ? readAbilityFocus(
          row
        )
      : "";


  const container =
    row.querySelector(
      "[data-creation-ability-focus-container]"
    );


  if (container) {
    container.outerHTML =
      createAbilityFocusEditor(
        ability,
        focus
      );
  }


  row.dataset
    .creationAbilityBase =
    ability;
}


export function refreshCharacterCreationAbilityCustomFocus(
  row
) {
  if (!row) {
    return;
  }


  const select =
    row.querySelector(
      "[data-creation-ability-focus]"
    );


  const input =
    row.querySelector(
      "[data-creation-ability-custom-focus]"
    );


  if (!input) {
    return;
  }


  const custom =
    select?.value ===
    "__custom__";


  input.classList.toggle(
    "d-none",
    !custom
  );


  if (!custom) {
    input.value =
      "";
  }


  if (custom) {
    input.focus();
  }
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


        if (!ability) {
          return;
        }


        const focus =
          readAbilityFocus(
            row
          );


        if (
          abilityRequiresFocus(
            ability
          ) &&
          !focus
        ) {
          throw new Error(
            `Selecione um foco para ${getAbilityLabel(
              ability
            )}.`
          );
        }


        const entryKey =
          createAbilityEntryKey(
            ability,
            focus
          );


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          );


        if (
          entryKey &&
          Number.isInteger(
            level
          ) &&
          level >
            0
        ) {
          abilities[
            entryKey
          ] =
            (
              abilities[
                entryKey
              ] ||
              0
            ) +
            level;
        }
      }
    );


  return abilities;
}
