import {
  appendCharacterCreationMapRow,
} from "../form/characterCreationFormCommon.js";

import {
  appendCharacterCreationAbilityRow,
} from "../form/characterCreationAbilityForm.js";


export function addCharacterCreationMapRow(
  button
) {
  const mapName =
    String(
      button.dataset
        .characterCreationAddRow ||
      ""
    );


  if (!mapName) {
    return;
  }


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const container =
    form?.querySelector(
      `[data-character-creation-map-container="${CSS.escape(
        mapName
      )}"]`
    );


  if (!container) {
    return;
  }


  const type =
    button.dataset
      .characterCreationAddType ||
    "level";


  if (
    type ===
    "ability"
  ) {
    appendCharacterCreationAbilityRow(
      container
    );


    return;
  }


  appendCharacterCreationMapRow(
    container,
    mapName,
    type
  );
}


export function removeCharacterCreationMapRow(
  button
) {
  const row =
    button.closest(
      ".character-creation-map-row"
    );


  const container =
    row?.parentElement;


  if (
    !row ||
    !container
  ) {
    return;
  }


  const mapName =
    String(
      container.dataset
        .characterCreationMapContainer ||
      ""
    );


  const type =
    row.dataset
      .creationMapType ||
    "level";


  row.remove();


  if (
    container.children.length !==
    0
  ) {
    return;
  }


  if (
    type ===
    "ability"
  ) {
    appendCharacterCreationAbilityRow(
      container
    );


    return;
  }


  appendCharacterCreationMapRow(
    container,
    mapName,
    type
  );
}
