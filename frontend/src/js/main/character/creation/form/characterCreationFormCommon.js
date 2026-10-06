import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";


export function cloneCreationState(
  value
) {
  return JSON.parse(
    JSON.stringify(
      value ||
      {}
    )
  );
}


export function createCreationActions(
  character
) {
  const saveLabel =
    character
      ?.editState
      ?.mode ===
      "approval_draft"
      ? "Salvar rascunho"
      : "Salvar";


  return `
    <div class="character-creation-inline-actions">

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-character-creation-action="cancel"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="btn btn-blood btn-sm"
        data-character-creation-action="save"
      >
        ${saveLabel}
      </button>

    </div>
  `;
}


export function parseCreationLines(
  value
) {
  return String(
    value ||
    ""
  )
    .split(
      /\r?\n/
    )
    .map(
      (
        item
      ) =>
        item.trim()
    )
    .filter(
      Boolean
    );
}


export function arrayToCreationText(
  value
) {
  return Array.isArray(
    value
  )
    ? value.join(
        "\n"
      )
    : "";
}


export function readCreationInteger(
  form,
  field,
  fallback = 0
) {
  const value =
    Number(
      form.querySelector(
        `[data-creation-number="${field}"]`
      )?.value
    );


  return Number.isInteger(
    value
  )
    ? value
    : fallback;
}


export function createCreationMapRow(
  mapName,
  key,
  value,
  type = "level"
) {
  return `
    <div
      class="character-creation-map-row"
      data-creation-map="${escapeSheetHtml(
        mapName
      )}"
      data-creation-map-type="${escapeSheetHtml(
        type
      )}"
    >

      <input
        type="text"
        class="
          form-control
          form-control-sm
          bg-black
          text-light
          border-secondary
        "
        data-creation-map-key
        value="${escapeSheetHtml(
          key
        )}"
        placeholder="${
          type ===
          "specialization"
            ? "Habilidade"
            : "Nome"
        }"
      >

      ${
        type ===
        "specialization"
          ? `
            <input
              type="text"
              class="
                form-control
                form-control-sm
                bg-black
                text-light
                border-secondary
              "
              data-creation-map-value
              value="${escapeSheetHtml(
                value
              )}"
              placeholder="Especialização"
            >
          `
          : `
            <input
              type="number"
              class="
                form-control
                form-control-sm
                bg-black
                text-light
                border-secondary
                character-creation-map-level
              "
              data-creation-map-value
              min="0"
              max="20"
              step="1"
              value="${escapeSheetHtml(
                value
              )}"
            >
          `
      }

      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        data-character-creation-remove-row
        aria-label="Remover"
        title="Remover"
      >
        ×
      </button>

    </div>
  `;
}


export function createCreationMapRows(
  mapName,
  values,
  type = "level"
) {
  const entries =
    Object.entries(
      values ||
      {}
    );


  if (
    entries.length ===
    0
  ) {
    return createCreationMapRow(
      mapName,
      "",
      "",
      type
    );
  }


  return entries
    .map(
      ([
        key,
        value,
      ]) =>
        createCreationMapRow(
          mapName,
          key,
          value,
          type
        )
    )
    .join("");
}


export function createCreationMapEditor({
  mapName,
  title,
  values,
  type = "level",
}) {
  return `
    <div class="character-creation-map-editor">

      <div class="character-creation-editor-heading">

        <span>
          ${escapeSheetHtml(
            title
          )}
        </span>

        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          data-character-creation-add-row="${escapeSheetHtml(
            mapName
          )}"
          data-character-creation-add-type="${escapeSheetHtml(
            type
          )}"
        >
          + Adicionar
        </button>

      </div>

      <div
        class="character-creation-map-rows"
        data-character-creation-map-container="${escapeSheetHtml(
          mapName
        )}"
      >
        ${createCreationMapRows(
          mapName,
          values,
          type
        )}
      </div>

    </div>
  `;
}


export function appendCharacterCreationMapRow(
  container,
  mapName,
  type
) {
  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createCreationMapRow(
      mapName,
      "",
      "",
      type
    );


  const row =
    wrapper.firstElementChild;


  if (
    !row
  ) {
    return;
  }


  container.appendChild(
    row
  );


  row.querySelector(
    "[data-creation-map-key]"
  )?.focus();
}


export function readCreationLevelMap(
  form,
  mapName
) {
  const result =
    {};


  form
    .querySelectorAll(
      `.character-creation-map-row[data-creation-map="${CSS.escape(
        mapName
      )}"]`
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.querySelector(
              "[data-creation-map-key]"
            )?.value ||
            ""
          )
            .trim()
            .toLowerCase();


        const value =
          Number(
            row.querySelector(
              "[data-creation-map-value]"
            )?.value
          );


        if (
          key &&
          Number.isInteger(
            value
          ) &&
          value >
          0
        ) {
          result[
            key
          ] =
            value;
        }
      }
    );


  return result;
}


export function readCreationSpecializations(
  form
) {
  const result =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="specializations"]'
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.querySelector(
              "[data-creation-map-key]"
            )?.value ||
            ""
          )
            .trim()
            .toLowerCase();


        const value =
          String(
            row.querySelector(
              "[data-creation-map-value]"
            )?.value ||
            ""
          ).trim();


        if (
          key &&
          value
        ) {
          result[
            key
          ] =
            value;
        }
      }
    );


  return result;
}