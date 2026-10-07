import {
  abilityRequiresFocus,
  createAbilityEntryKey,
} from "../../data/abilityCatalog.js";

import {
  readAbilityFocus,
} from "./characterCreationAbilityRead.js";

import {
  getFreeTraitPurchaseCounts,
  reconcileFormFreeTraitPurchases,
} from "../../freeTraits/characterCreationFreeTraitPurchases.js";


export function getAbilityRowGrantLevel(
  row
) {
  const level =
    Number(
      row?.dataset
        ?.creationAbilityGrant
    );


  return Number.isInteger(
    level
  ) &&
  level >
    0
    ? level
    : 0;
}


export function getAbilityRowEntryKey(
  row
) {
  const ability =
    String(
      row?.querySelector(
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
    return "";
  }


  return createAbilityEntryKey(
    ability,
    focus
  );
}


function getAbilityPurchasedValues(
  form
) {
  const values =
    {};


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const key =
          getAbilityRowEntryKey(
            row
          );


        if (!key) {
          return;
        }


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          ) ||
          0;


        const purchased =
          Math.max(
            0,
            level -
              getAbilityRowGrantLevel(
                row
              )
          );


        if (
          purchased >
          0
        ) {
          values[
            key
          ] =
            purchased;
        }
      }
    );


  return values;
}


function refreshAbilityFreeTraitRows(
  form,
  order
) {
  const counts =
    getFreeTraitPurchaseCounts(
      order
    );


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const key =
          getAbilityRowEntryKey(
            row
          );


        const count =
          key
            ? (
                counts[
                  key
                ] ||
                0
              )
            : 0;


        row.dataset
          .creationFreeTraitLevel =
          String(
            count
          );


        row.classList.toggle(
          "is-free-trait-spend",
          count >
            0
        );
      }
    );
}


export function reconcileAbilityFreeTraitRows({
  form,
  total,
  preferredRow = null,
  reductionRow = null,
}) {
  const order =
    reconcileFormFreeTraitPurchases({
      form,

      section:
        "abilities",

      values:
        getAbilityPurchasedValues(
          form
        ),

      total,

      preferredKey:
        getAbilityRowEntryKey(
          preferredRow
        ),

      reductionKey:
        getAbilityRowEntryKey(
          reductionRow
        ),
    });


  refreshAbilityFreeTraitRows(
    form,
    order
  );


  return order;
}
