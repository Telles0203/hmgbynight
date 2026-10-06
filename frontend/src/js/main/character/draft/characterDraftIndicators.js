import {
  getCharacterById as getCharacter,
} from "../characterLookup.js";

import {
  getCharacterDraftChanges,
  getCharacterDraftDisplayChanges,
} from "./characterDraftState.js";


const SIMPLE_FIELDS = [
  "concept",
  "clan",
  "nature",
  "demeanor",
  "title",
  "moralityPath",
];


export function renderCharacterDraftIndicators(
  container
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
    return;
  }


  characters.forEach(
    (
      character
    ) => {
      refreshCharacterDraftIndicators(
        character.id,
        container
      );
    }
  );
}


export function refreshCharacterDraftIndicators(
  characterId,
  root = document
) {
  const character =
    getCharacter(
      characterId
    );


  if (
    !character
  ) {
    return;
  }


  const card =
    root.querySelector?.(
      `.character-card[data-character-id="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    ) ||
    document.querySelector(
      `.character-card[data-character-id="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    );


  if (
    !card
  ) {
    return;
  }


  clearDraftIndicators(
    card
  );


  const changes =
    getCharacterDraftChanges(
      character
    );


  SIMPLE_FIELDS.forEach(
    (
      field
    ) => {
      if (
        !Object.prototype
          .hasOwnProperty
          .call(
            changes,
            field
          )
      ) {
        return;
      }


      renderSimpleFieldIndicator(
        card,
        character,
        field,
        changes[
          field
        ]
      );
    }
  );


  if (
    changes.virtues &&
    typeof changes.virtues ===
      "object"
  ) {
    renderVirtueIndicators(
      card,
      character,
      changes.virtues
    );
  }
}


function renderSimpleFieldIndicator(
  card,
  character,
  field,
  value
) {
  const row =
    card.querySelector(
      `
        .character-editable-row[data-character-field="${CSS.escape(
          field
        )}"],
        .character-identity-row[data-character-field="${CSS.escape(
          field
        )}"]
      `
    );


  if (
    !row
  ) {
    return;
  }


  const displayValue =
    getPendingDisplayValue(
      character,
      field,
      value
    );


  const indicator =
    createDraftIndicator({
      visibleText:
        `Aguardando aprovação: ${displayValue || "—"}`,

      popoverText:
        `O valor atual continua válido até que a Narração aprove esta alteração. Nova escolha: ${displayValue || "—"}.`,
    });


  row.insertAdjacentElement(
    "afterend",
    indicator
  );


  initializeIndicatorPopover(
    indicator
  );
}


function renderVirtueIndicators(
  card,
  character,
  proposedVirtues
) {
  const activeVirtues =
    Array.isArray(
      character
        ?.activeVirtues
    )
      ? character
          .activeVirtues
      : [];


  activeVirtues.forEach(
    (
      virtue
    ) => {
      const key =
        String(
          virtue?.key ||
          ""
        );


      if (
        !key ||
        !Object.prototype
          .hasOwnProperty
          .call(
            proposedVirtues,
            key
          )
      ) {
        return;
      }


      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const officialValue =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;


      const proposedValue =
        Number(
          proposedVirtues[
            key
          ]
        );


      if (
        !Number.isFinite(
          proposedValue
        ) ||
        proposedValue ===
          officialValue
      ) {
        return;
      }


      const row =
        card.querySelector(
          `.character-virtue-row[data-virtue-key="${CSS.escape(
            key
          )}"]`
        );


      if (
        !row
      ) {
        return;
      }


      const label =
        String(
          virtue.label ||
          key
        );


      const indicator =
        createDraftIndicator({
          extraClass:
            "character-pending-change-virtue",

          visibleText:
            `Aguardando aprovação: ${proposedValue}`,

          popoverText:
            `O valor atual de ${label} continua ${officialValue} até que a Narração aprove a nova distribuição para ${proposedValue}.`,
        });


      row.insertAdjacentElement(
        "afterend",
        indicator
      );


      initializeIndicatorPopover(
        indicator
      );
    }
  );
}


function createDraftIndicator({
  visibleText,
  popoverText,
  extraClass = "",
}) {
  const indicator =
    document.createElement(
      "div"
    );


  indicator.className =
    `character-pending-change ${extraClass}`.trim();


  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";

  button.className =
    "character-pending-change-button";

  button.textContent =
    "!";


  button.setAttribute(
    "data-bs-toggle",
    "popover"
  );


  button.setAttribute(
    "data-bs-trigger",
    "focus"
  );


  button.setAttribute(
    "data-bs-placement",
    "top"
  );


  button.setAttribute(
    "data-bs-container",
    "body"
  );


  button.setAttribute(
    "data-bs-custom-class",
    "character-draft-popover"
  );


  button.setAttribute(
    "data-bs-title",
    "Alteração aguardando aprovação"
  );


  button.setAttribute(
    "data-bs-content",
    popoverText
  );


  button.setAttribute(
    "aria-label",
    popoverText
  );


  const text =
    document.createElement(
      "span"
    );


  text.className =
    "character-pending-change-text";

  text.textContent =
    visibleText;


  indicator.append(
    button,
    text
  );


  return indicator;
}


function getPendingDisplayValue(
  character,
  field,
  value
) {
  const displayChanges =
    getCharacterDraftDisplayChanges(
      character
    );


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        displayChanges,
        field
      )
  ) {
    return String(
      displayChanges[
        field
      ] ||
      ""
    );
  }


  if (
    field ===
    "clan"
  ) {
    const clans =
      window.ByNightMain
        ?.character
        ?.options
        ?.clans ||
      [];


    const clan =
      clans.find(
        (
          option
        ) =>
          String(
            option.value
          ) ===
          String(
            value
          )
      );


    return String(
      clan?.label ||
      value ||
      ""
    );
  }


  if (
    field ===
    "moralityPath"
  ) {
    const moralityPaths =
      window.ByNightMain
        ?.character
        ?.options
        ?.moralityPaths ||
      [];


    const moralityPath =
      moralityPaths.find(
        (
          option
        ) =>
          String(
            option.value
          ) ===
          String(
            value
          )
      );


    return String(
      moralityPath?.label ||
      value ||
      ""
    );
  }


  return String(
    value ??
    ""
  );
}


function initializeIndicatorPopover(
  indicator
) {
  if (
    !window.bootstrap
      ?.Popover
  ) {
    return;
  }


  const button =
    indicator.querySelector(
      '[data-bs-toggle="popover"]'
    );


  if (
    !button
  ) {
    return;
  }


  window.bootstrap
    .Popover
    .getOrCreateInstance(
      button
    );
}


function clearDraftIndicators(
  card
) {
  card
    .querySelectorAll(
      ".character-pending-change"
    )
    .forEach(
      (
        indicator
      ) => {
        const button =
          indicator.querySelector(
            '[data-bs-toggle="popover"]'
          );


        if (
          button &&
          window.bootstrap
            ?.Popover
        ) {
          window.bootstrap
            .Popover
            .getInstance(
              button
            )
            ?.dispose();
        }


        indicator.remove();
      }
    );
}
