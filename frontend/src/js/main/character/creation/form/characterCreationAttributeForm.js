import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
} from "./characterCreationFormCommon.js";

import {
  getAttributeTraitCatalog,
  getAttributeTraitLabel,
} from "../data/attributeTraitCatalog.js";


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


function createTraitPicker({
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

      ${createTraitPicker({
        category,

        title:
          "Traits",

        values:
          traits,
      })}

      ${createTraitPicker({
        category,

        title:
          "Traits Negativos",

        values:
          negativeTraits,

        negative:
          true,
      })}

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


function readSelectedTraitValues(
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
    readSelectedTraitValues(
      form,
      "[data-creation-attribute-trait-value]"
    );


  state.negativeTraits[
    category
  ] =
    readSelectedTraitValues(
      form,
      "[data-creation-negative-trait-value]"
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


export function addAttributeTraitSelection(
  button
) {
  const picker =
    button.closest(
      "[data-creation-attribute-trait-picker]"
    );


  if (
    !picker
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
    list.querySelector(
      "[data-creation-attribute-trait-row]"
    )
  ) {
    return;
  }


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