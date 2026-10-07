import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";


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


export function createClanNegativeTraitSummary(
  grants
) {
  const entries =
    expandClanNegativeTraits(
      grants
    );


  if (
    entries.length ===
      0
  ) {
    return "";
  }


  return `
    <div
      class="
        character-creation-clan-negative-traits
      "
    >

      <div
        class="
          character-creation-editor-heading
        "
      >
        <span>
          Traits Negativos do Clã
        </span>
      </div>

      ${entries
        .map(
          (
            grant
          ) => `
            <div
              class="
                character-creation-clan-negative-row
              "
            >

              <span>
                ${escapeSheetHtml(
                  grant?.value ||
                  ""
                )}
              </span>

              <span
                class="
                  character-creation-clan-negative-badge
                "
              >
                Clã · bloqueado
              </span>

            </div>
          `
        )
        .join("")}

      <small
        class="
          character-creation-clan-negative-note
        "
      >
        Estes Traits são impostos pelo clã e não concedem Free Traits.
      </small>

    </div>
  `;
}
