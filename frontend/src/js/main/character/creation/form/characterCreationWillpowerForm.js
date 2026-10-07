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


function getWillpowerRules(
  character
) {
  const derived =
    character
      ?.draftCreation
      ?.derived ||
    character
      ?.creation
      ?.derived ||
    {};


  const generationRules =
    derived
      ?.generationRules ||
    {};


  const rawStart =
    Number(
      generationRules
        ?.willpowerStart
    );


  const rawMaximum =
    Number(
      derived
        ?.willpowerMaximum ??
      generationRules
        ?.willpowerMaximum
    );


  const start =
    Number.isInteger(
      rawStart
    ) &&
    rawStart >=
      0
      ? rawStart
      : 0;


  const maximum =
    Number.isInteger(
      rawMaximum
    ) &&
    rawMaximum >=
      start
      ? rawMaximum
      : start;


  return {
    start,
    maximum,
  };
}


function getWillpowerBonus(
  state
) {
  const value =
    Number(
      state
        ?.willpowerBonus
    );


  return Number.isInteger(
    value
  )
    ? Math.max(
        0,
        value
      )
    : 0;
}


function createWillpowerPips(
  start,
  current,
  maximum
) {
  return createCreationResourcePips({
    base:
      start,

    current,

    maximum,

    showSacrificed:
      false,
  });
}


export function createWillpowerCreationEditor(
  character,
  state
) {
  const {
    start,
    maximum,
  } =
    getWillpowerRules(
      character
    );


  const bonus =
    getWillpowerBonus(
      state
    );


  const current =
    start +
    bonus;


  const belowMaximum =
    current <
    maximum;


  const aboveStart =
    bonus >
    0;


  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="willpower"
      data-creation-willpower-start="${start}"
      data-creation-willpower-maximum="${maximum}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          Força de Vontade
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
          data-character-creation-willpower-action="decrease"
          ${
            aboveStart
              ? ""
              : "disabled"
          }
          aria-label="Diminuir Força de Vontade"
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
            data-creation-willpower-pips
          >
            ${createWillpowerPips(
              start,
              current,
              maximum
            )}
          </div>

          <div
            class="
              small
              fw-semibold
              ${
                current >
                  maximum
                  ? "text-danger"
                  : "text-light"
              }
            "
            data-creation-willpower-value
          >
            ${escapeSheetHtml(
              current
            )}/${escapeSheetHtml(
              maximum
            )}
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
          data-character-creation-willpower-action="increase"
          ${
            belowMaximum
              ? ""
              : "disabled"
          }
          aria-label="Aumentar Força de Vontade"
          title="Aumentar"
        >
          +
        </button>

      </div>

      <input
        type="hidden"
        data-creation-number="willpowerBonus"
        value="${bonus}"
      >

      <div
        class="
          small
          text-secondary
          text-center
        "
      >
        Valor inicial:
        ${escapeSheetHtml(
          start
        )}
        ·
        Máximo da Geração:
        ${escapeSheetHtml(
          maximum
        )}
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


function refreshWillpowerCreationEditor(
  form
) {
  if (
    !form
  ) {
    return;
  }


  const start =
    Number(
      form.dataset
        .creationWillpowerStart
    );


  const maximum =
    Number(
      form.dataset
        .creationWillpowerMaximum
    );


  const input =
    form.querySelector(
      '[data-creation-number="willpowerBonus"]'
    );


  const bonus =
    Number(
      input?.value
    );


  const normalizedBonus =
    Number.isInteger(
      bonus
    )
      ? Math.max(
          0,
          bonus
        )
      : 0;


  const current =
    start +
    normalizedBonus;


  const pips =
    form.querySelector(
      "[data-creation-willpower-pips]"
    );


  const value =
    form.querySelector(
      "[data-creation-willpower-value]"
    );


  const decreaseButton =
    form.querySelector(
      '[data-character-creation-willpower-action="decrease"]'
    );


  const increaseButton =
    form.querySelector(
      '[data-character-creation-willpower-action="increase"]'
    );


  if (
    pips
  ) {
    pips.innerHTML =
      createWillpowerPips(
        start,
        current,
        maximum
      );
  }


  if (
    value
  ) {
    value.textContent =
      `${current}/${maximum}`;


    value.classList.toggle(
      "text-danger",
      current >
        maximum
    );


    value.classList.toggle(
      "text-light",
      current <=
        maximum
    );
  }


  if (
    decreaseButton
  ) {
    decreaseButton.disabled =
      normalizedBonus <=
      0;
  }


  if (
    increaseButton
  ) {
    increaseButton.disabled =
      current >=
      maximum;
  }
}


export function adjustWillpowerCreation(
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
      '[data-creation-number="willpowerBonus"]'
    );


  if (
    !input
  ) {
    return;
  }


  const start =
    Number(
      form.dataset
        .creationWillpowerStart
    );


  const maximum =
    Number(
      form.dataset
        .creationWillpowerMaximum
    );


  let bonus =
    Number(
      input.value
    );


  if (
    !Number.isInteger(
      bonus
    )
  ) {
    bonus =
      0;
  }


  bonus =
    Math.max(
      0,
      bonus
    );


  const action =
    String(
      button.dataset
        .characterCreationWillpowerAction ||
      ""
    );


  const current =
    start +
    bonus;


  if (
    action ===
    "increase"
  ) {
    if (
      current >=
      maximum
    ) {
      refreshWillpowerCreationEditor(
        form
      );


      return;
    }


    bonus +=
      1;
  }


  if (
    action ===
    "decrease"
  ) {
    if (
      bonus <=
      0
    ) {
      refreshWillpowerCreationEditor(
        form
      );


      return;
    }


    bonus -=
      1;
  }


  input.value =
    String(
      bonus
    );


  refreshWillpowerCreationEditor(
    form
  );
}


export function readWillpowerCreationSection(
  form,
  state
) {
  state.willpowerBonus =
    readCreationInteger(
      form,
      "willpowerBonus"
    );


  return state;
}
