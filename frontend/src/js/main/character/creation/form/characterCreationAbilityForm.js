import {
  createCreationActions,
} from "./characterCreationFormCommon.js";

import {
  getAbilityCreationRules,
} from "./ability/characterCreationAbilityCatalog.js";

import {
  createAbilityRow,
  createAbilityRows,
  readAbilityMap,
  readAbilitySpecializations,
  refreshCharacterCreationAbilityFocus,
  refreshCharacterCreationAbilityCustomFocus,
} from "./ability/characterCreationAbilityRows.js";

import {
  getStateAbilityProgress,
  refreshCharacterCreationAbilityEditor,
  adjustCharacterCreationAbilityLevel,
} from "./ability/characterCreationAbilityProgress.js";

import {
  collapseCharacterCreationAbilityRows,
  concludeCharacterCreationAbilityRow,
  openCharacterCreationAbilityRow,
} from "./ability/characterCreationAbilityRowState.js";


export function createAbilitiesCreationEditor(
  character,
  state
) {
  const rules =
    getAbilityCreationRules(
      character
    );


  const progress =
    getStateAbilityProgress(
      state,
      rules.total,
      rules.freeTraitCost,
      rules
        .specializationFreeTraitCost
    );


  const highlight =
    progress.spent >
    progress.total;


  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="abilities"
      data-ability-creation-total="${rules.total}"
      data-ability-free-trait-cost="${rules.freeTraitCost}"
      data-ability-specialization-free-trait-cost="${rules.specializationFreeTraitCost}"
      data-ability-maximum="${rules.maximum}"
    >

      <div
        class="
          character-creation-inline-heading
          d-flex
          justify-content-between
          align-items-center
          gap-2
        "
      >

        <strong>
          Habilidades
        </strong>

        <span
          class="
            badge
            rounded-pill
            border
            bg-transparent
            ${highlight
              ? "border-danger text-danger"
              : "border-secondary text-secondary"}
          "
          data-creation-ability-points
        >
          ${progress.spent}/${progress.total}
        </span>

      </div>

      <div class="character-creation-map-editor">

        <div class="character-creation-editor-heading">

          <span>
            Habilidades
          </span>

          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            data-character-creation-add-row="abilities"
            data-character-creation-add-type="ability"
          >
            + Adicionar
          </button>

        </div>

        <div
          class="character-creation-map-rows"
          data-character-creation-map-container="abilities"
        >
          ${createAbilityRows(
            state?.abilities,
            state?.specializations,
            rules.maximum
          )}
        </div>

      </div>

      <small
        class="
          character-free-trait-inline-cost
          mt-2
          ${progress.freeTraitCost > 0
            ? ""
            : "d-none"}
        "
        data-creation-ability-free-trait-cost
      >
        ${progress.freeTraitCost > 0
          ? `Extra da criação: -${progress.freeTraitCost} Free Trait${progress.freeTraitCost === 1 ? "" : "s"}`
          : ""}
      </small>

      <small
        class="
          character-free-trait-inline-cost
          mt-1
          ${progress.specializationFreeTraitCost > 0
            ? ""
            : "d-none"}
        "
        data-creation-specialization-free-trait-cost
      >
        ${progress.specializationFreeTraitCost > 0
          ? `Especializações: -${progress.specializationFreeTraitCost} Free Trait${progress.specializationFreeTraitCost === 1 ? "" : "s"}`
          : ""}
      </small>

      <div class="small text-secondary mt-2">
        Cada Especialização custa
        ${rules.specializationFreeTraitCost}
        Free Trait.
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function appendCharacterCreationAbilityRow(
  container
) {
  const form =
    container.closest(
      "[data-character-creation-inline-form]"
    );


  const maximum =
    Number(
      form
        ?.dataset
        ?.abilityMaximum
    ) ||
    5;


  collapseCharacterCreationAbilityRows(
    container
  );


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createAbilityRow(
      "",
      1,
      "",
      maximum,
      true
    );


  const row =
    wrapper.firstElementChild;


  if (!row) {
    return;
  }


  container.appendChild(
    row
  );


  row.querySelector(
    "[data-creation-ability-key]"
  )?.focus();


  refreshCharacterCreationAbilityEditor(
    form
  );
}


export function readAbilitiesCreationSection(
  form,
  state
) {
  const abilities =
    readAbilityMap(
      form
    );


  state.abilities =
    abilities;


  state.specializations =
    readAbilitySpecializations(
      form
    );


  return state;
}


export function handleCharacterCreationAbilityFieldChange(
  target
) {
  const row =
    target.closest(
      '.character-creation-map-row[data-creation-map="abilities"]'
    );


  const form =
    target.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form
  ) {
    return;
  }


  if (
    target.matches(
      "[data-creation-ability-key]"
    )
  ) {
    refreshCharacterCreationAbilityFocus(
      row
    );
  }


  if (
    target.matches(
      "[data-creation-ability-focus]"
    )
  ) {
    refreshCharacterCreationAbilityCustomFocus(
      row
    );
  }


  refreshCharacterCreationAbilityEditor(
    form
  );
}


export function handleCharacterCreationAbilityRowAction(
  button
) {
  const action =
    String(
      button.dataset
        .characterCreationAbilityRowAction ||
      ""
    );


  if (
    action ===
    "edit"
  ) {
    openCharacterCreationAbilityRow(
      button
    );

    return;
  }


  if (
    action ===
    "conclude"
  ) {
    concludeCharacterCreationAbilityRow(
      button
    );
  }
}


export {
  refreshCharacterCreationAbilityEditor,
  adjustCharacterCreationAbilityLevel,
};
