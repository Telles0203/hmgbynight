import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  createCreationList,
} from "./characterSheetCreationLists.js";


function createEditButton({
  character,
  section,
  label,
  editable,
}) {
  if (
    !editable
  ) {
    return "";
  }


  return `
    <button
      type="button"
      class="
        btn
        btn-link
        btn-sm
        text-secondary
        text-decoration-none
        p-0
        character-creation-section-edit
      "
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-edit="${escapeSheetHtml(
        section
      )}"
      aria-label="Editar ${escapeSheetHtml(
        label
      )}"
      title="Editar ${escapeSheetHtml(
        label
      )}"
    >
      ✎
    </button>
  `;
}


export function createCreationSectionTitle({
  character,
  title,
  section,
  editable,
}) {
  return `
    <h4
      class="
        character-sheet-title
        d-flex
        align-items-center
        justify-content-between
        gap-2
      "
    >

      <span>
        ${escapeSheetHtml(
          title
        )}
      </span>

      ${createEditButton({
        character,
        section,
        label:
          title,
        editable,
      })}

    </h4>
  `;
}


function createAttributeSummary(
  traits,
  categoryProgress
) {
  const current =
    Array.isArray(
      traits
    )
      ? traits.length
      : 0;


  const rawTarget =
    Number(
      categoryProgress
        ?.target
    );


  const target =
    Number.isInteger(
      rawTarget
    ) &&
    rawTarget >
      0
      ? rawTarget
      : "—";


  const rawMaximum =
    Number(
      categoryProgress
        ?.generationMaximum
    );


  const maximum =
    Number.isInteger(
      rawMaximum
    ) &&
    rawMaximum >
      0
      ? rawMaximum
      : 10;


  return `(${current}/${target}) (Máx: ${maximum})`;
}


export function createAttributeSection({
  character,
  state,
  progress,
  category,
  title,
  editable,
}) {
  const traits =
    state
      ?.attributes
      ?.[
        category
      ] ||
    [];


  const negatives =
    state
      ?.negativeTraits
      ?.[
        category
      ] ||
    [];


  const categoryProgress =
    progress
      ?.categories
      ?.[
        category
      ] ||
    {};


  const summary =
    createAttributeSummary(
      traits,
      categoryProgress
    );


  const hasContent =
    traits.length >
      0 ||
    negatives.length >
      0;


  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-section="attributes.${category}"
    >

      ${createCreationSectionTitle({
        character,

        title:
          `${title} / Negativos ${summary}`,

        section:
          `attributes.${category}`,

        editable,
      })}

      ${
        !hasContent
          ? `
            <div class="character-sheet-empty">
              Nenhum traço cadastrado.
            </div>
          `
          : `
            ${
              traits.length >
                0
                ? `
                  <div class="character-sheet-group">

                    <div class="character-sheet-mini-title">
                      Traits
                    </div>

                    ${createCreationList(
                      traits,
                      ""
                    )}

                  </div>
                `
                : ""
            }

            ${
              negatives.length >
                0
                ? `
                  <div class="character-sheet-group mt-3">

                    <div class="character-sheet-mini-title">
                      Negativos
                    </div>

                    ${createCreationList(
                      negatives,
                      ""
                    )}

                  </div>
                `
                : ""
            }
          `
      }

    </section>
  `;
}