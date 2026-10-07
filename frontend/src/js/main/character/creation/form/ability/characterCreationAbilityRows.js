import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  abilityRequiresFocus,
  createAbilityEntryKey,
  getAbilityDisplayLabel,
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


function getAbilityEntryKeyFromRow(
  row,
  {
    requireFocus = false,
  } = {}
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


  if (!ability) {
    return "";
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
    if (
      requireFocus
    ) {
      throw new Error(
        `Selecione um foco para ${getAbilityLabel(
          ability
        )}.`
      );
    }


    return "";
  }


  return createAbilityEntryKey(
    ability,
    focus
  );
}


function createAbilitySummary(
  entryKey,
  level,
  specialization,
  expanded
) {
  const label =
    entryKey
      ? getAbilityDisplayLabel(
          entryKey
        )
      : "Nova Habilidade";


  return `
    <div
      class="
        character-creation-ability-summary
        ${expanded
          ? "d-none"
          : ""}
      "
      data-creation-ability-summary
    >

      <div
        class="
          character-creation-ability-summary-name
        "
      >

        <span
          class="
            character-creation-specialization
            ${specialization
              ? ""
              : "d-none"}
          "
          data-creation-ability-summary-specialization
        >
          ${specialization
            ? `[${escapeSheetHtml(
                specialization
              )}]`
            : ""}
        </span>

        <span
          data-creation-ability-summary-label
        >
          ${escapeSheetHtml(
            label
          )}
        </span>

      </div>

      <span
        class="
          character-creation-ability-summary-level
        "
        data-creation-ability-summary-level
      >
        ${level}
      </span>

      <button
        type="button"
        class="
          character-creation-ability-edit
        "
        data-character-creation-ability-row-action="edit"
        aria-label="Editar Habilidade"
        title="Editar Habilidade"
      >
        ✎
      </button>

      <button
        type="button"
        class="
          btn
          btn-outline-danger
          btn-sm
          character-creation-ability-remove
        "
        data-character-creation-remove-row
        aria-label="Remover Habilidade"
        title="Remover Habilidade"
      >
        ×
      </button>

    </div>
  `;
}


function createAbilityEditor(
  parsed,
  normalizedLevel,
  specialization,
  maximum,
  expanded
) {
  const selected =
    Boolean(
      parsed.ability
    );


  return `
    <div
      class="
        character-creation-ability-editor
        ${expanded
          ? ""
          : "d-none"}
      "
      data-creation-ability-editor
    >

      <div
        class="
          d-flex
          flex-column
          gap-2
          flex-grow-1
          character-creation-ability-fields
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

        <input
          type="text"
          class="
            form-control
            form-control-sm
            bg-black
            text-light
            border-secondary
          "
          data-creation-ability-specialization
          maxlength="120"
          value="${escapeSheetHtml(
            specialization
          )}"
          placeholder="Especialização (opcional)"
          ${selected
            ? ""
            : "disabled"}
        >

      </div>

      <div
        class="
          character-creation-ability-level-controls
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

      <div
        class="
          character-creation-ability-editor-actions
        "
      >

        <button
          type="button"
          class="
            btn
            btn-outline-light
            btn-sm
          "
          data-character-creation-ability-row-action="conclude"
        >
          Concluir
        </button>

        <button
          type="button"
          class="
            btn
            btn-outline-danger
            btn-sm
          "
          data-character-creation-remove-row
        >
          Remover
        </button>

      </div>

    </div>
  `;
}


export function createAbilityRow(
  entryKey = "",
  level = 1,
  specialization = "",
  maximum = 5,
  expanded = !entryKey
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


  return `
    <div
      class="
        character-creation-map-row
        character-creation-ability-row
        ${expanded
          ? "is-expanded"
          : ""}
      "
      data-creation-map="abilities"
      data-creation-map-type="ability"
      data-creation-ability-base="${escapeSheetHtml(
        parsed.ability
      )}"
    >

      ${createAbilitySummary(
        entryKey,
        normalizedLevel,
        specialization,
        expanded
      )}

      ${createAbilityEditor(
        parsed,
        normalizedLevel,
        specialization,
        maximum,
        expanded
      )}

    </div>
  `;
}


export function createAbilityRows(
  values,
  specializations,
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
      "",
      maximum,
      true
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
          String(
            specializations?.[
              entryKey
            ] ||
            ""
          ),
          maximum,
          false
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


  const specialization =
    row.querySelector(
      "[data-creation-ability-specialization]"
    );


  if (specialization) {
    if (
      previousAbility !==
      ability
    ) {
      specialization.value =
        "";
    }


    specialization.disabled =
      !ability;
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
        const entryKey =
          getAbilityEntryKeyFromRow(
            row,
            {
              requireFocus:
                true,
            }
          );


        if (!entryKey) {
          return;
        }


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          );


        if (
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


export function readAbilitySpecializations(
  form
) {
  const specializations =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const entryKey =
          getAbilityEntryKeyFromRow(
            row,
            {
              requireFocus:
                true,
            }
          );


        if (!entryKey) {
          return;
        }


        const specialization =
          String(
            row.querySelector(
              "[data-creation-ability-specialization]"
            )?.value ||
            ""
          ).trim();


        if (
          specialization
        ) {
          specializations[
            entryKey
          ] =
            specialization;
        }
      }
    );


  return specializations;
}
