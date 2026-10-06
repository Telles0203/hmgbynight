import {
  cloneCreationState,
} from "./characterCreationState.js";

import {
  appendCharacterCreationMapRow,
} from "./form/characterCreationFormCommon.js";

import {
  createAttributeCreationEditor,
  readAttributeCreationSection,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  handleAttributePriorityChange,
} from "./form/characterCreationAttributeForm.js";

import {
  createAbilitiesCreationEditor,
  createSingleMapCreationEditor,
  readAbilitiesCreationSection,
  readSingleMapCreationSection,
} from "./form/characterCreationMapForm.js";

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
    return createSingleMapCreationEditor(
      character,
      state,
      {
        section:
          "disciplines",

        mapName:
          "disciplines",

        title:
          "Disciplinas",
      }
    );
  }


  if (
    section ===
    "backgrounds"
  ) {
    return createSingleMapCreationEditor(
      character,
      state,
      {
        section:
          "backgrounds",

        mapName:
          "backgrounds",

        title:
          "Antecedentes",
      }
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
    return readSingleMapCreationSection(
      form,
      state,
      "disciplines"
    );
  }


  if (
    section ===
    "backgrounds"
  ) {
    return readSingleMapCreationSection(
      form,
      state,
      "backgrounds"
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
  appendCharacterCreationMapRow,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  handleAttributePriorityChange,
};