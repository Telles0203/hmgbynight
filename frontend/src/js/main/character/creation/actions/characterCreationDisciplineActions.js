import {
  adjustCharacterCreationDisciplineLevel,
  addOutsideDiscipline,
  removeOutsideDiscipline,
} from "../form/characterCreationDisciplineForm.js";


export function handleCharacterCreationDisciplineActionClick(
  target
) {
  if (
    !(target instanceof
      Element)
  ) {
    return false;
  }


  const addButton =
    target.closest(
      "[data-character-creation-add-outside-discipline]"
    );


  if (
    addButton
  ) {
    addOutsideDiscipline(
      addButton
    );


    return true;
  }


  const removeButton =
    target.closest(
      "[data-character-creation-remove-outside-discipline]"
    );


  if (
    removeButton
  ) {
    removeOutsideDiscipline(
      removeButton
    );


    return true;
  }


  const levelButton =
    target.closest(
      "[data-character-creation-discipline-action]"
    );


  if (
    levelButton
  ) {
    adjustCharacterCreationDisciplineLevel(
      levelButton
    );


    return true;
  }


  return false;
}
