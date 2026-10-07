import {
  cloneCreationState,
} from "./characterCreationState.js";

import {
  createAbilitiesCreationEditor,
  appendCharacterCreationAbilityRow,
  readAbilitiesCreationSection,
} from "./form/characterCreationAbilityForm.js";

import {
  createAttributeCreationEditor,
  readAttributeCreationSection,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  handleAttributePriorityChange,
} from "./form/characterCreationAttributeForm.js";

import {
  createDisciplineCreationEditor,
  readDisciplineCreationSection,
} from "./form/characterCreationDisciplineForm.js";

import {
  createBackgroundCreationEditor,
  readBackgroundCreationSection,
} from "./form/characterCreationBackgroundForm.js";

import {
  createInfluenceCreationEditor,
  readInfluenceCreationSection,
} from "./form/characterCreationInfluenceForm.js";

import {
  createMeritsFlawsCreationEditor,
  readMeritsFlawsCreationSection,
} from "./form/characterCreationAdjustmentForm.js";

import {
  createWillpowerCreationEditor,
  readWillpowerCreationSection,
} from "./form/characterCreationWillpowerForm.js";

import {
  createMoralityCreationEditor,
  readMoralityCreationSection,
} from "./form/characterCreationMoralityForm.js";


export function createCharacterCreationSectionEditor(
  character,
  section,
  state
) {
  if (
    section.startsWith(
      "attributes."
    )
  ) {
    const category =
      section.split(
        "."
      )[1];


    return createAttributeCreationEditor(
      character,
      state,
      category
    );
  }


  if (
    section ===
    "abilities"
  ) {
    return createAbilitiesCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "disciplines"
  ) {
    return createDisciplineCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "backgrounds"
  ) {
    return createBackgroundCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "influences"
  ) {
    return createInfluenceCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "meritsFlaws"
  ) {
    return createMeritsFlawsCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "willpower"
  ) {
    return createWillpowerCreationEditor(
      character,
      state
    );
  }


  if (
    section ===
    "morality"
  ) {
    return createMoralityCreationEditor(
      character,
      state
    );
  }


  return "";
}


export function readCharacterCreationSection(
  form,
  section,
  currentState
) {
  const state =
    cloneCreationState(
      currentState
    );


  if (
    section.startsWith(
      "attributes."
    )
  ) {
    const category =
      section.split(
        "."
      )[1];


    return readAttributeCreationSection(
      form,
      category,
      state
    );
  }


  if (
    section ===
    "abilities"
  ) {
    return readAbilitiesCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "disciplines"
  ) {
    return readDisciplineCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "backgrounds"
  ) {
    return readBackgroundCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "influences"
  ) {
    return readInfluenceCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "meritsFlaws"
  ) {
    return readMeritsFlawsCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "willpower"
  ) {
    return readWillpowerCreationSection(
      form,
      state
    );
  }


  if (
    section ===
    "morality"
  ) {
    return readMoralityCreationSection(
      form,
      state
    );
  }


  return state;
}


export {
  appendCharacterCreationAbilityRow,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  handleAttributePriorityChange,
};
