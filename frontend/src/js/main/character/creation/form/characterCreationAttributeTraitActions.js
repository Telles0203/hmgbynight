import {
  refreshNegativeTraitGain,
} from "./characterCreationNegativeTraitGain.js";

import {
  createSelectedTraitRow,
  formatAttributeTraitSummary,
  EXTRA_TRAIT_HELP_TEXT,
} from "./characterCreationAttributeTraitPicker.js";


function getPositiveTraitPicker(
  form
) {
  return form?.querySelector(
    '[data-creation-attribute-negative="false"]'
  ) ||
  null;
}


function getPositiveTraitRows(
  form
) {
  const picker =
    getPositiveTraitPicker(
      form
    );


  if (
    !picker
  ) {
    return [];
  }


  return Array.from(
    picker.querySelectorAll(
      "[data-creation-attribute-trait-row]"
    )
  );
}


function getPositiveTraitCount(
  form
) {
  return form
    ?.querySelectorAll(
      "[data-creation-attribute-trait-value]"
    )
    .length ||
    0;
}


function getBaseTarget(
  form
) {
  const target =
    Number(
      form
        ?.dataset
        ?.creationAttributeBaseTarget
    );


  return Number.isInteger(
    target
  ) &&
  target >
    0
    ? target
    : 0;
}


function getGenerationMaximum(
  form
) {
  const maximum =
    Number(
      form
        ?.dataset
        ?.creationAttributeGenerationMaximum
    );


  return Number.isInteger(
    maximum
  ) &&
  maximum >
    0
    ? maximum
    : 10;
}


function refreshAttributeTraitOverflow(
  form
) {
  const target =
    getBaseTarget(
      form
    );


  const rows =
    getPositiveTraitRows(
      form
    );


  rows.forEach(
    (
      row,
      index
    ) => {
      const extra =
        target >
          0 &&
        index >=
          target;


      row.classList.toggle(
        "is-free-trait-spend",
        extra
      );


      if (
        extra
      ) {
        row.setAttribute(
          "title",
          EXTRA_TRAIT_HELP_TEXT
        );
      } else {
        row.removeAttribute(
          "title"
        );
      }
    }
  );


  const current =
    getPositiveTraitCount(
      form
    );


  const summary =
    form?.querySelector(
      "[data-creation-attribute-summary]"
    );


  if (
    summary
  ) {
    summary.classList.toggle(
      "is-free-trait-spend",
      target >
        0 &&
      current >
        target
    );
  }
}


function refreshAddButtonState(
  form
) {
  const maximum =
    getGenerationMaximum(
      form
    );


  const current =
    getPositiveTraitCount(
      form
    );


  const picker =
    getPositiveTraitPicker(
      form
    );


  const button =
    picker?.querySelector(
      "[data-character-creation-add-attribute-trait]"
    );


  const select =
    picker?.querySelector(
      "[data-creation-attribute-trait-choice]"
    );


  const reachedMaximum =
    current >=
    maximum;


  if (
    button
  ) {
    button.disabled =
      reachedMaximum;
  }


  if (
    select
  ) {
    select.disabled =
      reachedMaximum;
  }
}


export function refreshAttributeTraitSummary(
  form
) {
  if (
    !form
  ) {
    return;
  }


  const current =
    getPositiveTraitCount(
      form
    );


  const target =
    getBaseTarget(
      form
    );


  const maximum =
    getGenerationMaximum(
      form
    );


  const summary =
    form.querySelector(
      "[data-creation-attribute-summary]"
    );


  if (
    summary
  ) {
    summary.textContent =
      formatAttributeTraitSummary(
        current,
        target,
        maximum
      );
  }


  refreshAttributeTraitOverflow(
    form
  );


  refreshAddButtonState(
    form
  );


  refreshNegativeTraitGain(
    form
  );
}


export function updateAttributeTraitTarget(
  form,
  target
) {
  if (
    !form
  ) {
    return;
  }


  form.dataset
    .creationAttributeBaseTarget =
      String(
        Number.isInteger(
          Number(
            target
          )
        )
          ? Number(
              target
            )
          : 0
      );


  refreshAttributeTraitSummary(
    form
  );
}


export function readSelectedTraitValues(
  form,
  selector
) {
  return Array.from(
    form.querySelectorAll(
      selector
    )
  )
    .map(
      (
        input
      ) =>
        String(
          input.value ||
          ""
        ).trim()
    )
    .filter(
      Boolean
    );
}


export function addAttributeTraitSelection(
  button
) {
  const picker =
    button.closest(
      "[data-creation-attribute-trait-picker]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !picker ||
    !form
  ) {
    return;
  }


  const select =
    picker.querySelector(
      "[data-creation-attribute-trait-choice]"
    );


  const list =
    picker.querySelector(
      "[data-creation-attribute-trait-list]"
    );


  const value =
    String(
      select?.value ||
      ""
    ).trim();


  const category =
    String(
      picker.dataset
        .creationAttributeCategory ||
      ""
    );


  const negative =
    picker.dataset
      .creationAttributeNegative ===
    "true";


  if (
    !select ||
    !list ||
    !value ||
    !category
  ) {
    return;
  }


  if (
    !negative &&
    getPositiveTraitCount(
      form
    ) >=
      getGenerationMaximum(
        form
      )
  ) {
    refreshAttributeTraitSummary(
      form
    );


    return;
  }


  list
    .querySelector(
      "[data-creation-attribute-trait-empty]"
    )
    ?.remove();


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createSelectedTraitRow({
      category,
      value,
      negative,
    });


  const row =
    wrapper.firstElementChild;


  if (
    row
  ) {
    list.appendChild(
      row
    );
  }


  select.value =
    "";


  refreshAttributeTraitSummary(
    form
  );
}


export function removeAttributeTraitSelection(
  button
) {
  const picker =
    button.closest(
      "[data-creation-attribute-trait-picker]"
    );


  const row =
    button.closest(
      "[data-creation-attribute-trait-row]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const list =
    picker?.querySelector(
      "[data-creation-attribute-trait-list]"
    );


  if (
    !picker ||
    !row ||
    !list
  ) {
    return;
  }


  row.remove();


  if (
    !list.querySelector(
      "[data-creation-attribute-trait-row]"
    )
  ) {
    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "character-sheet-empty py-2";


    empty.setAttribute(
      "data-creation-attribute-trait-empty",
      ""
    );


    empty.textContent =
      "Nenhum Trait selecionado.";


    list.appendChild(
      empty
    );
  }


  refreshAttributeTraitSummary(
    form
  );
}
