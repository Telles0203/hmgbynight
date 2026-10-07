import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
} from "./characterCreationFormCommon.js";


function getAbilityOptions() {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.abilities;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


function createAbilityOptions(
  selectedValue = ""
) {
  const selected =
    String(
      selectedValue ||
      ""
    );


  return [
    `
      <option value="">
        Selecione uma Habilidade
      </option>
    `,

    ...getAbilityOptions()
      .map(
        (
          ability
        ) => {
          const value =
            String(
              ability?.value ||
              ""
            );


          const label =
            String(
              ability?.label ||
              value
            );


          return `
            <option
              value="${escapeSheetHtml(
                value
              )}"
              ${value === selected
                ? "selected"
                : ""}
            >
              ${escapeSheetHtml(
                label
              )}
            </option>
          `;
        }
      ),
  ].join("");
}


function createAbilityRow(
  ability = "",
  level = 1
) {
  const normalizedLevel =
    Number.isInteger(
      Number(
        level
      )
    )
      ? Math.max(
          1,
          Number(
            level
          )
        )
      : 1;


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

      <input
        type="number"
        class="
          form-control
          form-control-sm
          bg-black
          text-light
          border-secondary
          character-creation-map-level
        "
        data-creation-ability-level
        min="1"
        max="20"
        step="1"
        value="${escapeSheetHtml(
          normalizedLevel
        )}"
        aria-label="Nível da Habilidade"
      >

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


function createAbilityRows(
  values
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
    return createAbilityRow();
  }


  return entries
    .map(
      ([
        ability,
        level,
      ]) =>
        createAbilityRow(
          ability,
          level
        )
    )
    .join("");
}


export function createAbilitiesCreationEditor(
  character,
  state
) {
  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="abilities"
    >

      <div class="character-creation-inline-heading">
        <strong>
          Habilidades
        </strong>
      </div>

      <div class="character-creation-map-editor">

        <div class="character-creation-editor-heading">

          <span>
            Habilidades
          </span>

          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            data-character-creation-add-row="abilities"
            data-character-creation-add-type="ability"
          >
            + Adicionar
          </button>

        </div>

        <div
          class="character-creation-map-rows"
          data-character-creation-map-container="abilities"
        >
          ${createAbilityRows(
            state?.abilities
          )}
        </div>

      </div>

      <div class="small text-secondary mt-2">
        Focos e Especializações serão configurados nas próximas etapas.
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function appendCharacterCreationAbilityRow(
  container
) {
  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createAbilityRow();


  const row =
    wrapper.firstElementChild;


  if (!row) {
    return;
  }


  container.appendChild(
    row
  );


  row.querySelector(
    "[data-creation-ability-key]"
  )?.focus();
}


function readAbilityMap(
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
            )?.value
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
            level;
        }
      }
    );


  return abilities;
}


export function readAbilitiesCreationSection(
  form,
  state
) {
  const abilities =
    readAbilityMap(
      form
    );


  state.abilities =
    abilities;


  const currentSpecializations =
    state.specializations &&
    typeof state.specializations ===
      "object" &&
    !Array.isArray(
      state.specializations
    )
      ? state.specializations
      : {};


  state.specializations =
    Object.fromEntries(
      Object.entries(
        currentSpecializations
      ).filter(
        ([
          ability,
        ]) =>
          Object.prototype
            .hasOwnProperty
            .call(
              abilities,
              ability
            )
      )
    );


  return state;
}
