import {
  escapeSheetHtml,
} from "./characterSheetCommon.js";


function createVirtueTitle({
  virtuePoints,
  editable,
}) {
  const spent =
    Number.isFinite(
      virtuePoints?.spent
    )
      ? virtuePoints.spent
      : 0;


  const total =
    Number.isFinite(
      virtuePoints?.total
    )
      ? virtuePoints.total
      : 7;


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
        Virtudes
      </span>

      <span
        class="
          d-inline-flex
          align-items-center
          gap-2
        "
      >

        ${
          editable
            ? `
              <span
                class="
                  badge
                  rounded-pill
                  border
                  border-secondary
                  text-secondary
                  bg-transparent
                "
                data-virtue-points
              >
                ${spent}/${total}
              </span>

              <button
                type="button"
                class="
                  btn
                  btn-link
                  btn-sm
                  text-secondary
                  text-decoration-none
                  p-0
                  character-virtue-edit-button
                "
                data-character-virtue-action="edit"
                aria-label="Editar Virtudes"
                title="Editar Virtudes"
              >
                ✎
              </button>
            `
            : ""
        }

      </span>

    </h4>
  `;
}


function createVirtueFreeTraitCostNotice(
  virtuePoints
) {
  const cost =
    Number(
      virtuePoints
        ?.freeTraitCost
    );


  const normalizedCost =
    Number.isFinite(
      cost
    )
      ? Math.max(
          0,
          cost
        )
      : 0;


  return `
    <small
      class="
        character-free-trait-inline-cost
        ${normalizedCost > 0
          ? ""
          : "d-none"}
      "
      data-virtue-free-trait-cost
    >
      ${normalizedCost > 0
        ? `Extra da criação: -${normalizedCost} Free Traits`
        : ""}
    </small>
  `;
}


function createVirtueRows({
  activeVirtues,
  editable,
}) {
  if (
    !Array.isArray(
      activeVirtues
    ) ||
    activeVirtues.length ===
      0
  ) {
    return `
      <div class="character-sheet-empty">
        Nenhuma Virtude disponível.
      </div>
    `;
  }


  return activeVirtues
    .map(
      (
        virtue
      ) => {
        const safeKey =
          escapeSheetHtml(
            virtue?.key ||
            ""
          );


        const safeLabel =
          escapeSheetHtml(
            virtue?.label ||
            ""
          );


        const minimum =
          Number.isFinite(
            virtue?.minimum
          )
            ? virtue.minimum
            : 0;


        const value =
          Number.isFinite(
            virtue?.value
          )
            ? virtue.value
            : minimum;


        return `
          <div
            class="
              character-sheet-row
              character-virtue-row
            "
            data-virtue-key="${safeKey}"
            data-saved-value="${value}"
          >

            <span class="character-sheet-label">
              ${safeLabel}
            </span>

            <span
              class="
                character-sheet-value
                character-virtue-view
              "
            >
              <span class="character-virtue-view-value">
                ${value}
              </span>
            </span>

            ${
              editable
                ? `
                  <span
                    class="
                      character-sheet-value
                      character-virtue-edit-controls
                      d-inline-flex
                      align-items-center
                      justify-content-end
                      gap-2
                      d-none
                    "
                  >

                    <button
                      type="button"
                      class="
                        btn
                        btn-outline-secondary
                        btn-sm
                        py-0
                        px-2
                      "
                      data-character-virtue-action="decrease"
                    >
                      −
                    </button>

                    <span
                      class="
                        character-virtue-edit-value
                        fw-semibold
                      "
                    >
                      ${value}
                    </span>

                    <button
                      type="button"
                      class="
                        btn
                        btn-outline-secondary
                        btn-sm
                        py-0
                        px-2
                      "
                      data-character-virtue-action="increase"
                    >
                      +
                    </button>

                  </span>
                `
                : ""
            }

          </div>
        `;
      }
    )
    .join("");
}


export function createCharacterVirtuesSection({
  characterId,
  activeVirtues,
  virtuePoints,
  editable,
}) {
  return `
    <section
      class="
        character-section-card
        character-sheet-section
        character-virtues-section
      "
      data-character-id="${escapeSheetHtml(
        characterId
      )}"
      data-virtues-editable="${
        editable
          ? "true"
          : "false"
      }"
      data-editing="false"
    >

      ${createVirtueTitle({
        virtuePoints,
        editable,
      })}

      ${createVirtueRows({
        activeVirtues,
        editable,
      })}

      ${createVirtueFreeTraitCostNotice(
        virtuePoints
      )}

      ${
        editable
          ? `
            <div
              class="
                character-virtue-edit-footer
                d-none
                mt-3
                pt-2
                border-top
                border-secondary
              "
            >

              <div
                class="
                  character-virtue-draft-message
                  text-secondary
                  small
                  mb-2
                "
              >
                Modo de edição.
              </div>

              <div
                class="
                  d-flex
                  justify-content-end
                  gap-2
                "
              >

                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  data-character-virtue-action="cancel"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  class="btn btn-blood btn-sm"
                  data-character-virtue-action="save"
                  disabled
                >
                  OK
                </button>

              </div>

            </div>
          `
          : ""
      }

      <div
        class="
          character-inline-error
          character-virtue-error
          text-danger
          small
          mt-2
          d-none
        "
        role="alert"
      ></div>

    </section>
  `;
}
