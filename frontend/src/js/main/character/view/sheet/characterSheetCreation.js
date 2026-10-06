import {
  escapeSheetHtml,
  createSheetPips,
} from "./characterSheetCommon.js";

import {
  createCreationList,
  createCreationMapList,
} from "./characterSheetCreationLists.js";

import {
  createPendingCreationNotice,
  createPendingDerivedValue,
  createCreationResourceCard,
  createMoralityResourceContent,
  createFreeTraitContent,
  createFreeTraitSpending,
} from "./characterSheetCreationResources.js";


function createEditButton({
  character,
  section,
  label,
  editable,
}) {
  if (
    !editable
  ) {
    return "";
  }


  return `
    <button
      type="button"
      class="
        btn
        btn-link
        btn-sm
        text-secondary
        text-decoration-none
        p-0
        character-creation-section-edit
      "
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-edit="${escapeSheetHtml(
        section
      )}"
      aria-label="Editar ${escapeSheetHtml(
        label
      )}"
      title="Editar ${escapeSheetHtml(
        label
      )}"
    >
      ✎
    </button>
  `;
}


function createSectionTitle({
  character,
  title,
  section,
  editable,
}) {
  return `
    <h4
      class="
        character-sheet-title
        d-flex
        align-items-center
        justify-content-between
        gap-2
      "
    >

      <span>
        ${escapeSheetHtml(
          title
        )}
      </span>

      ${createEditButton({
        character,
        section,
        label:
          title,
        editable,
      })}

    </h4>
  `;
}


function createAttributeSection({
  character,
  state,
  category,
  title,
  editable,
}) {
  const traits =
    state
      ?.attributes
      ?.[
        category
      ] ||
    [];


  const negatives =
    state
      ?.negativeTraits
      ?.[
        category
      ] ||
    [];


  const hasContent =
    traits.length >
      0 ||
    negatives.length >
      0;


  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-section="attributes.${category}"
    >

      ${createSectionTitle({
        character,

        title:
          `${title} / Negativos`,

        section:
          `attributes.${category}`,

        editable,
      })}

      ${
        !hasContent
          ? `
            <div class="character-sheet-empty">
              Nenhum traço cadastrado.
            </div>
          `
          : `
            ${
              traits.length >
                0
                ? `
                  <div class="character-sheet-group">

                    <div class="character-sheet-mini-title">
                      Traits
                    </div>

                    ${createCreationList(
                      traits,
                      ""
                    )}

                  </div>
                `
                : ""
            }

            ${
              negatives.length >
                0
                ? `
                  <div class="character-sheet-group mt-3">

                    <div class="character-sheet-mini-title">
                      Negativos
                    </div>

                    ${createCreationList(
                      negatives,
                      ""
                    )}

                  </div>
                `
                : ""
            }
          `
      }

    </section>
  `;
}


function createEditableGroup({
  character,
  title,
  section,
  content,
  editable,
}) {
  return `
    <div
      class="character-sheet-group"
      data-character-id="${escapeSheetHtml(
        character.id
      )}"
      data-character-creation-section="${escapeSheetHtml(
        section
      )}"
    >

      ${createSectionTitle({
        character,
        title,
        section,
        editable,
      })}

      ${content}

    </div>
  `;
}


function createStaticGroup(
  title,
  message
) {
  return `
    <div class="character-sheet-group">

      <h4 class="character-sheet-subtitle">
        ${escapeSheetHtml(
          title
        )}
      </h4>

      <div class="character-sheet-empty">
        ${escapeSheetHtml(
          message
        )}
      </div>

    </div>
  `;
}


function createBloodContent(
  maximum
) {
  return `
    <div class="character-sheet-pips">

      ${createSheetPips(
        0,
        Number.isInteger(
          maximum
        )
          ? maximum
          : 10
      )}

    </div>
  `;
}


function createWillpowerContent(
  value,
  maximum
) {
  return `
    <div class="character-sheet-pips">

      ${createSheetPips(
        Number.isInteger(
          value
        )
          ? value
          : 0,

        Number.isInteger(
          maximum
        )
          ? maximum
          : 10
      )}

    </div>
  `;
}


function createMeritFlawContent(
  state
) {
  return `
    <div class="character-sheet-row">

      <span class="character-sheet-label">
        Qualidades
      </span>

      <span class="character-sheet-value">
        ${Number(
          state?.meritPoints ||
          0
        )}
      </span>

    </div>

    <div class="character-sheet-row">

      <span class="character-sheet-label">
        Defeitos
      </span>

      <span class="character-sheet-value">
        ${Number(
          state?.flawPoints ||
          0
        )}
      </span>

    </div>

    <div class="character-sheet-row">

      <span class="character-sheet-label">
        Derangement
      </span>

      <span class="character-sheet-value">
        ${
          state?.derangement
            ? "Sim"
            : "Não"
        }
      </span>

    </div>
  `;
}


export function createCharacterCreationSections(
  character,
  editable
) {
  const creation =
    character?.creation ||
    {};


  const state =
    creation.state ||
    {};


  const derived =
    creation.derived ||
    {};


  return `
    <div
      class="character-creation-root"
      data-character-creation-root="${escapeSheetHtml(
        character.id
      )}"
    >

      ${createPendingCreationNotice(
        character
      )}


      <div class="character-sheet-grid">

        ${createCreationResourceCard({
          characterId:
            character.id,

          title:
            "Sangue Máximo",

          content:
            createBloodContent(
              derived.bloodMaximum
            ),
        })}

        ${createCreationResourceCard({
          characterId:
            character.id,

          title:
            "Força de Vontade",

          content:
            createWillpowerContent(
              derived.willpower,
              derived.willpowerMaximum
            ),

          editSection:
            "willpower",

          editable,

          pending:
            createPendingDerivedValue(
              character,
              "willpower",
              derived.willpower
            ),
        })}

        ${createCreationResourceCard({
          characterId:
            character.id,

          title:
            character
              ?.moralityPathLabel ||
            "Humanidade",

          content:
            createMoralityResourceContent(
              derived.morality
            ),

          editSection:
            "morality",

          editable,

          pending:
            createPendingDerivedValue(
              character,
              "morality",
              derived.morality
            ),
        })}

      </div>


      <div class="character-sheet-grid">

        ${createAttributeSection({
          character,
          state,

          category:
            "physical",

          title:
            "Físicos",

          editable,
        })}

        ${createAttributeSection({
          character,
          state,

          category:
            "social",

          title:
            "Sociais",

          editable,
        })}

        ${createAttributeSection({
          character,
          state,

          category:
            "mental",

          title:
            "Mentais",

          editable,
        })}

      </div>


      <div
        class="
          character-sheet-grid
          character-sheet-main-grid
        "
      >

        <section
          class="
            character-section-card
            character-sheet-section
          "
        >

          ${createEditableGroup({
            character,

            title:
              "Habilidades",

            section:
              "abilities",

            editable,

            content:
              createCreationMapList(
                state.abilities,
                "Nenhuma habilidade cadastrada.",
                state.specializations
              ),
          })}

          ${createStaticGroup(
            "Notas",
            "Nenhuma nota cadastrada."
          )}

        </section>


        <section
          class="
            character-section-card
            character-sheet-section
          "
        >

          ${createEditableGroup({
            character,

            title:
              "Disciplinas",

            section:
              "disciplines",

            editable,

            content:
              createCreationMapList(
                state.disciplines,
                "Nenhuma disciplina cadastrada."
              ),
          })}

          ${createStaticGroup(
            "Rituais",
            "Nenhum ritual cadastrado."
          )}

          ${createStaticGroup(
            "Itens / Equipamentos",
            "Nenhum equipamento cadastrado."
          )}

        </section>


        <section
          class="
            character-section-card
            character-sheet-section
          "
        >

          ${createEditableGroup({
            character,

            title:
              "Antecedentes",

            section:
              "backgrounds",

            editable,

            content:
              createCreationMapList(
                state.backgrounds,
                "Nenhum antecedente cadastrado."
              ),
          })}

          ${createEditableGroup({
            character,

            title:
              "Qualidades / Defeitos",

            section:
              "meritsFlaws",

            editable,

            content:
              createMeritFlawContent(
                state
              ),
          })}

          <div class="character-sheet-group">

            <h4 class="character-sheet-subtitle">
              Free Traits
            </h4>

            ${createFreeTraitContent(
              creation
            )}

            ${createFreeTraitSpending(
              creation
            )}

          </div>

          ${createStaticGroup(
            "Influências",
            "Nenhuma influência cadastrada."
          )}

          ${createStaticGroup(
            "Laços de Sangue / Vinculum",
            "Nenhum vínculo cadastrado."
          )}

          ${createStaticGroup(
            "Vitalidade",
            "Nenhum nível cadastrado."
          )}

        </section>

      </div>

    </div>
  `;
}