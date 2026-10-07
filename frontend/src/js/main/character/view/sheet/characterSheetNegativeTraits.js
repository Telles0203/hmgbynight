import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getFixedClanNegativeTraitGrants,
} from "../../creation/data/clanRuleCatalog.js";

import {
  createSavedNegativeTraitGainNotice,
} from "../../creation/form/characterCreationNegativeTraitGain.js";


function expandClanNegativeTraits(
  grants
) {
  if (
    !Array.isArray(
      grants
    )
  ) {
    return [];
  }


  return grants.flatMap(
    (
      grant
    ) => {
      const count =
        Math.max(
          1,
          Number(
            grant?.count
          ) ||
          1
        );


      return Array.from(
        {
          length:
            count,
        },
        () => ({
          ...grant,
        })
      );
    }
  );
}


export function createCharacterNegativeTraitList({
  character,
  category,
  selected,
}) {
  const regular =
    Array.isArray(
      selected
    )
      ? selected
          .map(
            (
              trait
            ) =>
              String(
                trait ||
                ""
              ).trim()
          )
          .filter(
            Boolean
          )
      : [];


  const clan =
    expandClanNegativeTraits(
      getFixedClanNegativeTraitGrants(
        character,
        category
      )
    );


  if (
    regular.length ===
      0 &&
    clan.length ===
      0
  ) {
    return "";
  }


  return `
    <ul
      class="
        character-creation-list
        character-negative-trait-list
      "
    >

      ${regular
        .map(
          (
            trait
          ) => `
            <li>
              ${escapeSheetHtml(
                trait
              )}
            </li>
          `
        )
        .join("")}

      ${clan
        .map(
          (
            grant
          ) => `
            <li
              class="
                character-clan-negative-trait
              "
            >

              <span>
                ${escapeSheetHtml(
                  grant?.value ||
                  ""
                )}
              </span>

              <small
                class="
                  character-creation-clan-negative-badge
                "
              >
                Clã · bloqueado
              </small>

            </li>
          `
        )
        .join("")}

    </ul>

    ${createSavedNegativeTraitGainNotice(
      regular.length
    )}
  `;
}
