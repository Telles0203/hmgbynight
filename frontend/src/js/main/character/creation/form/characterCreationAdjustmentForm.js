import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
  readCreationInteger,
} from "./characterCreationFormCommon.js";


export function createMeritsFlawsCreationEditor(
  character,
  state
) {
  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="meritsFlaws"
    >

      <div class="character-creation-inline-heading">

        <strong>
          Qualidades / Defeitos
        </strong>

      </div>

      <div class="character-creation-inline-number-grid">

        <label class="character-creation-inline-label">

          Pontos de Qualidades

          <input
            type="number"
            class="
              form-control
              form-control-sm
              bg-black
              text-light
              border-secondary
            "
            min="0"
            max="20"
            step="1"
            data-creation-number="meritPoints"
            value="${Number(
              state?.meritPoints ||
              0
            )}"
          >

        </label>

        <label class="character-creation-inline-label">

          Pontos de Defeitos

          <input
            type="number"
            class="
              form-control
              form-control-sm
              bg-black
              text-light
              border-secondary
            "
            min="0"
            max="20"
            step="1"
            data-creation-number="flawPoints"
            value="${Number(
              state?.flawPoints ||
              0
            )}"
          >

        </label>

      </div>

      <label class="form-check mt-2">

        <input
          type="checkbox"
          class="form-check-input"
          data-creation-checkbox="derangement"
          ${
            state?.derangement
              ? "checked"
              : ""
          }
        >

        <span class="form-check-label">
          Derangement utilizado na criação
        </span>

      </label>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function createSingleNumberCreationEditor(
  character,
  state,
  {
    section,
    field,
    title,
    minimum,
    maximum,
  }
) {
  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="${escapeSheetHtml(
        section
      )}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          ${escapeSheetHtml(
            title
          )}
        </strong>

      </div>

      <label class="character-creation-inline-label">

        Ajuste

        <input
          type="number"
          class="
            form-control
            form-control-sm
            bg-black
            text-light
            border-secondary
          "
          min="${minimum}"
          max="${maximum}"
          step="1"
          data-creation-number="${escapeSheetHtml(
            field
          )}"
          value="${Number(
            state?.[
              field
            ] ||
            0
          )}"
        >

      </label>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function readMeritsFlawsCreationSection(
  form,
  state
) {
  state.meritPoints =
    readCreationInteger(
      form,
      "meritPoints"
    );


  state.flawPoints =
    readCreationInteger(
      form,
      "flawPoints"
    );


  state.derangement =
    Boolean(
      form.querySelector(
        '[data-creation-checkbox="derangement"]'
      )?.checked
    );


  return state;
}


export function readSingleNumberCreationSection(
  form,
  state,
  field
) {
  state[
    field
  ] =
    readCreationInteger(
      form,
      field
    );


  return state;
}