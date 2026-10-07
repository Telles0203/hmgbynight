import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationResourcePips,
} from "../resource/characterCreationResourcePips.js";

import {
  createCreationActions,
  readCreationInteger,
} from "./characterCreationFormCommon.js";


const MORALITY_MINIMUM =
  0;


const MORALITY_MAXIMUM =
  10;


function getMoralityAdjustment(
  state
) {
  const value =
    Number(
      state
        ?.moralityAdjustment
    );


  return Number.isInteger(
    value
  )
    ? value
    : 0;
}


function getMoralityBase(
  character,
  state
) {
  const creation =
    character
      ?.draftCreation ||
    character
      ?.creation ||
    {};


  const sectionBase =
    creation
      ?.sections
      ?.morality
      ?.base;


  if (
    Number.isInteger(
      sectionBase
    )
  ) {
    return sectionBase;
  }


  const current =
    creation
      ?.derived
      ?.morality;


  const adjustment =
    getMoralityAdjustment(
      state
    );


  if (
    Number.isInteger(
      current
    )
  ) {
    return (
      current -
      adjustment
    );
  }


  return 0;
}


function normalizeMoralityValue(
  value
) {
  const normalized =
    Number(
      value
    );


  if (
    !Number.isInteger(
      normalized
    )
  ) {
    return MORALITY_MINIMUM;
  }


  return Math.max(
    MORALITY_MINIMUM,
    Math.min(
      MORALITY_MAXIMUM,
      normalized
    )
  );
}


function createMoralityPips(
  base,
  current
) {
  return createCreationResourcePips({
    base,
    current,

    maximum:
      MORALITY_MAXIMUM,
  });
}


export function createMoralityCreationEditor(
  character,
  state
) {
  const base =
    getMoralityBase(
      character,
      state
    );


  const adjustment =
    getMoralityAdjustment(
      state
    );


  const current =
    normalizeMoralityValue(
      base +
      adjustment
    );


  const normalizedAdjustment =
    current -
    base;


  const title =
    character
      ?.moralityPathLabel ||
    "Humanidade";


  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="morality"
      data-creation-morality-base="${base}"
      data-creation-morality-minimum="${MORALITY_MINIMUM}"
      data-creation-morality-maximum="${MORALITY_MAXIMUM}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          ${escapeSheetHtml(
            title
          )}
        </strong>

      </div>

      <div
        class="
          d-flex
          align-items-center
          justify-content-center
          gap-3
          py-2
        "
      >

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            px-3
          "
          data-character-creation-morality-action="decrease"
          ${
            current >
              MORALITY_MINIMUM
              ? ""
              : "disabled"
          }
          aria-label="Diminuir ${escapeSheetHtml(
            title
          )}"
          title="Diminuir"
        >
          −
        </button>

        <div
          class="
            d-flex
            flex-column
            align-items-center
            gap-2
            flex-grow-1
          "
        >

          <div
            class="character-sheet-pips"
            data-creation-morality-pips
          >
            ${createMoralityPips(
              base,
              current
            )}
          </div>

          <div
            class="
              small
              fw-semibold
              text-light
            "
            data-creation-morality-value
          >
            ${escapeSheetHtml(
              current
            )}/${MORALITY_MAXIMUM}
          </div>

        </div>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            px-3
          "
          data-character-creation-morality-action="increase"
          ${
            current <
              MORALITY_MAXIMUM
              ? ""
              : "disabled"
          }
          aria-label="Aumentar ${escapeSheetHtml(
            title
          )}"
          title="Aumentar"
        >
          +
        </button>

      </div>

      <input
        type="hidden"
        data-creation-number="moralityAdjustment"
        value="${normalizedAdjustment}"
      >

      <div
        class="
          small
          text-secondary
          text-center
        "
      >
        Valor base:
        ${escapeSheetHtml(
          base
        )}
        ·
        Limite:
        ${MORALITY_MINIMUM}–${MORALITY_MAXIMUM}
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


function refreshMoralityCreationEditor(
  form
) {
  if (
    !form
  ) {
    return;
  }


  const base =
    Number(
      form.dataset
        .creationMoralityBase
    );


  const input =
    form.querySelector(
      '[data-creation-number="moralityAdjustment"]'
    );


  let adjustment =
    Number(
      input?.value
    );


  if (
    !Number.isInteger(
      adjustment
    )
  ) {
    adjustment =
      0;
  }


  const current =
    normalizeMoralityValue(
      base +
      adjustment
    );


  const normalizedAdjustment =
    current -
    base;


  if (
    input
  ) {
    input.value =
      String(
        normalizedAdjustment
      );
  }


  const pips =
    form.querySelector(
      "[data-creation-morality-pips]"
    );


  const value =
    form.querySelector(
      "[data-creation-morality-value]"
    );


  const decreaseButton =
    form.querySelector(
      '[data-character-creation-morality-action="decrease"]'
    );


  const increaseButton =
    form.querySelector(
      '[data-character-creation-morality-action="increase"]'
    );


  if (
    pips
  ) {
    pips.innerHTML =
      createMoralityPips(
        base,
        current
      );
  }


  if (
    value
  ) {
    value.textContent =
      `${current}/${MORALITY_MAXIMUM}`;
  }


  if (
    decreaseButton
  ) {
    decreaseButton.disabled =
      current <=
      MORALITY_MINIMUM;
  }


  if (
    increaseButton
  ) {
    increaseButton.disabled =
      current >=
      MORALITY_MAXIMUM;
  }
}


export function adjustMoralityCreation(
  button
) {
  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !form
  ) {
    return;
  }


  const input =
    form.querySelector(
      '[data-creation-number="moralityAdjustment"]'
    );


  if (
    !input
  ) {
    return;
  }


  const base =
    Number(
      form.dataset
        .creationMoralityBase
    );


  let adjustment =
    Number(
      input.value
    );


  if (
    !Number.isInteger(
      adjustment
    )
  ) {
    adjustment =
      0;
  }


  const current =
    normalizeMoralityValue(
      base +
      adjustment
    );


  const action =
    String(
      button.dataset
        .characterCreationMoralityAction ||
      ""
    );


  if (
    action ===
    "increase"
  ) {
    if (
      current >=
      MORALITY_MAXIMUM
    ) {
      refreshMoralityCreationEditor(
        form
      );


      return;
    }


    adjustment +=
      1;
  }


  if (
    action ===
    "decrease"
  ) {
    if (
      current <=
      MORALITY_MINIMUM
    ) {
      refreshMoralityCreationEditor(
        form
      );


      return;
    }


    adjustment -=
      1;
  }


  input.value =
    String(
      adjustment
    );


  refreshMoralityCreationEditor(
    form
  );
}


export function readMoralityCreationSection(
  form,
  state
) {
  state.moralityAdjustment =
    readCreationInteger(
      form,
      "moralityAdjustment"
    );


  return state;
}
