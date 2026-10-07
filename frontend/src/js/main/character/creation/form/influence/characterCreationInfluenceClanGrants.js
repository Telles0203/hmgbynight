import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getClanBackgroundInfluenceChoiceGrants,
} from "../../data/clanRuleCatalog.js";


function getSelections(
  state
) {
  const value =
    state
      ?.clanGrantChoices
      ?.backgroundInfluence;


  return (
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
      ? value
      : {}
  );
}


export function createClanInfluenceChoiceEditor(
  character,
  state
) {
  const groups =
    getClanBackgroundInfluenceChoiceGrants(
      character
    );


  if (
    groups.length ===
    0
  ) {
    return "";
  }


  const selections =
    getSelections(
      state
    );


  return `
    <div
      class="
        character-creation-clan-resource-choices
        mt-3
        mb-3
      "
    >

      <div
        class="
          character-creation-editor-heading
          mb-2
        "
      >
        <span>
          Benefícios do clã
        </span>
      </div>

      <div
        class="
          d-flex
          flex-column
          gap-2
        "
      >

        ${groups
          .map(
            (
              group
            ) => {
              const selected =
                String(
                  selections[
                    group.id
                  ] ||
                  ""
                );


              return `
                <label
                  class="
                    d-flex
                    flex-column
                    gap-1
                  "
                >

                  <span
                    class="
                      small
                      text-secondary
                    "
                  >
                    ${escapeSheetHtml(
                      group.label
                    )}
                  </span>

                  <select
                    class="
                      form-select
                      form-select-sm
                      bg-black
                      text-light
                      border-secondary
                    "
                    data-creation-clan-background-influence-choice="${escapeSheetHtml(
                      group.id
                    )}"
                  >

                    <option value="">
                      Selecione o benefício
                    </option>

                    ${group.options
                      .map(
                        (
                          option
                        ) => `
                          <option
                            value="${escapeSheetHtml(
                              option.key
                            )}"
                            ${selected ===
                            option.key
                              ? "selected"
                              : ""}
                          >
                            ${escapeSheetHtml(
                              option.label
                            )}
                          </option>
                        `
                      )
                      .join("")}

                  </select>

                </label>
              `;
            }
          )
          .join("")}

      </div>

      <small
        class="
          d-block
          character-creation-clan-choice-pending
          mt-2
        "
      >
        Benefícios concedidos pelo clã são gratuitos e não consomem o pool de Antecedentes/Influências.
      </small>

    </div>
  `;
}


export function readClanInfluenceChoices(
  form,
  state
) {
  const selections =
    {};


  form
    .querySelectorAll(
      "[data-creation-clan-background-influence-choice]"
    )
    .forEach(
      (
        select
      ) => {
        const id =
          String(
            select.dataset
              .creationClanBackgroundInfluenceChoice ||
            ""
          )
            .trim()
            .toLowerCase();


        const value =
          String(
            select.value ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          id &&
          value
        ) {
          selections[
            id
          ] =
            value;
        }
      }
    );


  state.clanGrantChoices = {
    ...(
      state.clanGrantChoices &&
      typeof state
        .clanGrantChoices ===
        "object" &&
      !Array.isArray(
        state.clanGrantChoices
      )
        ? state
            .clanGrantChoices
        : {}
    ),

    backgroundInfluence:
      selections,
  };


  return state;
}
