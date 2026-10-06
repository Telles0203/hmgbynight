import "../creation/characterCreationEditor.js";

import {
  createVampireSection,
  createPersonalitySection,
} from "./sheet/characterSheetIdentity.js";

import {
  createCharacterVirtuesSection,
} from "./sheet/characterSheetVirtues.js";

import {
  createCharacterCreationSections,
} from "./sheet/characterSheetCreation.js";


export function createCharacterSheet({
  characterId,
  title,
  concept,
  natureLabel,
  demeanorLabel,
  activeVirtues,
  virtuePoints,
  canEditDirectly,
  canEditVirtues,
  clan,
  clanValue,
  sect,
  house,
}) {
  const character =
    getLoadedCharacter(
      characterId
    );


  const editable =
    typeof canEditDirectly ===
      "boolean"
      ? canEditDirectly
      : (
          character
            ?.editState
            ?.canEdit ??
          !character?.motherHouse
        );


  const virtuesEditable =
    typeof canEditVirtues ===
      "boolean"
      ? canEditVirtues
      : editable;


  const generation =
    character
      ?.creation
      ?.derived
      ?.generation ??
    13;


  return `
    <div class="character-card-details">

      <div class="character-card-details-inner">

        <div class="character-sheet">

          <div
            class="
              character-sheet-grid
              character-sheet-top-grid
            "
          >

            ${createVampireSection({
              characterId,

              concept:
                concept ||
                character?.concept ||
                "",

              clan:
                clan ||
                character?.clanDisplayName ||
                "",

              clanValue:
                clanValue ||
                character?.clan ||
                "",

              generation,

              sect:
                sect ||
                window.getSectLabel?.(
                  character?.sect
                ) ||
                character?.sect ||
                "",

              house,

              editable,
            })}

            ${createPersonalitySection({
              characterId,

              title:
                typeof title ===
                "string"
                  ? title
                  : character?.title ||
                    "",

              natureLabel:
                natureLabel ||
                character?.natureLabel ||
                "",

              demeanorLabel:
                demeanorLabel ||
                character?.demeanorLabel ||
                "",

              editable,
            })}

            ${createCharacterVirtuesSection({
              characterId,

              activeVirtues:
                activeVirtues ||
                character?.activeVirtues ||
                [],

              virtuePoints:
                virtuePoints ||
                character?.virtuePoints ||
                {
                  total:
                    7,

                  spent:
                    0,

                  remaining:
                    7,

                  complete:
                    false,
                },

              editable:
                virtuesEditable,
            })}

          </div>

          ${createCharacterCreationSections(
            character,
            editable
          )}

        </div>

      </div>

    </div>
  `;
}


function getLoadedCharacter(
  characterId
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return null;
  }


  return (
    characters.find(
      (
        character
      ) =>
        String(
          character.id
        ) ===
        String(
          characterId
        )
    ) ||
    null
  );
}