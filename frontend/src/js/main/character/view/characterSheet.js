export function createCharacterSheet({
  characterId,
  title,
  concept,
  natureLabel,
  demeanorLabel,
  moralityPathLabel,
  moralityRating,
  activeVirtues,
  virtuePoints,
  canEditDirectly,
  canEditVirtues,
  clan,
  clanValue,
  sect,
  house,
}) {
  const character =
    getLoadedCharacter(
      characterId
    );


  const resolvedTitle =
    typeof title ===
      "string"
      ? title
      : String(
          character?.title ||
          ""
        );


  const resolvedClanValue =
    typeof clanValue ===
      "string" &&
    clanValue
      ? clanValue
      : String(
          character?.clan ||
          ""
        );


  const resolvedCanEditDirectly =
    typeof canEditDirectly ===
      "boolean"
      ? canEditDirectly
      : (
          character
            ?.editState
            ?.directEdit ??
          !character?.motherHouse
        );


  const resolvedCanEditVirtues =
    typeof canEditVirtues ===
      "boolean"
      ? canEditVirtues
      : resolvedCanEditDirectly;


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

                editable:
                  resolvedCanEditDirectly,
              })}


              ${createIdentityFieldRow({
                characterId:
                  safeCharacterId,

                field:
                  "clan",

                label:
                  "Clã",

                value:
                  resolvedClanValue,

                displayValue:
                  clan,

                editable:
                  resolvedCanEditDirectly,
              })}


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

                editable:
                  resolvedCanEditDirectly,
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

                editable:
                  resolvedCanEditDirectly,
              })}


              ${createIdentityFieldRow({
                characterId:
                  safeCharacterId,

                field:
                  "title",

                label:
                  "Título",

                value:
                  resolvedTitle,

                displayValue:
                  resolvedTitle,

                editable:
                  resolvedCanEditDirectly,
              })}

            </section>


            <section
              class="
                character-section-card
                character-sheet-section
                character-virtues-section
              "
              data-character-id="${safeCharacterId}"
              data-virtues-editable="${
                resolvedCanEditVirtues
                  ? "true"
                  : "false"
              }"
              data-editing="false"
            >

              ${createVirtueTitle({
                virtuePoints,
                canEditVirtues:
                  resolvedCanEditVirtues,
              })}


              ${createVirtueRows({
                activeVirtues,
                canEditVirtues:
                  resolvedCanEditVirtues,
              })}


              ${
                resolvedCanEditVirtues
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

          </div>


          <div
            class="character-sheet-grid character-sheet-resource-grid"
          >

            ${createResourceSection(
              "Sangue Máximo"
            )}

            ${createResourceSection(
              "Força de Vontade"
            )}

            <section
              class="
                character-section-card
                character-sheet-section
                character-sheet-resource
              "
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
                ${createEmptyPips(
                  10
                )}
              </div>

            </section>

          </div>


          <div class="character-sheet-grid">

            ${createEmptySection(
              "Físicos / Negativos",
              "Nenhum traço cadastrado."
            )}

            ${createEmptySection(
              "Sociais / Negativos",
              "Nenhum traço cadastrado."
            )}

            ${createEmptySection(
              "Mentais / Negativos",
              "Nenhum traço cadastrado."
            )}

          </div>


          <div
            class="
              character-sheet-grid
              character-sheet-main-grid
            "
          >

            <section
              class="character-section-card character-sheet-section"
            >

              ${createGroup(
                "Habilidades",
                "Nenhuma habilidade cadastrada."
              )}

              ${createGroup(
                "Notas",
                "Nenhuma nota cadastrada.",
                true
              )}

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              ${createGroup(
                "Disciplinas",
                "Nenhuma disciplina cadastrada."
              )}

              ${createGroup(
                "Rituais",
                "Nenhum ritual cadastrado.",
                true
              )}

              ${createGroup(
                "Itens / Equipamentos",
                "Nenhum equipamento cadastrado.",
                true
              )}

            </section>


            <section
              class="character-section-card character-sheet-section"
            >

              ${createGroup(
                "Antecedentes",
                "Nenhum antecedente cadastrado."
              )}

              ${createGroup(
                "Qualidades / Defeitos",
                "Nenhuma característica cadastrada.",
                true
              )}

              ${createGroup(
                "Influências",
                "Nenhuma influência cadastrada.",
                true
              )}

              ${createGroup(
                "Laços de Sangue / Vinculum",
                "Nenhum vínculo cadastrado.",
                true
              )}

              ${createGroup(
                "Vitalidade",
                "Nenhum nível cadastrado.",
                true
              )}

            </section>

          </div>

        </div>

      </div>

    </div>
  `;
}


function createIdentityFieldRow({
  characterId,
  field,
  label,
  value,
  displayValue,
  editable,
}) {
  const safeField =
    escapeSheetHtml(
      field
    );


  const safeLabel =
    escapeSheetHtml(
      label
    );


  const safeDisplayValue =
    escapeSheetHtml(
      displayValue ||
      value ||
      ""
    );


  return `
    <div
      class="
        character-sheet-row
        character-identity-row
      "
      data-character-id="${characterId}"
      data-character-field="${safeField}"
    >

      <span class="character-sheet-label">
        ${safeLabel}
      </span>

      <span
        class="
          character-sheet-value
          character-identity-value
        "
      >

        <span class="character-inline-display">

          <span class="character-field-display">
            ${safeDisplayValue || "—"}
          </span>

          ${
            editable
              ? `
                <button
                  type="button"
                  class="
                    btn
                    btn-link
                    btn-sm
                    text-secondary
                    text-decoration-none
                    p-0
                    character-inline-edit-button
                  "
                  data-character-identity-action="edit"
                  aria-label="Editar ${safeLabel}"
                  title="Editar ${safeLabel}"
                >
                  ✎
                </button>
              `
              : ""
          }

        </span>

      </span>

    </div>
  `;
}


function createEditableFieldRow({
  characterId,
  field,
  label,
  value,
  editLabel,
  editable,
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
      value ||
      ""
    );


  const safeEditLabel =
    escapeSheetHtml(
      editLabel
    );


  return `
    <div
      class="
        character-sheet-row
        character-editable-row
      "
      data-character-id="${characterId}"
      data-character-field="${safeField}"
    >

      <span class="character-sheet-label">
        ${safeLabel}
      </span>

      <span
        class="
          character-sheet-value
          character-editable-value
        "
      >

        <span class="character-inline-display">

          <span class="character-field-display">
            ${safeValue || "—"}
          </span>

          ${
            editable
              ? `
                <button
                  type="button"
                  class="
                    btn
                    btn-link
                    btn-sm
                    text-secondary
                    text-decoration-none
                    p-0
                    character-inline-edit-button
                  "
                  data-character-inline-action="edit"
                  aria-label="${safeEditLabel}"
                  title="${safeEditLabel}"
                >
                  ✎
                </button>
              `
              : ""
          }

        </span>

      </span>

    </div>
  `;
}


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


function createResourceSection(
  title
) {
  return `
    <section
      class="
        character-section-card
        character-sheet-section
        character-sheet-resource
      "
    >

      <h4 class="character-sheet-title">
        ${escapeSheetHtml(
          title
        )}
      </h4>

      <div class="character-sheet-pips">
        ${createEmptyPips(
          10
        )}
      </div>

    </section>
  `;
}


function createEmptySection(
  title,
  message
) {
  return `
    <section
      class="
        character-section-card
        character-sheet-section
      "
    >

      <h4 class="character-sheet-title">
        ${escapeSheetHtml(
          title
        )}
      </h4>

      <div class="character-sheet-empty">
        ${escapeSheetHtml(
          message
        )}
      </div>

    </section>
  `;
}


function createGroup(
  title,
  message,
  subtitle = false
) {
  return `
    <div class="character-sheet-group">

      <h4
        class="${
          subtitle
            ? "character-sheet-subtitle"
            : "character-sheet-title"
        }"
      >
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


function getLoadedCharacter(
  characterId
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return null;
  }


  return (
    characters.find(
      (
        character
      ) =>
        String(
          character.id
        ) ===
        String(
          characterId
        )
    ) ||
    null
  );
}


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