import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";

import {
  createCreationActions,
  createCreationMapEditor,
  readCreationLevelMap,
} from "./characterCreationFormCommon.js";


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
