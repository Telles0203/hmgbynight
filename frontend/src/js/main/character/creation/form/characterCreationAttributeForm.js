import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  arrayToCreationText,
  createCreationActions,
  parseCreationLines,
} from "./characterCreationFormCommon.js";


const ATTRIBUTE_LABELS = {
  physical:
    "Físicos",

  social:
    "Sociais",

  mental:
    "Mentais",
};


function createPriorityOptions(
  state,
  category
) {
  const priorities =
    state
      ?.attributePriorities ||
    {};


  const selected =
    Object.entries(
      priorities
    ).find(
      ([
        ,
        value,
      ]) =>
        value ===
        category
    )?.[0] ||
    "";


  const options = [
    [
      "",
      "Selecione",
    ],

    [
      "primary",
      "Primário",
    ],

    [
      "secondary",
      "Secundário",
    ],

    [
      "tertiary",
      "Terciário",
    ],
  ];


  return options
    .map(
      ([
        value,
        label,
      ]) => `
        <option
          value="${value}"
          ${
            value ===
            selected
              ? "selected"
              : ""
          }
        >
          ${label}
        </option>
      `
    )
    .join("");
}


export function createAttributeCreationEditor(
  character,
  state,
  category
) {
  const traits =
    state
      ?.attributes
      ?.[
        category
      ] ||
    [];


  const negativeTraits =
    state
      ?.negativeTraits
      ?.[
        category
      ] ||
    [];


  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="attributes.${escapeSheetHtml(
        category
      )}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          ${escapeSheetHtml(
            ATTRIBUTE_LABELS[
              category
            ] ||
            category
          )} / Negativos
        </strong>

      </div>

      <label class="character-creation-inline-label">

        Prioridade

        <select
          class="
            form-select
            form-select-sm
            bg-black
            text-light
            border-secondary
          "
          data-creation-attribute-priority
        >
          ${createPriorityOptions(
            state,
            category
          )}
        </select>

      </label>

      <label class="character-creation-inline-label">

        Traits

        <textarea
          class="
            form-control
            bg-black
            text-light
            border-secondary
          "
          rows="6"
          data-creation-attribute-traits
        >${escapeSheetHtml(
          arrayToCreationText(
            traits
          )
        )}</textarea>

        <small>
          Um Trait por linha.
        </small>

      </label>

      <label class="character-creation-inline-label">

        Traits Negativos

        <textarea
          class="
            form-control
            bg-black
            text-light
            border-secondary
          "
          rows="4"
          data-creation-negative-traits
        >${escapeSheetHtml(
          arrayToCreationText(
            negativeTraits
          )
        )}</textarea>

        <small>
          Um Trait por linha.
        </small>

      </label>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


function updateAttributePriority(
  state,
  category,
  selectedPriority
) {
  const priorities = {
    ...(
      state
        .attributePriorities ||
      {}
    ),
  };


  const currentPriority =
    Object.entries(
      priorities
    ).find(
      ([
        ,
        value,
      ]) =>
        value ===
        category
    )?.[0] ||
    null;


  if (
    !selectedPriority
  ) {
    if (
      currentPriority
    ) {
      priorities[
        currentPriority
      ] =
        "";
    }


    state.attributePriorities =
      priorities;


    return;
  }


  const displacedCategory =
    priorities[
      selectedPriority
    ] ||
    "";


  priorities[
    selectedPriority
  ] =
    category;


  if (
    currentPriority &&
    currentPriority !==
      selectedPriority
  ) {
    priorities[
      currentPriority
    ] =
      displacedCategory ===
      category
        ? ""
        : displacedCategory;
  }


  Object.keys(
    priorities
  ).forEach(
    (
      priority
    ) => {
      if (
        priority !==
          selectedPriority &&
        priorities[
          priority
        ] ===
          category
      ) {
        priorities[
          priority
        ] =
          "";
      }
    }
  );


  state.attributePriorities =
    priorities;
}


export function readAttributeCreationSection(
  form,
  category,
  state
) {
  state.attributePriorities =
    state.attributePriorities ||
    {
      primary:
        "",

      secondary:
        "",

      tertiary:
        "",
    };


  state.attributes =
    state.attributes ||
    {
      physical:
        [],

      social:
        [],

      mental:
        [],
    };


  state.negativeTraits =
    state.negativeTraits ||
    {
      physical:
        [],

      social:
        [],

      mental:
        [],
    };


  state.attributes[
    category
  ] =
    parseCreationLines(
      form.querySelector(
        "[data-creation-attribute-traits]"
      )?.value
    );


  state.negativeTraits[
    category
  ] =
    parseCreationLines(
      form.querySelector(
        "[data-creation-negative-traits]"
      )?.value
    );


  updateAttributePriority(
    state,
    category,
    form.querySelector(
      "[data-creation-attribute-priority]"
    )?.value ||
    ""
  );


  return state;
}