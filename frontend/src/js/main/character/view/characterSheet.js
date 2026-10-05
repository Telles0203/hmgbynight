// =============================================
// Character Sheet
// =============================================

export function createCharacterSheet({
  characterId,
  concept,
  natureLabel,
  demeanorLabel,
  moralityPathLabel,
  moralityRating,
  activeVirtues,
  virtuePoints,
  canEditVirtues,
  clan,
  sect,
  house,
}) {
  const safeCharacterId =
    escapeSheetHtml(
      characterId
    );


  const safeMoralityPathLabel =
    escapeSheetHtml(
      moralityPathLabel ||
      "Humanidade"
    );


  return `
    <div class="character-card-details">

      <div class="character-card-details-inner">

        <div class="character-sheet">


          <!-- ============================== -->
          <!-- IDENTIDADE -->
          <!-- ============================== -->

          <div class="character-sheet-grid">

            <section
              class="character-section-card character-sheet-section"
            >

              <h4 class="character-sheet-title">
                Vampiro
              </h4>


              ${createEditableFieldRow({
                characterId:
                  safeCharacterId,

                field:
                  "concept",

                label:
                  "Conceito",

                value:
                  concept,

                editLabel:
                  "Editar conceito",
              })}


              <div class="character-sheet-row">

                <span class="character-sheet-label">
                  Clã
                </span>

                <span class="character-sheet-value">
                  ${clan || "—"}
                </span>

              </div>


              <div class="character-sheet-row">

                <span
                  class="character-sheet-label d-inline-flex align-items-center gap-1"
                >
                  Geração

                  <button
                    type="button"
                    class="btn btn-outline-secondary rounded-circle p-0 character-generation-help"
                    aria-label="Informações sobre Geração"
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-placement="right"
                    data-bs-container="body"
                    data-bs-custom-class="character-generation-popover"
                    data-bs-title="Geração"
                    data-bs-content="Todo personagem começa na 13ª Geração. Ela não pode ser alterada diretamente neste campo. Ela somente poderá ser reduzida através do Antecedente Geração."
                  >
                    ?
                  </button>

                </span>


                <span class="character-sheet-value">
                  13ª
                </span>

              </div>


              <div class="character-sheet-row">

                <span class="character-sheet-label">
                  Seita
                </span>

                <span class="character-sheet-value">
                  ${sect || "—"}
                </span>

              </div>


              <div class="character-sheet-row">

                <span class="character-sheet-label">
                  Crônica
                </span>

                <span class="character-sheet-value">
                  ${house}
                </span>

              </div>

            </section>


            <!-- ============================== -->
            <!-- PERSONALIDADE -->
            <!-- ============================== -->

            <section
              class="character-section-card character-sheet-section"
            >

              <h4 class="character-sheet-title">
                Personalidade
              </h4>


              ${createEditableFieldRow({
                characterId:
                  safeCharacterId,

                field:
                  "nature",

                label:
                  "Natureza",

                value:
                  natureLabel,

                editLabel:
                  "Editar Natureza",
              })}


              ${createEditableFieldRow({
                characterId:
                  safeCharacterId,

                field:
                  "demeanor",

                label:
                  "Comportamento",

                value:
                  demeanorLabel,

                editLabel:
                  "Editar Comportamento",
              })}


              <div class="character-sheet-row">

                <span class="character-sheet-label">
                  Título
                </span>

                <span class="character-sheet-value">
                  —
                </span>

              </div>

            </section>


            <!-- ============================== -->
            <!-- VIRTUDES -->
            <!-- ============================== -->

            <section
              class="
                character-section-card
                character-sheet-section
                character-virtues-section
              "
              data-character-id="${safeCharacterId}"
              data-virtues-editable="${
                canEditVirtues
                  ? "true"
                  : "false"
              }"
              data-editing="false"
            >

              ${createVirtueTitle({
                virtuePoints,
                canEditVirtues,
              })}


              ${createVirtueRows({
                activeVirtues,
                canEditVirtues,
              })}


              ${
                canEditVirtues
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
                          class="
                            btn
                            btn-outline-secondary
                            btn-sm
                          "
                          data-character-virtue-action="cancel"
                        >
                          Cancelar
                        </button>


                        <button
                          type="button"
                          class="
                            btn
                            btn-blood
                            btn-sm
                          "
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

          </div>


          <!-- ============================== -->
          <!-- RECURSOS -->
          <!-- ============================== -->

          <div
            class="character-sheet-grid character-sheet-resource-grid"
          >

            <section
              class="character-section-card character-sheet-section character-sheet-resource"
            >

              <h4 class="character-sheet-title">
                Sangue Máximo
              </h4>

              <div class="character-sheet-pips">
                ${createEmptyPips(10)}
              </div>

            </section>


            <section
              class="character-section-card character-sheet-section character-sheet-resource"
            >

              <h4 class="character-sheet-title">
                Força de Vontade
              </h4>

              <div class="character-sheet-pips">
                ${createEmptyPips(10)}
              </div>

            </section>


            <section
              class="character-section-card character-sheet-section character-sheet-resource"
              data-morality-rating="${
                Number.isFinite(
                  moralityRating
                )
                  ? moralityRating
                  : ""
              }"
            >

              <h4 class="character-sheet-title">
                ${safeMoralityPathLabel}
              </h4>

              <div class="character-sheet-pips">
                ${createEmptyPips(10)}
              </div>

            </section>

          </div>


          <!-- ============================== -->
          <!-- ATRIBUTOS -->
          <!-- ============================== -->

          <div class="character-sheet-grid">

            <section
              class="character-section-card character-sheet-section"
            >

              <h4 class="character-sheet-title">
                Físicos / Negativos
              </h4>

              <div class="character-sheet-empty">
                Nenhum traço cadastrado.
              </div>

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              <h4 class="character-sheet-title">
                Sociais / Negativos
              </h4>

              <div class="character-sheet-empty">
                Nenhum traço cadastrado.
              </div>

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              <h4 class="character-sheet-title">
                Mentais / Negativos
              </h4>

              <div class="character-sheet-empty">
                Nenhum traço cadastrado.
              </div>

            </section>

          </div>


          <!-- ============================== -->
          <!-- CORPO PRINCIPAL -->
          <!-- ============================== -->

          <div
            class="character-sheet-grid character-sheet-main-grid"
          >

            <section
              class="character-section-card character-sheet-section"
            >

              <div class="character-sheet-group">

                <h4 class="character-sheet-title">
                  Habilidades
                </h4>

                <div class="character-sheet-empty">
                  Nenhuma habilidade cadastrada.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Notas
                </h4>

                <div class="character-sheet-empty">
                  Nenhuma nota cadastrada.
                </div>

              </div>

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              <div class="character-sheet-group">

                <h4 class="character-sheet-title">
                  Disciplinas
                </h4>

                <div class="character-sheet-empty">
                  Nenhuma disciplina cadastrada.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Rituais
                </h4>

                <div class="character-sheet-empty">
                  Nenhum ritual cadastrado.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Itens / Equipamentos
                </h4>

                <div class="character-sheet-empty">
                  Nenhum equipamento cadastrado.
                </div>

              </div>

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              <div class="character-sheet-group">

                <h4 class="character-sheet-title">
                  Antecedentes
                </h4>

                <div class="character-sheet-empty">
                  Nenhum antecedente cadastrado.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Qualidades / Defeitos
                </h4>

                <div class="character-sheet-empty">
                  Nenhuma característica cadastrada.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Influências
                </h4>

                <div class="character-sheet-empty">
                  Nenhuma influência cadastrada.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Laços de Sangue / Vinculum
                </h4>

                <div class="character-sheet-empty">
                  Nenhum vínculo cadastrado.
                </div>

              </div>


              <div class="character-sheet-group">

                <h4 class="character-sheet-subtitle">
                  Vitalidade
                </h4>

                <div class="character-sheet-empty">
                  Nenhum nível cadastrado.
                </div>

              </div>

            </section>

          </div>

        </div>

      </div>

    </div>
  `;
}


// =============================================
// Virtue title
// =============================================

function createVirtueTitle({
  virtuePoints,
  canEditVirtues,
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
          canEditVirtues
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
                title="Pontos de Virtude distribuídos na criação"
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


// =============================================
// Virtue rows
// =============================================

function createVirtueRows({
  activeVirtues,
  canEditVirtues,
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
        Nenhuma virtude disponível.
      </div>
    `;
  }


  return activeVirtues
    .map(
      (virtue) => {
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


        const maximum =
          Number.isFinite(
            virtue?.maximum
          )
            ? virtue.maximum
            : 5;


        const value =
          Number.isFinite(
            virtue?.value
          )
            ? virtue.value
            : minimum;


        return `
          <div
            class="character-sheet-row character-virtue-row"
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
              <span
                class="character-virtue-view-value"
              >
                ${value}
              </span>
            </span>


            ${
              canEditVirtues
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


// =============================================
// Editable field row
// =============================================

function createEditableFieldRow({
  characterId,
  field,
  label,
  value,
  editLabel,
}) {
  const safeField =
    escapeSheetHtml(
      field
    );


  const safeLabel =
    escapeSheetHtml(
      label
    );


  const safeValue =
    escapeSheetHtml(
      value || ""
    );


  const safeEditLabel =
    escapeSheetHtml(
      editLabel
    );


  return `
    <div
      class="character-sheet-row character-editable-row"
      data-character-id="${characterId}"
      data-character-field="${safeField}"
    >

      <span class="character-sheet-label">
        ${safeLabel}
      </span>


      <span
        class="character-sheet-value character-editable-value"
      >

        <span class="character-inline-display">

          <span class="character-field-display">
            ${safeValue || "—"}
          </span>


          <button
            type="button"
            class="btn btn-link btn-sm text-secondary text-decoration-none p-0 character-inline-edit-button"
            data-character-inline-action="edit"
            aria-label="${safeEditLabel}"
            title="${safeEditLabel}"
          >
            ✎
          </button>

        </span>

      </span>

    </div>
  `;
}


// =============================================
// Pips
// =============================================

function createEmptyPips(
  amount
) {
  return Array.from(
    {
      length:
        amount,
    },

    () =>
      '<span class="character-sheet-pip"></span>'
  ).join("");
}


// =============================================
// Escape
// =============================================

function escapeSheetHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ?? ""
    );


  return element.innerHTML;
}