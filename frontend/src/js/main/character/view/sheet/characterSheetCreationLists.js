import {
  escapeSheetHtml,
  humanizeSheetKey,
} from "./characterSheetCommon.js";


export function createCreationList(
  values,
  emptyText
) {
  if (
    !Array.isArray(
      values
    ) ||
    values.length ===
      0
  ) {
    return `
      <div class="character-sheet-empty">
        ${escapeSheetHtml(
          emptyText
        )}
      </div>
    `;
  }


  return `
    <ul class="character-creation-list">

      ${values
        .map(
          (
            value
          ) => `
            <li>
              ${escapeSheetHtml(
                value
              )}
            </li>
          `
        )
        .join("")}

    </ul>
  `;
}


export function createCreationMapList(
  values,
  emptyText,
  specializations = {}
) {
  const entries =
    Object.entries(
      values ||
      {}
    )
      .filter(
        ([
          ,
          value,
        ]) =>
          Number(
            value
          ) >
          0
      )
      .sort(
        ([
          first,
        ], [
          second,
        ]) =>
          first.localeCompare(
            second
          )
      );


  if (
    entries.length ===
      0
  ) {
    return `
      <div class="character-sheet-empty">
        ${escapeSheetHtml(
          emptyText
        )}
      </div>
    `;
  }


  return `
    <div class="character-creation-map-list">

      ${entries
        .map(
          ([
            key,
            value,
          ]) => `
            <div class="character-sheet-row">

              <span class="character-sheet-label">

                ${escapeSheetHtml(
                  humanizeSheetKey(
                    key
                  )
                )}

                ${
                  specializations[
                    key
                  ]
                    ? `
                      <small class="character-creation-specialization">
                        (${escapeSheetHtml(
                          specializations[
                            key
                          ]
                        )})
                      </small>
                    `
                    : ""
                }

              </span>

              <span class="character-sheet-value">
                ${Number(
                  value
                )}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}


function getPriorityLabel(
  state,
  category
) {
  const priorities =
    state
      ?.attributePriorities ||
    {};


  const entry =
    Object.entries(
      priorities
    ).find(
      ([
        ,
        value,
      ]) =>
        value ===
        category
    );


  if (
    !entry
  ) {
    return "Sem prioridade";
  }


  const labels = {
    primary:
      "Primário",

    secondary:
      "Secundário",

    tertiary:
      "Terciário",
  };


  return (
    labels[
      entry[0]
    ] ||
    entry[0]
  );
}


export function createAttributeGroup(
  state,
  category,
  title
) {
  const values =
    state
      ?.attributes
      ?.[
        category
      ] ||
    [];


  return `
    <div class="character-creation-attribute-group">

      <div class="character-creation-group-title">

        <span>
          ${escapeSheetHtml(
            title
          )}
        </span>

        <small>
          ${escapeSheetHtml(
            getPriorityLabel(
              state,
              category
            )
          )}
        </small>

      </div>

      ${createCreationList(
        values,
        "Nenhum Trait cadastrado."
      )}

    </div>
  `;
}