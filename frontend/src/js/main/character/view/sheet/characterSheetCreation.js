import {
  escapeSheetHtml,
  createSheetPips,
  } from "./characterSheetCommon.js";

import {
  createCreationResourcePips,
} from "../../creation/resource/characterCreationResourcePips.js";

import {
  createCharacterAbilityContent,
} from "./characterSheetAbilities.js";

import {
  createCharacterDisciplineContent,
} from "./characterSheetDisciplines.js";

import {
  createCharacterBackgroundContent,
} from "./characterSheetBackgrounds.js";

import {
  createCreationSectionTitle,
  createAttributeSection,
  } from "./characterSheetCreationAttributes.js";

import {
  createPendingCreationNotice,
  createPendingDerivedValue,
  createCreationResourceCard,
  createMoralityResourceContent,
  createFreeTraitContent,
  createFreeTraitSpending,
  createFreeTraitCostNotice,
} from "./characterSheetCreationResources.js";


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

      ${createCreationSectionTitle({
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
  const normalizedMaximum =
    Number.isInteger(
      maximum
    )
      ? maximum
      : 10;


  return `
    <div class="character-sheet-pips">

      ${createSheetPips(
        normalizedMaximum,
        normalizedMaximum
      )}

    </div>
  `;
}


function createWillpowerContent(
  value,
  maximum,
  freeTraitCost = 0,
  start = null,
  showCreationMarkers = true
) {
  const normalizedMaximum =
    Number.isInteger(
      Number(
        maximum
      )
    )
      ? Number(
          maximum
        )
      : 10;


  const normalizedValue =
    Number.isInteger(
      Number(
        value
      )
    )
      ? Number(
          value
        )
      : 0;


  const normalizedStart =
    Number(
      start
    );


  const pips =
    showCreationMarkers &&
    Number.isInteger(
      normalizedStart
    )
      ? createCreationResourcePips({
          base:
            normalizedStart,

          current:
            normalizedValue,

          maximum:
            normalizedMaximum,

          showSacrificed:
            false,
        })
      : createSheetPips(
          normalizedValue,
          normalizedMaximum
        );


  return `
    <div class="character-sheet-pips">

      ${pips}

    </div>

    ${createFreeTraitCostNotice(
      freeTraitCost
    )}
  `;
}


function createGenerationResourceTitle(
  label,
  firstValue,
  secondValue
) {
  const first =
    Number(
      firstValue
    );


  const second =
    Number(
      secondValue
    );


  if (
    !Number.isInteger(
      first
    ) ||
    !Number.isInteger(
      second
    )
  ) {
    return label;
  }


  return `${label} (${first}/${second})`;
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


  const sections =
    creation.sections ||
    {};


  const derived =
    creation.derived ||
    {};


  const freeTraitSpending =
    creation
      ?.freeTraits
      ?.spending ||
    {};


  const freeTraitSources =
    creation
      ?.freeTraits
      ?.sources ||
    {};


  const showFreeTraitMarkers =
    String(
      character
        ?.sheetLifecycle ||
      ""
    ) !==
    "active";


  const abilityLabels =
    Object.fromEntries(
      (
        window.ByNightMain
          ?.character
          ?.options
          ?.abilities ||
        []
      ).map(
        (
          ability
        ) => [
          String(
            ability?.value ||
            ""
          ),

          String(
            ability?.label ||
            ability?.value ||
            ""
          ),
        ]
      )
    );


  const bloodTitle =
    createGenerationResourceTitle(
      "Sangue Máximo",
      derived.bloodMaximum,
      derived.bloodPerTurn
    );


  const willpowerTitle =
    createGenerationResourceTitle(
      "Força de Vontade",
      derived
        ?.generationRules
        ?.willpowerStart,
      derived.willpowerMaximum
    );


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
            bloodTitle,

          content:
            createBloodContent(
              derived.bloodMaximum
            ),
        })}

        ${createCreationResourceCard({
          characterId:
            character.id,

          title:
            willpowerTitle,

          content:
            createWillpowerContent(
              derived.willpower,
              derived.willpowerMaximum,
              freeTraitSpending
                .willpower,

              derived
                ?.generationRules
                ?.willpowerStart,

              showFreeTraitMarkers
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
              derived.morality,

              freeTraitSpending
                .morality,

              freeTraitSources
                .moralitySacrifice,

              sections
                ?.morality
                ?.base,

              showFreeTraitMarkers
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

          progress:
            sections.attributes,

          category:
            "physical",

          title:
            "Físicos",

          editable,
        })}

        ${createAttributeSection({
          character,
          state,

          progress:
            sections.attributes,

          category:
            "social",

          title:
            "Sociais",

          editable,
        })}

        ${createAttributeSection({
          character,
          state,

          progress:
            sections.attributes,

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
              createCharacterAbilityContent({
                state,

                progress:
                  sections.abilities,

                abilityFreeTraitCost:
                  freeTraitSpending
                    .abilities,

                specializationFreeTraitCost:
                  freeTraitSpending
                    .specializations,

                showFreeTraitMarkers,
              }),
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
              createCharacterDisciplineContent({
                character,
                state,

                progress:
                  sections.disciplines,

                disciplineFreeTraitCost:
                  freeTraitSpending
                    .disciplines,

                showFreeTraitMarkers,
              }),
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
              createCharacterBackgroundContent({
                state,

                progress:
                  sections.backgrounds,

                backgroundFreeTraitCost:
                  freeTraitSpending
                    .backgrounds,

                showFreeTraitMarkers,
              }),
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
