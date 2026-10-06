import {
  cloneCreationState,
  appendCharacterCreationMapRow,
} from "./form/characterCreationFormCommon.js";

import {
  createAttributeCreationEditor,
  readAttributeCreationSection,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
} from "./form/characterCreationAttributeForm.js";

import {
  createAbilitiesCreationEditor,
  createSingleMapCreationEditor,
  readAbilitiesCreationSection,
  readSingleMapCreationSection,
} from "./form/characterCreationMapForm.js";

import {
  createMeritsFlawsCreationEditor,
  createSingleNumberCreationEditor,
  readMeritsFlawsCreationSection,
  readSingleNumberCreationSection,
} from "./form/characterCreationAdjustmentForm.js";


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
    return createSingleNumberCreationEditor(
      character,
      state,
      {
        section:
          "willpower",

        field:
          "willpowerBonus",

        title:
          "Força de Vontade",

        minimum:
          0,

        maximum:
          20,
      }
    );
  }


  if (
    section ===
    "morality"
  ) {
    return createSingleNumberCreationEditor(
      character,
      state,
      {
        section:
          "morality",

        field:
          "moralityAdjustment",

        title:
          character
            ?.moralityPathLabel ||
          "Humanidade",

        minimum:
          -5,

        maximum:
          5,
      }
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
    return readSingleNumberCreationSection(
      form,
      state,
      "willpowerBonus"
    );
  }


  if (
    section ===
    "morality"
  ) {
    return readSingleNumberCreationSection(
      form,
      state,
      "moralityAdjustment"
    );
  }


  return state;
}


export {
  appendCharacterCreationMapRow,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
};