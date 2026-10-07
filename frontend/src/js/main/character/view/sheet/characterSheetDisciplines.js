import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";

import {
  getDisciplineLabel,
  getFixedClanDisciplines,
} from "../../creation/data/clanRuleCatalog.js";

import {
  OUT_OF_CLAN_DISCIPLINE_APPROVAL_MESSAGE,
} from "../../creation/form/discipline/characterCreationDisciplineRows.js";


function normalizeDisciplineProgress(
  progress,
  state
) {
  const total =
    Number(
      progress
        ?.points
        ?.total
    );


  const spent =
    Number(
      progress
        ?.totalLevels
    );


  const fallbackSpent =
    Object.values(
      state?.disciplines ||
      {}
    ).reduce(
      (
        sum,
        level
      ) => {
        const normalized =
          Number(
            level
          );


        return (
          sum +
          (
            Number.isInteger(
              normalized
            ) &&
            normalized >
              0
              ? normalized
              : 0
          )
        );
      },
      0
    );


  return {
    total:
      Number.isInteger(
        total
      )
        ? total
        : 3,

    spent:
      Number.isInteger(
        spent
      )
        ? spent
        : fallbackSpent,
  };
}


function createDisciplineProgress(
  progress,
  state
) {
  const normalized =
    normalizeDisciplineProgress(
      progress,
      state
    );


  const highlight =
    normalized.spent >
    normalized.total;


  return `
    <div
      class="
        d-flex
        justify-content-end
        mb-2
      "
    >
      <span
        class="
          badge
          rounded-pill
          border
          bg-transparent
          ${highlight
            ? "border-danger text-danger"
            : "border-secondary text-secondary"}
        "
      >
        ${escapeSheetHtml(
          normalized.spent
        )}/${escapeSheetHtml(
          normalized.total
        )}
      </span>
    </div>
  `;
}


function getDisciplineEntries(
  character,
  state
) {
  const clanDisciplines =
    getFixedClanDisciplines(
      character
    );


  const current =
    state?.disciplines &&
    typeof state.disciplines ===
      "object"
      ? state.disciplines
      : {};


  const clanEntries =
    clanDisciplines.map(
      (
        discipline
      ) => ({
        discipline,

        level:
          Number(
            current[
              discipline
            ] ||
            0
          ),

        clan:
          true,
      })
    );


  const extraEntries =
    Object.entries(
      current
    )
      .filter(
        ([
          discipline,
          level,
        ]) =>
          !clanDisciplines.includes(
            discipline
          ) &&
          Number(
            level
          ) >
          0
      )
      .map(
        ([
          discipline,
          level,
        ]) => ({
          discipline,

          level:
            Number(
              level
            ),

          clan:
            false,
        })
      );


  return [
    ...clanEntries,
    ...extraEntries,
  ];
}


function createApprovalWarning() {
  return `
    <button
      type="button"
      class="
        character-sheet-warning-inline
        border-0
        character-discipline-approval-warning
      "
      title="${escapeSheetHtml(
        OUT_OF_CLAN_DISCIPLINE_APPROVAL_MESSAGE
      )}"
      aria-label="${escapeSheetHtml(
        OUT_OF_CLAN_DISCIPLINE_APPROVAL_MESSAGE
      )}"
      data-bs-toggle="popover"
      data-bs-trigger="focus"
      data-bs-placement="top"
      data-bs-container="body"
      data-bs-title="Aprovação da Narração"
      data-bs-content="${escapeSheetHtml(
        OUT_OF_CLAN_DISCIPLINE_APPROVAL_MESSAGE
      )}"
    >
      !
    </button>
  `;
}


function createDisciplineList(
  character,
  state
) {
  const entries =
    getDisciplineEntries(
      character,
      state
    );


  if (
    entries.length ===
    0
  ) {
    return `
      <div class="character-sheet-empty">
        Nenhuma disciplina cadastrada.
      </div>
    `;
  }


  return `
    <div
      class="
        character-creation-map-list
        character-discipline-sheet-list
      "
    >

      ${entries
        .map(
          (
            entry
          ) => `
            <div
              class="
                character-sheet-row
                character-discipline-sheet-row
              "
            >

              <span
                class="
                  character-sheet-label
                  character-discipline-sheet-name
                "
              >

                <span>
                  ${escapeSheetHtml(
                    getDisciplineLabel(
                      entry.discipline
                    )
                  )}
                </span>

                ${entry.clan
                  ? `
                    <small
                      class="
                        character-discipline-clan-badge
                      "
                    >
                      Clã
                    </small>
                  `
                  : `
                    <small
                      class="
                        character-discipline-outside-badge
                      "
                    >
                      Fora do clã
                    </small>

                    ${createApprovalWarning()}
                  `
                }

              </span>

              <span
                class="
                  character-sheet-value
                "
              >
                ${Number.isInteger(
                  entry.level
                )
                  ? entry.level
                  : 0}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}


export function createCharacterDisciplineContent({
  character,
  state,
  progress,
}) {
  return `
    ${createDisciplineProgress(
      progress,
      state
    )}

    ${createDisciplineList(
      character,
      state
    )}
  `;
}
