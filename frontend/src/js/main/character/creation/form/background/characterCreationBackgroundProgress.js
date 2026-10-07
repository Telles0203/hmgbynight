import {
  readFreeTraitPurchaseOrder,
  writeFreeTraitPurchaseOrder,
} from "../../freeTraits/characterCreationFreeTraitPurchases.js";

import {
  createBackgroundAllocationKey,
  getBackgroundAllocationPurchaseCounts,
  getBackgroundAllocationSpent,
  normalizeBackgroundAllocationPurchaseOrder,
  readBackgroundAllocationPeerValues,
} from "./characterCreationBackgroundAllocation.js";


function getBackgroundValues(
  form
) {
  const values =
    {};


  form
    ?.querySelectorAll(
      "[data-creation-background-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationBackgroundKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const effectiveLevel =
          Number(
            row.querySelector(
              "[data-creation-background-level]"
            )?.textContent
          );


        const grantedLevel =
          Number(
            row.dataset
              .creationBackgroundGrant
          ) ||
          0;


        const level =
          effectiveLevel -
          grantedLevel;


        if (
          key &&
          Number.isInteger(
            level
          ) &&
          level >
            0
        ) {
          values[
            key
          ] =
            level;
        }
      }
    );


  return values;
}


function getBackgroundRowKey(
  row
) {
  return String(
    row?.dataset
      ?.creationBackgroundKey ||
    ""
  )
    .trim()
    .toLowerCase();
}


export function getBackgroundEditorProgress(
  form
) {
  const total =
    Number(
      form?.dataset
        ?.backgroundCreationTotal
    );


  const freeTraitCost =
    Number(
      form?.dataset
        ?.backgroundFreeTraitCost
    );


  const backgrounds =
    getBackgroundValues(
      form
    );


  const influences =
    readBackgroundAllocationPeerValues(
      form,
      "influences"
    );


  const spent =
    getBackgroundAllocationSpent(
      backgrounds,
      influences
    );


  const normalizedTotal =
    Number.isInteger(
      total
    )
      ? total
      : 5;


  const normalizedCost =
    Number.isInteger(
      freeTraitCost
    )
      ? freeTraitCost
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

    freeTraitCost:
      extra *
      normalizedCost,
  };
}


function refreshBackgroundRows(
  form,
  order
) {
  const counts =
    getBackgroundAllocationPurchaseCounts(
      order
    )
      .backgrounds;


  const maximum =
    Number(
      form.dataset
        .backgroundMaximum
    ) ||
    5;


  form
    .querySelectorAll(
      "[data-creation-background-row]"
    )
    .forEach(
      (
        row
      ) => {
        if (
          row.dataset
            .creationBackgroundSpecialMode ===
          "influence"
        ) {
          return;
        }


        const key =
          getBackgroundRowKey(
            row
          );


        const count =
          counts[
            key
          ] ||
          0;


        const level =
          Number(
            row.querySelector(
              "[data-creation-background-level]"
            )?.textContent
          ) ||
          0;


        const grantedLevel =
          Number(
            row.dataset
              .creationBackgroundGrant
          ) ||
          0;


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


        const decrease =
          row.querySelector(
            '[data-character-creation-background-action="decrease"]'
          );


        const increase =
          row.querySelector(
            '[data-character-creation-background-action="increase"]'
          );


        if (decrease) {
          decrease.disabled =
            level <=
            grantedLevel;
        }


        if (increase) {
          increase.disabled =
            level >=
            maximum;
        }
      }
    );
}


export function refreshCharacterCreationBackgroundEditor(
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
    getBackgroundEditorProgress(
      form
    );


  const backgrounds =
    getBackgroundValues(
      form
    );


  const influences =
    readBackgroundAllocationPeerValues(
      form,
      "influences"
    );


  const order =
    normalizeBackgroundAllocationPurchaseOrder({
      order:
        readFreeTraitPurchaseOrder(
          form,
          "backgrounds"
        ),

      backgrounds,
      influences,

      total:
        progress.total,

      preferredKey:
        createBackgroundAllocationKey(
          getBackgroundRowKey(
            preferredRow
          )
        ),

      reductionKey:
        createBackgroundAllocationKey(
          getBackgroundRowKey(
            reductionRow
          )
        ),
    });


  writeFreeTraitPurchaseOrder(
    form,
    "backgrounds",
    order
  );


  refreshBackgroundRows(
    form,
    order
  );


  const counter =
    form.querySelector(
      "[data-creation-background-points]"
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


  const cost =
    form.querySelector(
      "[data-creation-background-free-trait-cost]"
    );


  if (cost) {
    if (
      progress.freeTraitCost >
      0
    ) {
      cost.textContent =
        `Pool compartilhado: -${progress.freeTraitCost} Free Trait${progress.freeTraitCost === 1 ? "" : "s"}`;

      cost.classList.remove(
        "d-none"
      );

    } else {
      cost.textContent =
        "";

      cost.classList.add(
        "d-none"
      );
    }
  }
}


export function adjustCharacterCreationBackgroundLevel(
  button
) {
  const row =
    button.closest(
      "[data-creation-background-row]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form ||
    row.dataset
      .creationBackgroundSpecialMode ===
      "influence"
  ) {
    return;
  }


  const levelElement =
    row.querySelector(
      "[data-creation-background-level]"
    );


  if (!levelElement) {
    return;
  }


  const current =
    Number(
      levelElement.textContent
    ) ||
    0;


  const grantedLevel =
    Number(
      row.dataset
        .creationBackgroundGrant
    ) ||
    0;


  const maximum =
    Number(
      form.dataset
        .backgroundMaximum
    ) ||
    5;


  const action =
    String(
      button.dataset
        .characterCreationBackgroundAction ||
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
      grantedLevel ||
    next >
      maximum
  ) {
    return;
  }


  levelElement.textContent =
    String(
      next
    );


  refreshCharacterCreationBackgroundEditor(
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
