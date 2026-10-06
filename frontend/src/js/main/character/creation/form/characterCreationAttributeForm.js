import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
} from "./characterCreationFormCommon.js";

import {
  createAttributePriorityOptions,
  getEffectiveAttributePriority,
  getAttributePriorityTarget,
  applyAttributePrioritySelection,
} from "./characterCreationAttributePriority.js";

import {
  createAttributeTraitPicker,
  formatAttributeTraitSummary,
  readSelectedTraitValues,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  updateAttributeTraitTarget,
} from "./characterCreationAttributeTraitPicker.js";


const ATTRIBUTE_LABELS = {
  physical:
    "Físicos",

  social:
    "Sociais",

  mental:
    "Mentais",
};


function getAttributeGenerationMaximum(
  character
) {
  const draftMaximum =
    Number(
      character
        ?.draftCreation
        ?.derived
        ?.generationRules
        ?.maximumAttributeTraits
    );


  if (
    Number.isInteger(
      draftMaximum
    ) &&
    draftMaximum >
      0
  ) {
    return draftMaximum;
  }


  const officialMaximum =
    Number(
      character
        ?.creation
        ?.derived
        ?.generationRules
        ?.maximumAttributeTraits
    );


  if (
    Number.isInteger(
      officialMaximum
    ) &&
    officialMaximum >
      0
  ) {
    return officialMaximum;
  }


  return 10;
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


  const priority =
    getEffectiveAttributePriority(
      state,
      category
    );


  const baseTarget =
    getAttributePriorityTarget(
      priority
    );


  const generationMaximum =
    getAttributeGenerationMaximum(
      character
    );


  const summary =
    formatAttributeTraitSummary(
      traits.length,
      baseTarget,
      generationMaximum
    );


  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="attributes.${escapeSheetHtml(
        category
      )}"
      data-creation-attribute-base-target="${baseTarget}"
      data-creation-attribute-generation-maximum="${generationMaximum}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          ${escapeSheetHtml(
            ATTRIBUTE_LABELS[
              category
            ] ||
            category
          )} / Negativos

          <span
            data-creation-attribute-summary
          >
            ${escapeSheetHtml(
              summary
            )}
          </span>
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
          ${createAttributePriorityOptions(
            state,
            category
          )}
        </select>

      </label>

      ${createAttributeTraitPicker({
        category,

        title:
          "Traits",

        values:
          traits,
      })}

      ${createAttributeTraitPicker({
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


  applyAttributePrioritySelection(
    state,
    category,
    form.querySelector(
      "[data-creation-attribute-priority]"
    )?.value ||
    ""
  );


  return state;
}


export function handleAttributePriorityChange(
  select
) {
  const form =
    select.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !form
  ) {
    return;
  }


  const target =
    getAttributePriorityTarget(
      select.value
    );


  updateAttributeTraitTarget(
    form,
    target
  );
}


export {
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
};