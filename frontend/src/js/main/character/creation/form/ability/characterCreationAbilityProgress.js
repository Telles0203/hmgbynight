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


import {
  getAbilityRowGrantLevel,
  reconcileAbilityFreeTraitRows,
} from "./characterCreationAbilityFreeTraits.js";


function getAbilityEditorProgress(
  form
) {
  const total =
    Number(
      form.dataset
        .abilityCreationTotal
    );


  const freeTraitCost =
    Number(
      form.dataset
        .abilityFreeTraitCost
    );


  const specializationFreeTraitCost =
    Number(
      form.dataset
        .abilitySpecializationFreeTraitCost
    );


  let spent =
    0;


  let specializationCount =
    0;


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const ability =
          String(
            row.querySelector(
              "[data-creation-ability-key]"
            )?.value ||
            ""
          ).trim();


        if (!ability) {
          return;
        }


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          );


        const grantedLevel =
          getAbilityRowGrantLevel(
            row
          );


        if (
          Number.isInteger(
            level
          ) &&
          level >
            0
        ) {
          spent +=
            Math.max(
              0,
              level -
                grantedLevel
            );
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
          specializationCount +=
            1;
        }
      }
    );


  const normalizedTotal =
    Number.isInteger(
      total
    )
      ? total
      : 5;


  const normalizedAbilityCost =
    Number.isInteger(
      freeTraitCost
    )
      ? freeTraitCost
      : 1;


  const normalizedSpecializationCost =
    Number.isInteger(
      specializationFreeTraitCost
    )
      ? specializationFreeTraitCost
      : 1;


  const extra =
    Math.max(
      0,
      spent -
        normalizedTotal
    );


  return {
    spent,

    total:
      normalizedTotal,

    extra,

    specializationCount,

    freeTraitCost:
      extra *
      normalizedAbilityCost,

    specializationFreeTraitCost:
      specializationCount *
      normalizedSpecializationCost,
  };
}


function refreshAbilityRowControls(
  form
) {
  const maximum =
    Number(
      form.dataset
        .abilityMaximum
    ) ||
    5;


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const selected =
          Boolean(
            String(
              row.querySelector(
                "[data-creation-ability-key]"
              )?.value ||
              ""
            ).trim()
          );


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          ) ||
          1;


        const grantedLevel =
          getAbilityRowGrantLevel(
            row
          );


        const minimum =
          grantedLevel >
          0
            ? grantedLevel
            : 1;


        const decrease =
          row.querySelector(
            '[data-character-creation-ability-action="decrease"]'
          );


        const increase =
          row.querySelector(
            '[data-character-creation-ability-action="increase"]'
          );


        const specialization =
          row.querySelector(
            "[data-creation-ability-specialization]"
          );


        if (decrease) {
          decrease.disabled =
            !selected ||
            level <=
              minimum;
        }


        if (increase) {
          increase.disabled =
            !selected ||
            level >=
              maximum;
        }


        if (specialization) {
          specialization.disabled =
            !selected;
        }
      }
    );
}


function updateCostNotice(
  element,
  label,
  cost
) {
  if (!element) {
    return;
  }


  if (
    cost >
    0
  ) {
    element.textContent =
      `${label}: -${cost} Free Trait${cost === 1 ? "" : "s"}`;

    element.classList.remove(
      "d-none"
    );


    return;
  }


  element.textContent =
    "";

  element.classList.add(
    "d-none"
  );
}


export function refreshCharacterCreationAbilityEditor(
  form,
  {
    preferredRow = null,
    reductionRow = null,
  } = {}
) {
  if (!form) {
    return;
  }


  const progress =
    getAbilityEditorProgress(
      form
    );


  reconcileAbilityFreeTraitRows({
    form,

    total:
      progress.total,

    preferredRow,
    reductionRow,
  });


  const counter =
    form.querySelector(
      "[data-creation-ability-points]"
    );


  if (counter) {
    const highlight =
      progress.spent >
      progress.total;


    counter.textContent =
      `${progress.spent}/${progress.total}`;


    counter.classList.toggle(
      "text-danger",
      highlight
    );


    counter.classList.toggle(
      "border-danger",
      highlight
    );


    counter.classList.toggle(
      "text-secondary",
      !highlight
    );


    counter.classList.toggle(
      "border-secondary",
      !highlight
    );
  }


  updateCostNotice(
    form.querySelector(
      "[data-creation-ability-free-trait-cost]"
    ),
    "Extra da criação",
    progress.freeTraitCost
  );


  updateCostNotice(
    form.querySelector(
      "[data-creation-specialization-free-trait-cost]"
    ),
    "Especializações",
    progress
      .specializationFreeTraitCost
  );


  refreshAbilityRowControls(
    form
  );
}


export function adjustCharacterCreationAbilityLevel(
  button
) {
  const row =
    button.closest(
      '.character-creation-map-row[data-creation-map="abilities"]'
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form
  ) {
    return;
  }


  const selected =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    ).trim();


  if (!selected) {
    return;
  }


  const levelElement =
    row.querySelector(
      "[data-creation-ability-level]"
    );


  if (!levelElement) {
    return;
  }


  const current =
    Number(
      levelElement.textContent
    ) ||
    1;


  const maximum =
    Number(
      form.dataset
        .abilityMaximum
    ) ||
    5;


  const grantedLevel =
    getAbilityRowGrantLevel(
      row
    );


  const minimum =
    grantedLevel >
    0
      ? grantedLevel
      : 1;


  const action =
    String(
      button.dataset
        .characterCreationAbilityAction ||
      ""
    );


  const direction =
    action ===
      "increase"
      ? 1
      : (
          action ===
            "decrease"
            ? -1
            : 0
        );


  if (!direction) {
    return;
  }


  const next =
    current +
    direction;


  if (
    next <
      minimum ||
    next >
      maximum
  ) {
    return;
  }


  levelElement.textContent =
    String(
      next
    );


  refreshCharacterCreationAbilityEditor(
    form,
    direction >
      0
      ? {
          preferredRow:
            row,
        }
      : {
          reductionRow:
            row,
        }
  );
}


export function getStateAbilityProgress(
  state,
  total,
  freeTraitCost,
  specializationFreeTraitCost
) {
  const spent =
    Object.values(
      state?.abilities ||
      {}
    ).reduce(
      (
        sum,
        level
      ) => {
        const normalized =
          Number(
            level
          );


        return (
          sum +
          (
            Number.isInteger(
              normalized
            ) &&
            normalized >
              0
              ? normalized
              : 0
          )
        );
      },
      0
    );


  const extra =
    Math.max(
      0,
      spent -
        total
    );


  const specializationCount =
    Object.entries(
      state?.specializations ||
      {}
    ).filter(
      ([
        entryKey,
        specialization,
      ]) =>
        Boolean(
          String(
            specialization ||
            ""
          ).trim()
        ) &&
        Object.prototype
          .hasOwnProperty
          .call(
            state?.abilities ||
            {},
            entryKey
          )
    ).length;


  return {
    spent,

    total,

    specializationCount,

    freeTraitCost:
      extra *
      freeTraitCost,

    specializationFreeTraitCost:
      specializationCount *
      specializationFreeTraitCost,
  };
}
