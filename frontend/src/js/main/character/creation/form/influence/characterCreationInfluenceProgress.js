import {
  readFreeTraitPurchaseOrder,
  writeFreeTraitPurchaseOrder,
} from "../../freeTraits/characterCreationFreeTraitPurchases.js";

import {
  createInfluenceAllocationKey,
  getBackgroundAllocationPurchaseCounts,
  getBackgroundAllocationSpent,
  normalizeBackgroundAllocationPurchaseOrder,
  readBackgroundAllocationPeerValues,
} from "../background/characterCreationBackgroundAllocation.js";


function getInfluenceValues(
  form
) {
  const values =
    {};


  form
    ?.querySelectorAll(
      "[data-creation-influence-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationInfluenceKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const effectiveLevel =
          Number(
            row.querySelector(
              "[data-creation-influence-level]"
            )?.textContent
          );


        const grantedLevel =
          Number(
            row.dataset
              .creationInfluenceGrant
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


function getInfluenceRowKey(
  row
) {
  return String(
    row?.dataset
      ?.creationInfluenceKey ||
    ""
  )
    .trim()
    .toLowerCase();
}


export function getInfluenceEditorProgress(
  form
) {
  const total =
    Number(
      form?.dataset
        ?.influenceCreationTotal
    );


  const freeTraitCost =
    Number(
      form?.dataset
        ?.influenceFreeTraitCost
    );


  const backgrounds =
    readBackgroundAllocationPeerValues(
      form,
      "backgrounds"
    );


  const influences =
    getInfluenceValues(
      form
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


function refreshInfluenceRows(
  form,
  order
) {
  const counts =
    getBackgroundAllocationPurchaseCounts(
      order
    )
      .influences;


  const maximum =
    Number(
      form.dataset
        .influenceMaximum
    ) ||
    5;


  form
    .querySelectorAll(
      "[data-creation-influence-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          getInfluenceRowKey(
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
              "[data-creation-influence-level]"
            )?.textContent
          ) ||
          0;


        const grantedLevel =
          Number(
            row.dataset
              .creationInfluenceGrant
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
            '[data-character-creation-influence-action="decrease"]'
          );


        const increase =
          row.querySelector(
            '[data-character-creation-influence-action="increase"]'
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


export function refreshCharacterCreationInfluenceEditor(
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
    getInfluenceEditorProgress(
      form
    );


  const backgrounds =
    readBackgroundAllocationPeerValues(
      form,
      "backgrounds"
    );


  const influences =
    getInfluenceValues(
      form
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
        createInfluenceAllocationKey(
          getInfluenceRowKey(
            preferredRow
          )
        ),

      reductionKey:
        createInfluenceAllocationKey(
          getInfluenceRowKey(
            reductionRow
          )
        ),
    });


  writeFreeTraitPurchaseOrder(
    form,
    "backgrounds",
    order
  );


  refreshInfluenceRows(
    form,
    order
  );


  const counter =
    form.querySelector(
      "[data-creation-influence-points]"
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
      "[data-creation-influence-free-trait-cost]"
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


export function adjustCharacterCreationInfluenceLevel(
  button
) {
  const row =
    button.closest(
      "[data-creation-influence-row]"
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


  const levelElement =
    row.querySelector(
      "[data-creation-influence-level]"
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
        .creationInfluenceGrant
    ) ||
    0;


  const maximum =
    Number(
      form.dataset
        .influenceMaximum
    ) ||
    5;


  const action =
    String(
      button.dataset
        .characterCreationInfluenceAction ||
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


  refreshCharacterCreationInfluenceEditor(
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
