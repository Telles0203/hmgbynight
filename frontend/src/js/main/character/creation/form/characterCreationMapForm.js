import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
  createCreationMapEditor,
  readCreationLevelMap,
  readCreationSpecializations,
} from "./characterCreationFormCommon.js";


export function createAbilitiesCreationEditor(
  character,
  state
) {
  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="abilities"
    >

      <div class="character-creation-inline-heading">
        <strong>
          Habilidades
        </strong>
      </div>

      ${createCreationMapEditor({
        mapName:
          "abilities",

        title:
          "Habilidades",

        values:
          state?.abilities,
      })}

      ${createCreationMapEditor({
        mapName:
          "specializations",

        title:
          "Especializações",

        values:
          state?.specializations,

        type:
          "specialization",
      })}

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function createSingleMapCreationEditor(
  character,
  state,
  {
    section,
    mapName,
    title,
  }
) {
  return `
    <form
      class="character-creation-inline-editor"
      data-character-creation-inline-form
      data-character-creation-section="${escapeSheetHtml(
        section
      )}"
    >

      <div class="character-creation-inline-heading">

        <strong>
          ${escapeSheetHtml(
            title
          )}
        </strong>

      </div>

      ${createCreationMapEditor({
        mapName,
        title,

        values:
          state?.[
            mapName
          ],
      })}

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function readAbilitiesCreationSection(
  form,
  state
) {
  state.abilities =
    readCreationLevelMap(
      form,
      "abilities"
    );


  state.specializations =
    readCreationSpecializations(
      form
    );


  return state;
}


export function readSingleMapCreationSection(
  form,
  state,
  mapName
) {
  state[
    mapName
  ] =
    readCreationLevelMap(
      form,
      mapName
    );


  return state;
}