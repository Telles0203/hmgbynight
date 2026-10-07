import {
  abilityRequiresFocus,
  createAbilityEntryKey,
  getAbilityLabel,
} from "../../data/abilityCatalog.js";

import {
  getPurchasedAbilityLevel,
} from "./characterCreationAbilityEffective.js";


export function readAbilityFocus(
  row
) {
  const ability =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


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


function getAbilityEntryKeyFromRow(
  row,
  {
    requireFocus = false,
  } = {}
) {
  const ability =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  if (!ability) {
    return "";
  }


  const focus =
    readAbilityFocus(
      row
    );


  if (
    abilityRequiresFocus(
      ability
    ) &&
    !focus
  ) {
    if (
      requireFocus
    ) {
      throw new Error(
        `Selecione um foco para ${getAbilityLabel(
          ability
        )}.`
      );
    }


    return "";
  }


  return createAbilityEntryKey(
    ability,
    focus
  );
}


function normalizeGrantLevel(
  value
) {
  const level =
    Number(
      value
    );


  return Number.isInteger(
    level
  ) &&
  level >
    0
    ? level
    : 0;
}


export function readAbilityMap(
  form
) {
  const abilities =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const entryKey =
          getAbilityEntryKeyFromRow(
            row,
            {
              requireFocus:
                true,
            }
          );


        if (!entryKey) {
          return;
        }


        const effectiveLevel =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          );


        const grantedLevel =
          normalizeGrantLevel(
            row.dataset
              .creationAbilityGrant
          );


        const purchasedLevel =
          getPurchasedAbilityLevel(
            effectiveLevel,
            grantedLevel
          );


        if (
          purchasedLevel >
          0
        ) {
          abilities[
            entryKey
          ] =
            (
              abilities[
                entryKey
              ] ||
              0
            ) +
            purchasedLevel;
        }
      }
    );


  return abilities;
}


export function readAbilitySpecializations(
  form
) {
  const specializations =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const entryKey =
          getAbilityEntryKeyFromRow(
            row,
            {
              requireFocus:
                true,
            }
          );


        if (!entryKey) {
          return;
        }


        const specialization =
          String(
            row.querySelector(
              "[data-creation-ability-specialization]"
            )?.value ||
            ""
          ).trim();


        if (
          specialization
        ) {
          specializations[
            entryKey
          ] =
            specialization;
        }
      }
    );


  return specializations;
}
