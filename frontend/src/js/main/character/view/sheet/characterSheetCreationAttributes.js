import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  createCreationList,
} from "./characterSheetCreationLists.js";

import {
  getAttributeTraitLabel,
} from "../../creation/data/attributeTraitCatalog.js";


const ATTRIBUTE_CREATION_HELP_TEXT =
  "O formato (Atual/Criação) mostra quantos Traits esta categoria possui atualmente e quantos Traits correspondem à sua distribuição-base durante a criação inicial do personagem. Primário recebe 7, Secundário 5 e Terciário 3. Traits acima dessa distribuição consomem Free Traits. O limite Máx. continua sendo determinado pela Geração.";


const ATTRIBUTE_EXTRA_TRAIT_HELP_TEXT =
  "Este Trait ultrapassa a distribuição-base da criação e consome 1 Free Trait.";


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


function createAttributeCreationHelpButton() {
  return `
    <button
      type="button"
      class="
        btn
        btn-outline-secondary
        rounded-circle
        p-0
        character-sheet-help-button
      "
      aria-label="Informações sobre a distribuição inicial de Atributos"
      title="${escapeSheetHtml(
        ATTRIBUTE_CREATION_HELP_TEXT
      )}"
      data-bs-toggle="popover"
      data-bs-trigger="focus"
      data-bs-placement="top"
      data-bs-container="body"
      data-bs-title="Atributos na criação"
      data-bs-content="${escapeSheetHtml(
        ATTRIBUTE_CREATION_HELP_TEXT
      )}"
    >
      ?
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


function getAttributeSummary(
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
      : null;


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


  return {
    current,

    target,

    maximum,

    extra:
      target
        ? Math.max(
            0,
            current -
              target
          )
        : 0,
  };
}


function createAttributeTraitList(
  category,
  traits,
  target
) {
  if (
    !Array.isArray(
      traits
    ) ||
    traits.length ===
      0
  ) {
    return "";
  }


  return `
    <ul class="character-creation-list">

      ${traits
        .map(
          (
            trait,
            index
          ) => {
            const extra =
              Number.isInteger(
                target
              ) &&
              target >
                0 &&
              index >=
                target;


            const label =
              getAttributeTraitLabel(
                category,
                trait
              );


            return `
              <li
                class="
                  character-creation-attribute-trait
                  ${
                    extra
                      ? "is-free-trait-spend"
                      : ""
                  }
                "
                ${
                  extra
                    ? `
                      title="${escapeSheetHtml(
                        ATTRIBUTE_EXTRA_TRAIT_HELP_TEXT
                      )}"
                    `
                    : ""
                }
              >
                ${escapeSheetHtml(
                  label
                )}
              </li>
            `;
          }
        )
        .join("")}

    </ul>
  `;
}


function createAttributeSectionTitle({
  character,
  title,
  section,
  editable,
  current,
  target,
  maximum,
  extra,
}) {
  const label =
    `${title} / Negativos`;


  const targetLabel =
    target ||
    "—";


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

      <span
        class="
          d-inline-flex
          align-items-center
          flex-wrap
          gap-1
        "
      >

        <span>
          ${escapeSheetHtml(
            label
          )}
        </span>

        <span
          class="
            character-creation-attribute-progress
            ${
              extra >
                0
                ? "is-free-trait-spend"
                : ""
            }
          "
          ${
            extra >
              0
              ? `
                title="${escapeSheetHtml(
                  `${extra} Trait adicional da criação consome ${extra} Free Trait${extra === 1 ? "" : "s"}.`
                )}"
              `
              : ""
          }
        >
          (${escapeSheetHtml(
            current
          )}/${escapeSheetHtml(
            targetLabel
          )})
        </span>

        ${createAttributeCreationHelpButton()}

        <span>
          (Máx: ${escapeSheetHtml(
            maximum
          )})
        </span>

      </span>

      ${createEditButton({
        character,
        section,
        label,
        editable,
      })}

    </h4>
  `;
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


  const {
    current,
    target,
    maximum,
    extra,
  } =
    getAttributeSummary(
      traits,
      categoryProgress
    );


  const hasContent =
    traits.length >
      0 ||
    negatives.length >
      0;


  const section =
    `attributes.${category}`;


  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-section="${escapeSheetHtml(
        section
      )}"
    >

      ${createAttributeSectionTitle({
        character,
        title,
        section,
        editable,
        current,
        target,
        maximum,
        extra,
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

                    ${createAttributeTraitList(
                      category,
                      traits,
                      target
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