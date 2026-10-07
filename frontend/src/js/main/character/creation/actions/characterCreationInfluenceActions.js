import {
  adjustCharacterCreationInfluenceLevel,
  addInfluence,
  removeInfluence,
} from "../form/characterCreationInfluenceForm.js";


export function handleCharacterCreationInfluenceActionClick(
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
      "[data-character-creation-add-influence]"
    );


  if (addButton) {
    addInfluence(
      addButton
    );


    return true;
  }


  const removeButton =
    target.closest(
      "[data-character-creation-remove-influence]"
    );


  if (removeButton) {
    removeInfluence(
      removeButton
    );


    return true;
  }


  const levelButton =
    target.closest(
      "[data-character-creation-influence-action]"
    );


  if (levelButton) {
    adjustCharacterCreationInfluenceLevel(
      levelButton
    );


    return true;
  }


  return false;
}
