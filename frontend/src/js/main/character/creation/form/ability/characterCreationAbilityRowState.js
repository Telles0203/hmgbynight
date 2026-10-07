import {
  abilityRequiresFocus,
  createAbilityEntryKey,
  getAbilityDisplayLabel,
  getAbilityLabel,
} from "../../data/abilityCatalog.js";


function readRowAbility(
  row
) {
  return String(
    row.querySelector(
      "[data-creation-ability-key]"
    )?.value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function readRowFocus(
  row,
  ability
) {
  if (
    !abilityRequiresFocus(
      ability
    )
  ) {
    return "";
  }


  const select =
    row.querySelector(
      "[data-creation-ability-focus]"
    );


  const selected =
    String(
      select?.value ||
      ""
    );


  if (
    selected !==
    "__custom__"
  ) {
    return selected
      .trim()
      .toLowerCase();
  }


  return String(
    row.querySelector(
      "[data-creation-ability-custom-focus]"
    )?.value ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}


function readRowSpecialization(
  row
) {
  return String(
    row.querySelector(
      "[data-creation-ability-specialization]"
    )?.value ||
    ""
  ).trim();
}


function readRowLevel(
  row
) {
  const level =
    Number(
      row.querySelector(
        "[data-creation-ability-level]"
      )?.textContent
    );


  return Number.isInteger(
    level
  )
    ? level
    : 1;
}


function getRowDisplayLabel(
  row
) {
  const ability =
    readRowAbility(
      row
    );


  if (!ability) {
    return "Nova Habilidade";
  }


  const focus =
    readRowFocus(
      row,
      ability
    );


  if (
    abilityRequiresFocus(
      ability
    ) &&
    !focus
  ) {
    return (
      getAbilityLabel(
        ability
      ) +
      " (foco pendente)"
    );
  }


  return getAbilityDisplayLabel(
    createAbilityEntryKey(
      ability,
      focus
    )
  );
}


export function refreshCharacterCreationAbilityRowSummary(
  row
) {
  if (!row) {
    return;
  }


  const label =
    row.querySelector(
      "[data-creation-ability-summary-label]"
    );


  const specialization =
    row.querySelector(
      "[data-creation-ability-summary-specialization]"
    );


  const level =
    row.querySelector(
      "[data-creation-ability-summary-level]"
    );


  if (label) {
    label.textContent =
      getRowDisplayLabel(
        row
      );
  }


  const specializationValue =
    readRowSpecialization(
      row
    );


  if (specialization) {
    specialization.textContent =
      specializationValue
        ? `[${specializationValue}]`
        : "";

    specialization.classList.toggle(
      "d-none",
      !specializationValue
    );
  }


  if (level) {
    level.textContent =
      String(
        readRowLevel(
          row
        )
      );
  }
}


function setAbilityRowExpanded(
  row,
  expanded
) {
  const summary =
    row.querySelector(
      "[data-creation-ability-summary]"
    );


  const editor =
    row.querySelector(
      "[data-creation-ability-editor]"
    );


  row.classList.toggle(
    "is-expanded",
    expanded
  );


  summary?.classList.toggle(
    "d-none",
    expanded
  );


  editor?.classList.toggle(
    "d-none",
    !expanded
  );


  if (!expanded) {
    refreshCharacterCreationAbilityRowSummary(
      row
    );
  }
}


export function collapseCharacterCreationAbilityRows(
  container,
  exceptRow = null
) {
  if (!container) {
    return;
  }


  const rows =
    Array.from(
      container.querySelectorAll(
        '.character-creation-map-row[data-creation-map="abilities"]'
      )
    );


  rows.forEach(
    (
      row
    ) => {
      if (
        row ===
        exceptRow
      ) {
        return;
      }


      const ability =
        readRowAbility(
          row
        );


      if (!ability) {
        row.remove();

        return;
      }


      setAbilityRowExpanded(
        row,
        false
      );
    }
  );
}


export function openCharacterCreationAbilityRow(
  button
) {
  const row =
    button.closest(
      '.character-creation-map-row[data-creation-map="abilities"]'
    );


  const container =
    row?.parentElement;


  if (
    !row ||
    !container
  ) {
    return;
  }


  collapseCharacterCreationAbilityRows(
    container,
    row
  );


  setAbilityRowExpanded(
    row,
    true
  );


  const ability =
    row.querySelector(
      "[data-creation-ability-key]"
    );


  ability?.focus();
}


export function concludeCharacterCreationAbilityRow(
  button
) {
  const row =
    button.closest(
      '.character-creation-map-row[data-creation-map="abilities"]'
    );


  if (!row) {
    return;
  }


  const ability =
    readRowAbility(
      row
    );


  if (!ability) {
    window.alert(
      "Selecione uma Habilidade."
    );

    return;
  }


  const focus =
    readRowFocus(
      row,
      ability
    );


  if (
    abilityRequiresFocus(
      ability
    ) &&
    !focus
  ) {
    window.alert(
      `Selecione um foco para ${getAbilityLabel(
        ability
      )}.`
    );

    return;
  }


  setAbilityRowExpanded(
    row,
    false
  );
}
