import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  getAttributeTraitCatalog,
  getAttributeTraitLabel,
} from "../data/attributeTraitCatalog.js";


const EXTRA_TRAIT_HELP_TEXT =
  "Trait adicional da criação: consome 1 Free Trait.";


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


export function createSelectedTraitRow({
  category,
  value,
  negative = false,
  extra = false,
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


  const isExtra =
    !negative &&
    extra;


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
        character-creation-attribute-trait-row
        ${
          isExtra
            ? "is-free-trait-spend"
            : ""
        }
      "
      data-creation-attribute-trait-row
      ${
        isExtra
          ? `
            title="${escapeSheetHtml(
              EXTRA_TRAIT_HELP_TEXT
            )}"
          `
          : ""
      }
    >

      <span class="small character-creation-attribute-trait-label">
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
  baseTarget = 0,
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
        value,
        index
      ) =>
        createSelectedTraitRow({
          category,
          value,
          negative,

          extra:
            !negative &&
            Number.isInteger(
              Number(
                baseTarget
              )
            ) &&
            Number(
              baseTarget
            ) >
              0 &&
            index >=
              Number(
                baseTarget
              ),
        })
    )
    .join("");
}


export function createAttributeTraitPicker({
  category,
  title,
  values,
  negative = false,
  baseTarget = 0,
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
          baseTarget,
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


export {
  EXTRA_TRAIT_HELP_TEXT,
};