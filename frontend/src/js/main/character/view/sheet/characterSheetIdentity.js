import { escapeSheetHtml } from "./characterSheetCommon.js";

const GENERATION_HELP_TEXT =
  "Laws of the Night Revised — referência: tabela de Geração / Blood Traits, na seção de criação do personagem. A geração define limites importantes da ficha, como sangue máximo, gasto de sangue por turno e outros limites vinculados à linhagem. A paginação pode variar conforme a edição utilizada.";

function escapeAttribute(value) {
  return escapeSheetHtml(value).replace(/"/g, "&quot;");
}

function getCharacterValue(character, paths, fallback = "—") {
  for (const path of paths) {
    const parts = path.split(".");
    let current = character;

    for (const part of parts) {
      if (
        current === null ||
        current === undefined ||
        typeof current !== "object"
      ) {
        current = undefined;
        break;
      }

      current = current[part];
    }

    if (
      current !== null &&
      current !== undefined &&
      String(current).trim() !== ""
    ) {
      return String(current);
    }
  }

  return fallback;
}

function normalizeGenerationValue(character) {
  const rawValue = getCharacterValue(
    character,
    [
      "generationLabel",
      "sheet.generationLabel",
      "generation",
      "sheet.generation",
      "creation.generation",
    ],
    ""
  );

  if (!rawValue) {
    return "13ª";
  }

  if (/^\d+$/.test(rawValue)) {
    return `${rawValue}ª`;
  }

  return rawValue;
}

function normalizeChronicleValue(character) {
  return getCharacterValue(
    character,
    [
      "chronicle.name",
      "chronicleName",
      "sheet.chronicleName",
      "chronicle.label",
    ],
    "Sem Crônica"
  );
}

function canSelectChronicle(character) {
  if (character?.canSelectChronicle === true) {
    return true;
  }

  if (character?.canAttachChronicle === true) {
    return true;
  }

  if (character?.chronicleStatus === "none") {
    return true;
  }

  return normalizeChronicleValue(character) === "Sem Crônica";
}

function createHelpButton(helpText) {
  return `
    <button
      type="button"
      class="character-sheet-help-button"
      title="${escapeAttribute(helpText)}"
      aria-label="${escapeAttribute(helpText)}"
    >
      ?
    </button>
  `;
}

function createEditButton(fieldName, label) {
  return `
    <button
      type="button"
      class="character-sheet-edit-button"
      data-character-inline-edit="${escapeAttribute(fieldName)}"
      aria-label="${escapeAttribute(label)}"
      title="${escapeAttribute(label)}"
    >
      ✎
    </button>
  `;
}

function createSection({ title, bodyHtml, toolsHtml = "", extraClass = "" }) {
  return `
    <section class="character-sheet-section ${extraClass}">
      <div class="character-sheet-section-header">
        <div class="character-sheet-title-wrap">
          <h3 class="character-sheet-section-title">${escapeSheetHtml(title)}</h3>
        </div>
        ${toolsHtml ? `<div class="character-sheet-section-tools">${toolsHtml}</div>` : ""}
      </div>
      <div class="character-sheet-section-divider"></div>
      ${bodyHtml}
    </section>
  `;
}

function createInfoRow(labelHtml, valueHtml, trailingHtml = "") {
  return `
    <div class="character-sheet-info-row">
      <div class="character-sheet-info-label">
        ${labelHtml}
      </div>
      <div class="character-sheet-info-value">
        ${valueHtml}
        ${trailingHtml}
      </div>
    </div>
  `;
}

function createActionRow(character) {
  if (!canSelectChronicle(character)) {
    return "";
  }

  return `
    <div class="character-sheet-action-row">
      <button
        type="button"
        class="character-sheet-select-button"
        data-character-open-chronicle-selector
      >
        Selecionar Crônica
      </button>
    </div>
  `;
}

export function createVampireSection(character) {
  const concept = getCharacterValue(character, ["concept", "sheet.concept"], "—");
  const clan = getCharacterValue(character, ["clan", "sheet.clan"], "—");
  const generation = normalizeGenerationValue(character);
  const sect = getCharacterValue(character, ["sect", "sheet.sect"], "—");
  const chronicle = normalizeChronicleValue(character);

  const rowsHtml = `
    <div class="character-sheet-info-list">
      ${createInfoRow(
        "Conceito",
        escapeSheetHtml(concept),
        createEditButton("concept", "Editar conceito")
      )}

      ${createInfoRow(
        "Clã",
        escapeSheetHtml(clan),
        createEditButton("clan", "Editar clã")
      )}

      ${createInfoRow(
        `<span class="character-sheet-inline-label">Geração ${createHelpButton(GENERATION_HELP_TEXT)}</span>`,
        escapeSheetHtml(generation)
      )}

      ${createInfoRow(
        "Seita",
        escapeSheetHtml(sect)
      )}

      ${createInfoRow(
        "Crônica",
        `<span class="${chronicle === "Sem Crônica" ? "character-sheet-info-value--muted" : ""}">${escapeSheetHtml(chronicle)}</span>`
      )}
    </div>

    ${createActionRow(character)}
  `;

  return createSection({
    title: "Vampiro",
    bodyHtml: rowsHtml,
  });
}

export function createPersonalitySection(character) {
  const nature = getCharacterValue(character, ["nature", "sheet.nature"], "—");
  const demeanor = getCharacterValue(
    character,
    ["demeanor", "sheet.demeanor"],
    "—"
  );
  const title = getCharacterValue(character, ["title", "sheet.title"], "—");

  const rowsHtml = `
    <div class="character-sheet-info-list">
      ${createInfoRow(
        "Natureza",
        escapeSheetHtml(nature),
        createEditButton("nature", "Editar natureza")
      )}

      ${createInfoRow(
        "Comportamento",
        escapeSheetHtml(demeanor),
        createEditButton("demeanor", "Editar comportamento")
      )}

      ${createInfoRow(
        "Título",
        escapeSheetHtml(title),
        createEditButton("title", "Editar título")
      )}
    </div>
  `;

  return createSection({
    title: "Personalidade",
    bodyHtml: rowsHtml,
  });
}

export const createCharacterVampireSection = createVampireSection;
export const createCharacterPersonalitySection = createPersonalitySection;