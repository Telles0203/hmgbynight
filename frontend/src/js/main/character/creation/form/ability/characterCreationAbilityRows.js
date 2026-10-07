import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getAbilityDisplayLabel,
  parseAbilityEntryKey,
} from "../../data/abilityCatalog.js";

import {
  createAbilityOptions,
  createAbilityFocusEditor,
} from "./characterCreationAbilityCatalog.js";

import {
  createEffectiveAbilityRows,
} from "./characterCreationAbilityEffective.js";

import {
  readAbilityFocus,
} from "./characterCreationAbilityRead.js";


function normalizeGrantLevel(
  value
) {
  const level =
    Number(
      value
    );


  return Number.isInteger(
    level
  ) &&
  level >
    0
    ? level
    : 0;
}


function createAbilitySummary(
  entryKey,
  level,
  specialization,
  expanded,
  grantedLevel
) {
  const label =
    entryKey
      ? getAbilityDisplayLabel(
          entryKey
        )
      : "Nova Habilidade";


  const clanGranted =
    grantedLevel >
    0;


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

        ${clanGranted
          ? `
            <small
              class="
                character-creation-clan-grant-badge
              "
            >
              Clã +${grantedLevel}
            </small>
          `
          : ""}

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

      ${!clanGranted
        ? `
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
        `
        : ""}

    </div>
  `;
}


function createAbilityEditor(
  parsed,
  normalizedLevel,
  specialization,
  maximum,
  expanded,
  grantedLevel
) {
  const selected =
    Boolean(
      parsed.ability
    );


  const clanGranted =
    grantedLevel >
    0;


  const minimum =
    clanGranted
      ? grantedLevel
      : 1;


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
          ${clanGranted
            ? "disabled"
            : ""}
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
          normalizedLevel <=
            minimum
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

      ${clanGranted
        ? `
          <small
            class="
              character-creation-clan-choice-pending
            "
          >
            Nível mínimo do clã:
            ${grantedLevel}
          </small>
        `
        : ""}

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

        ${!clanGranted
          ? `
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
          `
          : ""}

      </div>

    </div>
  `;
}


export function createAbilityRow(
  entryKey = "",
  level = 1,
  specialization = "",
  maximum = 5,
  expanded = !entryKey,
  grantedLevel = 0,
  freeTraitLevel = 0
) {
  const parsed =
    parseAbilityEntryKey(
      entryKey
    );


  const normalizedGrant =
    normalizeGrantLevel(
      grantedLevel
    );


  const minimum =
    normalizedGrant >
    0
      ? normalizedGrant
      : 1;


  const normalizedLevel =
    Number.isInteger(
      Number(
        level
      )
    )
      ? Math.max(
          minimum,
          Math.min(
            maximum,
            Number(
              level
            )
          )
        )
      : minimum;


  return `
    <div
      class="
        character-creation-map-row
        character-creation-ability-row
        ${expanded
          ? "is-expanded"
          : ""}
        ${freeTraitLevel > 0
          ? "is-free-trait-spend"
          : ""}
      "
      data-creation-map="abilities"
      data-creation-map-type="ability"
      data-creation-ability-base="${escapeSheetHtml(
        parsed.ability
      )}"
      data-creation-ability-grant="${normalizedGrant}"
      data-creation-free-trait-level="${Math.max(
        0,
        Number(
          freeTraitLevel
        ) ||
        0
      )}"
    >

      ${createAbilitySummary(
        entryKey,
        normalizedLevel,
        specialization,
        expanded,
        normalizedGrant
      )}

      ${createAbilityEditor(
        parsed,
        normalizedLevel,
        specialization,
        maximum,
        expanded,
        normalizedGrant
      )}

    </div>
  `;
}


export function createAbilityRows(
  values,
  specializations,
  maximum,
  grants = {},
  freeTraitPurchases = {}
) {
  const entries =
    createEffectiveAbilityRows(
      values,
      specializations,
      grants
    )
      .sort(
        (
          first,
          second
        ) =>
          getAbilityDisplayLabel(
            first.entryKey
          ).localeCompare(
            getAbilityDisplayLabel(
              second.entryKey
            )
          )
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
      true,
      0
    );
  }


  return entries
    .map(
      (
        entry
      ) =>
        createAbilityRow(
          entry.entryKey,
          entry.effectiveLevel,
          entry.specialization,
          maximum,
          false,
          entry.grantedLevel,
          freeTraitPurchases[
            entry.entryKey
          ] ||
          0
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
