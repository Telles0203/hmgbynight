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
  "O formato (Atual/Criação) mostra quantos Traits esta categoria possui atualmente e quantos Traits correspondem à sua distribuição-base durante a criação inicial do personagem. Primário recebe 7, Secundário 5 e Terciário 3. Este valor é mantido separadamente para permitir outros usos no futuro; por enquanto, ele serve apenas como referência da criação inicial.";


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


  return {
    current,
    target,
    maximum,
  };
}


function createAttributeSectionTitle({
  character,
  title,
  section,
  editable,
  current,
  target,
  maximum,
}) {
  const label =
    `${title} / Negativos`;


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

        <span>
          (${escapeSheetHtml(
            current
          )}/${escapeSheetHtml(
            target
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


function getDisplayTraits(
  category,
  traits
) {
  if (
    !Array.isArray(
      traits
    )
  ) {
    return [];
  }


  return traits.map(
    (
      trait
    ) =>
      getAttributeTraitLabel(
        category,
        trait
      )
  );
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


  const displayTraits =
    getDisplayTraits(
      category,
      traits
    );


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
              displayTraits.length >
                0
                ? `
                  <div class="character-sheet-group">

                    <div class="character-sheet-mini-title">
                      Traits
                    </div>

                    ${createCreationList(
                      displayTraits,
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