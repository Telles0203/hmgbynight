import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getAbilityDisplayLabel,
} from "../../data/abilityCatalog.js";

import {
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
} from "../../data/clanRuleCatalog.js";


export function createClanAbilityGrantSummary(
  character
) {
  const grants =
    getFixedClanAbilityGrants(
      character
    );


  const entries =
    Object.entries(
      grants
    ).filter(
      ([
        ,
        level,
      ]) =>
        Number(
          level
        ) >
        0
    );


  const choices =
    getClanAbilityChoiceGrants(
      character
    );


  if (
    entries.length ===
      0 &&
    choices.length ===
      0
  ) {
    return "";
  }


  return `
    <div
      class="
        character-creation-clan-ability-grants
      "
    >

      <div
        class="
          character-creation-editor-heading
        "
      >
        <span>
          Concedidas pelo clã
        </span>
      </div>

      ${entries
        .map(
          ([
            entryKey,
            level,
          ]) => `
            <div
              class="
                character-creation-clan-ability-row
              "
            >
              <span>
                ${escapeSheetHtml(
                  getAbilityDisplayLabel(
                    entryKey
                  )
                )}
              </span>

              <span
                class="
                  character-creation-clan-grant-badge
                "
              >
                Clã +${Number(
                  level
                )}
              </span>
            </div>
          `
        )
        .join("")}

      ${choices.length >
        0
          ? `
            <small
              class="
                character-creation-clan-choice-pending
              "
            >
              Este clã possui uma escolha de Habilidade gratuita que será configurada no próximo bloco.
            </small>
          `
          : ""}

    </div>
  `;
}
