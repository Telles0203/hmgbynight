import {
  adjustCharacterCreationBackgroundLevel,
  addBackground,
  removeBackground,
} from "../form/characterCreationBackgroundForm.js";


export function handleCharacterCreationBackgroundActionClick(
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
      "[data-character-creation-add-background]"
    );


  if (addButton) {
    addBackground(
      addButton
    );


    return true;
  }


  const removeButton =
    target.closest(
      "[data-character-creation-remove-background]"
    );


  if (removeButton) {
    removeBackground(
      removeButton
    );


    return true;
  }


  const levelButton =
    target.closest(
      "[data-character-creation-background-action]"
    );


  if (levelButton) {
    adjustCharacterCreationBackgroundLevel(
      levelButton
    );


    return true;
  }


  return false;
}
