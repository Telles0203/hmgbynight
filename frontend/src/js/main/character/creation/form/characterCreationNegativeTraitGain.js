import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";


function normalizeCount(
  value
) {
  const count =
    Number(
      value
    );


  return Number.isInteger(
    count
  ) &&
  count >
    0
    ? count
    : 0;
}


export function createNegativeTraitGainNotice(
  count
) {
  const normalized =
    normalizeCount(
      count
    );


  return `
    <small
      class="
        character-free-trait-inline-gain
        ${normalized > 0
          ? ""
          : "d-none"}
      "
      data-creation-negative-trait-gain
    >
      ${normalized > 0
        ? `Ganho da criação: +${normalized} Free Trait${normalized === 1 ? "" : "s"}`
        : ""}
    </small>
  `;
}


export function getNegativeTraitGain(
  form
) {
  return form
    ?.querySelectorAll(
      "[data-creation-negative-trait-value]"
    )
    .length ||
    0;
}


export function refreshNegativeTraitGain(
  form
) {
  if (!form) {
    return;
  }


  const element =
    form.querySelector(
      "[data-creation-negative-trait-gain]"
    );


  if (!element) {
    return;
  }


  const gain =
    getNegativeTraitGain(
      form
    );


  if (
    gain <=
    0
  ) {
    element.textContent =
      "";

    element.classList.add(
      "d-none"
    );


    return;
  }


  element.textContent =
    `Ganho da criação: +${gain} Free Trait${gain === 1 ? "" : "s"}`;


  element.classList.remove(
    "d-none"
  );
}


export function createSavedNegativeTraitGainNotice(
  count
) {
  const normalized =
    normalizeCount(
      count
    );


  if (
    normalized <=
    0
  ) {
    return "";
  }


  return `
    <small class="character-free-trait-inline-gain">
      Ganho da criação:
      +${escapeSheetHtml(
        normalized
      )} Free Trait${normalized === 1 ? "" : "s"}
    </small>
  `;
}
