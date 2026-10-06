import {
  escapeSheetHtml,
  humanizeSheetKey,
  createSheetPips,
} from "./characterSheetCommon.js";


const BLOOD_HELP_TEXT =
  "Laws of the Night Revised, página 95. Na tabela de Geração, Blood indica o número máximo de Blood Traits que o personagem pode armazenar. O número depois da barra indica quantos Blood Traits podem ser gastos em um único turno.";


const WILLPOWER_HELP_TEXT =
  "Laws of the Night Revised, páginas 95 e 107. A tabela de Geração mostra a Força de Vontade inicial antes da barra e o máximo depois da barra. A seção Willpower também determina que os valores inicial e máximo são definidos pela Geração.";


function createHelpButton(
  title,
  content
) {
  if (
    !content
  ) {
    return "";
  }


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
      aria-label="Informações sobre ${escapeSheetHtml(
        title
      )}"
      title="${escapeSheetHtml(
        content
      )}"
      data-bs-toggle="popover"
      data-bs-trigger="focus"
      data-bs-placement="top"
      data-bs-container="body"
      data-bs-title="${escapeSheetHtml(
        title
      )}"
      data-bs-content="${escapeSheetHtml(
        content
      )}"
    >
      ?
    </button>
  `;
}


function getResourceHelpText(
  title
) {
  const normalized =
    String(
      title ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    normalized ===
    "sangue máximo"
  ) {
    return BLOOD_HELP_TEXT;
  }


  if (
    normalized ===
    "força de vontade"
  ) {
    return WILLPOWER_HELP_TEXT;
  }


  return "";
}


function createEditButton({
  characterId,
  section,
  title,
  editable,
}) {
  if (
    !editable ||
    !section
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
        characterId
      )}"
      data-character-creation-edit="${escapeSheetHtml(
        section
      )}"
      aria-label="Editar ${escapeSheetHtml(
        title
      )}"
      title="Editar ${escapeSheetHtml(
        title
      )}"
    >
      ✎
    </button>
  `;
}


export function createPendingCreationNotice(
  character
) {
  if (
    !character
      ?.draftCreation
  ) {
    return "";
  }


  const officialState =
    character
      ?.creation
      ?.state ||
    {};


  const draftState =
    character
      ?.draftCreation
      ?.state ||
    {};


  const sections =
    [];


  const comparisons = [
    [
      "Atributos",

      [
        officialState
          .attributePriorities,

        officialState
          .attributes,

        officialState
          .negativeTraits,
      ],

      [
        draftState
          .attributePriorities,

        draftState
          .attributes,

        draftState
          .negativeTraits,
      ],
    ],

    [
      "Habilidades",

      [
        officialState
          .abilities,

        officialState
          .specializations,
      ],

      [
        draftState
          .abilities,

        draftState
          .specializations,
      ],
    ],

    [
      "Disciplinas",

      officialState
        .disciplines,

      draftState
        .disciplines,
    ],

    [
      "Antecedentes",

      officialState
        .backgrounds,

      draftState
        .backgrounds,
    ],

    [
      "Qualidades / Defeitos",

      [
        officialState
          .meritPoints,

        officialState
          .flawPoints,

        officialState
          .derangement,
      ],

      [
        draftState
          .meritPoints,

        draftState
          .flawPoints,

        draftState
          .derangement,
      ],
    ],

    [
      "Força de Vontade",

      officialState
        .willpowerBonus,

      draftState
        .willpowerBonus,
    ],

    [
      "Moralidade",

      officialState
        .moralityAdjustment,

      draftState
        .moralityAdjustment,
    ],
  ];


  comparisons.forEach(
    ([
      label,
      official,
      draft,
    ]) => {
      if (
        JSON.stringify(
          official
        ) !==
        JSON.stringify(
          draft
        )
      ) {
        sections.push(
          label
        );
      }
    }
  );


  if (
    sections.length ===
    0
  ) {
    return "";
  }


  return `
    <div class="character-creation-pending">

      <span class="character-creation-pending-icon">
        !
      </span>

      <div>

        <strong>
          Alterações aguardando aprovação da Narração
        </strong>

        <small>
          Alterações pendentes em:
          ${escapeSheetHtml(
            sections.join(
              ", "
            )
          )}.
        </small>

      </div>

    </div>
  `;
}


export function createPendingDerivedValue(
  character,
  key,
  officialValue
) {
  const draftValue =
    character
      ?.draftCreation
      ?.derived
      ?.[
        key
      ];


  if (
    draftValue ===
      undefined ||
    draftValue ===
      null ||
    draftValue ===
      officialValue
  ) {
    return "";
  }


  return `
    <small class="character-creation-derived-pending">
      Aguardando aprovação:
      ${escapeSheetHtml(
        draftValue
      )}
    </small>
  `;
}


export function createCreationResourceCard({
  characterId,
  title,
  content,
  pending = "",
  editSection = "",
  editable = false,
}) {
  const helpText =
    getResourceHelpText(
      title
    );


  return `
    <section
      class="
        character-section-card
        character-sheet-section
        character-sheet-resource
      "
      ${
        editSection
          ? `
            data-character-id="${escapeSheetHtml(
              characterId
            )}"

            data-character-creation-section="${escapeSheetHtml(
              editSection
            )}"
          `
          : ""
      }
    >

      <h4
        class="
          character-sheet-title
          d-flex
          align-items-center
          justify-content-center
          gap-2
        "
      >

        <span>
          ${escapeSheetHtml(
            title
          )}
        </span>

        ${createHelpButton(
          title,
          helpText
        )}

        ${createEditButton({
          characterId,
          section:
            editSection,
          title,
          editable,
        })}

      </h4>

      <div class="character-creation-resource-value">
        ${content}
      </div>

      ${pending}

    </section>
  `;
}


export function createMoralityResourceContent(
  morality
) {
  const value =
    Number(
      morality
    );


  const normalizedValue =
    Number.isFinite(
      value
    )
      ? Math.max(
          0,
          Math.min(
            10,
            value
          )
        )
      : 0;


  return `
    <div class="character-sheet-pips">

      ${createSheetPips(
        normalizedValue,
        10
      )}

    </div>
  `;
}


export function createFreeTraitContent(
  creation
) {
  const freeTraits =
    creation
      ?.freeTraits ||
    {};


  return `
    <div class="character-creation-free-compact">

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Disponíveis
        </span>

        <span class="character-sheet-value">
          ${Number(
            freeTraits.available ||
            0
          )}
        </span>

      </div>

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Gastos
        </span>

        <span class="character-sheet-value">
          ${Number(
            freeTraits.spent ||
            0
          )}
        </span>

      </div>

      <div class="character-sheet-row">

        <span class="character-sheet-label">
          Restantes
        </span>

        <span class="character-sheet-value">
          ${Number(
            freeTraits.remaining ||
            0
          )}
        </span>

      </div>

    </div>
  `;
}


export function createFreeTraitSpending(
  creation
) {
  const spending =
    creation
      ?.freeTraits
      ?.spending ||
    {};


  const entries =
    Object.entries(
      spending
    )
      .filter(
        ([
          ,
          value,
        ]) =>
          Number(
            value
          ) >
          0
      );


  if (
    entries.length ===
    0
  ) {
    return "";
  }


  return `
    <div class="mt-2">

      ${entries
        .map(
          ([
            key,
            value,
          ]) => `
            <div class="character-sheet-row">

              <span class="character-sheet-label">
                ${escapeSheetHtml(
                  humanizeSheetKey(
                    key
                  )
                )}
              </span>

              <span class="character-sheet-value">
                ${Number(
                  value
                )}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}