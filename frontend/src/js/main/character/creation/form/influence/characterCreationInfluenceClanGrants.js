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


function getPendingGroups(
  groups,
  selections
) {
  return groups.filter(
    (
      group
    ) => {
      const selected =
        String(
          selections[
            group.id
          ] ||
          ""
        )
          .trim()
          .toLowerCase();


      return !group.options.some(
        (
          option
        ) =>
          String(
            option?.key ||
            ""
          )
            .trim()
            .toLowerCase() ===
          selected
      );
    }
  );
}


function createPendingChoiceNotice(
  pendingGroups
) {
  if (
    pendingGroups.length ===
    0
  ) {
    return "";
  }


  return `
    <div
      class="
        character-creation-pending
        mb-2
      "
    >

      <span
        class="
          character-creation-pending-icon
        "
      >
        !
      </span>

      <div>

        <strong>
          Benefício de clã pendente
        </strong>

        <small>
          ${pendingGroups.length === 1
            ? "Selecione o benefício obrigatório do clã antes de concluir a criação."
            : `Selecione os ${pendingGroups.length} benefícios obrigatórios do clã antes de concluir a criação.`}
        </small>

      </div>

    </div>
  `;
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


  const pendingGroups =
    getPendingGroups(
      groups,
      selections
    );


  return `
    <div
      class="
        character-creation-clan-resource-choices
        mt-3
        mb-3
      "
      data-creation-clan-resource-choices
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

      ${createPendingChoiceNotice(
        pendingGroups
      )}

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


              const pending =
                pendingGroups
                  .some(
                    (
                      pendingGroup
                    ) =>
                      pendingGroup.id ===
                      group.id
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
                      ${pending
                        ? "text-danger"
                        : "text-secondary"}
                    "
                  >
                    ${escapeSheetHtml(
                      group.label
                    )}

                    ${pending
                      ? " — escolha obrigatória"
                      : ""}
                  </span>

                  <select
                    class="
                      form-select
                      form-select-sm
                      bg-black
                      text-light
                      ${pending
                        ? "border-danger"
                        : "border-secondary"}
                    "
                    data-creation-clan-background-influence-choice="${escapeSheetHtml(
                      group.id
                    )}"
                    data-creation-clan-choice-preview-value="${escapeSheetHtml(
                      selected
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


export function readClanInfluenceChoiceSelections(
  form
) {
  const selections =
    {};


  form
    ?.querySelectorAll(
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


  return selections;
}


export function readClanInfluenceChoices(
  form,
  state
) {
  const selections =
    readClanInfluenceChoiceSelections(
      form
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
