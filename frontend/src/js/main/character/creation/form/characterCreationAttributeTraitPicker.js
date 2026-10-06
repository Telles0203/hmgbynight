import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  getAttributeTraitCatalog,
  getAttributeTraitLabel,
} from "../data/attributeTraitCatalog.js";


function createPositiveTraitOptions(
  category
) {
  const catalog =
    getAttributeTraitCatalog(
      category
    );


  return `
    <option value="">
      Selecione um Trait
    </option>

    ${catalog
      .positive
      .map(
        (
          trait
        ) => `
          <option
            value="${escapeSheetHtml(
              trait.value
            )}"
          >
            ${escapeSheetHtml(
              `${trait.value} (${trait.type})`
            )}
          </option>
        `
      )
      .join("")}
  `;
}


function createNegativeTraitOptions(
  category
) {
  const catalog =
    getAttributeTraitCatalog(
      category
    );


  return `
    <option value="">
      Selecione um Trait Negativo
    </option>

    ${catalog
      .negative
      .map(
        (
          trait
        ) => `
          <option
            value="${escapeSheetHtml(
              trait
            )}"
          >
            ${escapeSheetHtml(
              trait
            )}
          </option>
        `
      )
      .join("")}
  `;
}


function createSelectedTraitRow({
  category,
  value,
  negative = false,
}) {
  const displayValue =
    negative
      ? String(
          value ||
          ""
        )
      : getAttributeTraitLabel(
          category,
          value
        );


  return `
    <div
      class="
        d-flex
        align-items-center
        justify-content-between
        gap-2
        border
        border-secondary
        rounded
        px-2
        py-1
      "
      data-creation-attribute-trait-row
    >

      <span class="small text-light">
        ${escapeSheetHtml(
          displayValue
        )}
      </span>

      <input
        type="hidden"
        value="${escapeSheetHtml(
          value
        )}"
        ${
          negative
            ? "data-creation-negative-trait-value"
            : "data-creation-attribute-trait-value"
        }
      >

      <button
        type="button"
        class="
          btn
          btn-outline-danger
          btn-sm
          py-0
          px-2
        "
        data-character-creation-remove-attribute-trait
        aria-label="Remover ${escapeSheetHtml(
          displayValue
        )}"
        title="Remover"
      >
        ×
      </button>

    </div>
  `;
}


function createSelectedTraitRows({
  category,
  values,
  negative = false,
}) {
  if (
    !Array.isArray(
      values
    ) ||
    values.length ===
      0
  ) {
    return `
      <div
        class="
          character-sheet-empty
          py-2
        "
        data-creation-attribute-trait-empty
      >
        Nenhum Trait selecionado.
      </div>
    `;
  }


  return values
    .map(
      (
        value
      ) =>
        createSelectedTraitRow({
          category,
          value,
          negative,
        })
    )
    .join("");
}


export function createAttributeTraitPicker({
  category,
  title,
  values,
  negative = false,
}) {
  return `
    <div
      class="character-creation-map-editor"
      data-creation-attribute-trait-picker
      data-creation-attribute-category="${escapeSheetHtml(
        category
      )}"
      data-creation-attribute-negative="${
        negative
          ? "true"
          : "false"
      }"
    >

      <div class="character-creation-editor-heading">

        <span>
          ${escapeSheetHtml(
            title
          )}
        </span>

      </div>

      <div
        class="
          d-flex
          align-items-center
          gap-2
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
          data-creation-attribute-trait-choice
        >
          ${
            negative
              ? createNegativeTraitOptions(
                  category
                )
              : createPositiveTraitOptions(
                  category
                )
          }
        </select>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            text-nowrap
          "
          data-character-creation-add-attribute-trait
        >
          + Adicionar
        </button>

      </div>

      <div
        class="
          d-flex
          flex-column
          gap-1
          mt-2
        "
        data-creation-attribute-trait-list
      >
        ${createSelectedTraitRows({
          category,
          values,
          negative,
        })}
      </div>

    </div>
  `;
}


export function formatAttributeTraitSummary(
  current,
  target,
  generationMaximum
) {
  const normalizedCurrent =
    Number.isInteger(
      Number(
        current
      )
    )
      ? Number(
          current
        )
      : 0;


  const normalizedTarget =
    Number.isInteger(
      Number(
        target
      )
    ) &&
    Number(
      target
    ) >
      0
      ? String(
          Number(
            target
          )
        )
      : "—";


  const normalizedMaximum =
    Number.isInteger(
      Number(
        generationMaximum
      )
    ) &&
    Number(
      generationMaximum
    ) >
      0
      ? Number(
          generationMaximum
        )
      : 10;


  return `(${normalizedCurrent}/${normalizedTarget}) (Máx: ${normalizedMaximum})`;
}


function getPositiveTraitCount(
  form
) {
  return form
    .querySelectorAll(
      "[data-creation-attribute-trait-value]"
    )
    .length;
}


function getGenerationMaximum(
  form
) {
  const maximum =
    Number(
      form.dataset
        .creationAttributeGenerationMaximum
    );


  return Number.isInteger(
    maximum
  ) &&
  maximum >
    0
    ? maximum
    : 10;
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
    form.querySelector(
      '[data-creation-attribute-negative="false"]'
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
    Number(
      form.dataset
        .creationAttributeBaseTarget
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


  refreshAddButtonState(
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