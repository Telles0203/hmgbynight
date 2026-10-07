import {
  escapeSheetHtml,
} from "../../view/sheet/characterSheetCommon.js";


function normalizeKey(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}


function normalizeLevelMap(
  values
) {
  const normalized =
    {};


  Object.entries(
    values &&
    typeof values ===
      "object" &&
    !Array.isArray(
      values
    )
      ? values
      : {}
  ).forEach(
    ([
      rawKey,
      rawLevel,
    ]) => {
      const key =
        normalizeKey(
          rawKey
        );


      const level =
        Number(
          rawLevel
        );


      if (
        key &&
        Number.isInteger(
          level
        ) &&
        level >
          0
      ) {
        normalized[
          key
        ] =
          level;
      }
    }
  );


  return normalized;
}


function getRequiredExtraCount(
  values,
  total
) {
  const spent =
    Object.values(
      normalizeLevelMap(
        values
      )
    ).reduce(
      (
        sum,
        level
      ) =>
        sum +
        level,
      0
    );


  const normalizedTotal =
    Number.isInteger(
      Number(
        total
      )
    )
      ? Math.max(
          0,
          Number(
            total
          )
        )
      : 0;


  return Math.max(
    0,
    spent -
      normalizedTotal
  );
}


function sanitizeExistingOrder(
  order,
  values
) {
  const levels =
    normalizeLevelMap(
      values
    );


  const used =
    {};


  return (
    Array.isArray(
      order
    )
      ? order
      : []
  )
    .map(
      normalizeKey
    )
    .filter(
      (
        key
      ) => {
        if (
          !key ||
          !levels[
            key
          ]
        ) {
          return false;
        }


        const count =
          used[
            key
          ] ||
          0;


        if (
          count >=
          levels[
            key
          ]
        ) {
          return false;
        }


        used[
          key
        ] =
          count +
          1;


        return true;
      }
    );
}


function removeLastOccurrence(
  values,
  key
) {
  const normalizedKey =
    normalizeKey(
      key
    );


  if (
    !normalizedKey
  ) {
    return false;
  }


  const index =
    values.lastIndexOf(
      normalizedKey
    );


  if (
    index <
    0
  ) {
    return false;
  }


  values.splice(
    index,
    1
  );


  return true;
}


function fillMissingPurchases(
  order,
  values,
  required,
  preferredKey = ""
) {
  const levels =
    normalizeLevelMap(
      values
    );


  const counts =
    getFreeTraitPurchaseCounts(
      order
    );


  const appendAvailable =
    (
      key
    ) => {
      const normalizedKey =
        normalizeKey(
          key
        );


      if (
        !normalizedKey ||
        !levels[
          normalizedKey
        ]
      ) {
        return;
      }


      while (
        order.length <
          required &&
        (
          counts[
            normalizedKey
          ] ||
          0
        ) <
          levels[
            normalizedKey
          ]
      ) {
        order.push(
          normalizedKey
        );


        counts[
          normalizedKey
        ] =
          (
            counts[
              normalizedKey
            ] ||
            0
          ) +
          1;
      }
    };


  appendAvailable(
    preferredKey
  );


  Object.keys(
    levels
  )
    .forEach(
      appendAvailable
    );
}


export function normalizeFreeTraitPurchaseOrder({
  order,
  values,
  total,
  preferredKey = "",
  reductionKey = "",
}) {
  const required =
    getRequiredExtraCount(
      values,
      total
    );


  const normalized =
    sanitizeExistingOrder(
      order,
      values
    );


  while (
    normalized.length >
    required
  ) {
    if (
      reductionKey &&
      removeLastOccurrence(
        normalized,
        reductionKey
      )
    ) {
      continue;
    }


    normalized.shift();
  }


  if (
    normalized.length <
    required
  ) {
    fillMissingPurchases(
      normalized,
      values,
      required,
      preferredKey
    );
  }


  return normalized;
}


export function getFreeTraitPurchaseCounts(
  order
) {
  const counts =
    {};


  (
    Array.isArray(
      order
    )
      ? order
      : []
  ).forEach(
    (
      value
    ) => {
      const key =
        normalizeKey(
          value
        );


      if (!key) {
        return;
      }


      counts[
        key
      ] =
        (
          counts[
            key
          ] ||
          0
        ) +
        1;
    }
  );


  return counts;
}


export function getStateFreeTraitPurchaseOrder(
  state,
  section
) {
  const value =
    state
      ?.freeTraitPurchases
      ?.[
        section
      ];


  return Array.isArray(
    value
  )
    ? [
        ...value,
      ]
    : [];
}


export function setStateFreeTraitPurchaseOrder(
  state,
  section,
  order
) {
  state.freeTraitPurchases = {
    ...(
      state.freeTraitPurchases &&
      typeof state
        .freeTraitPurchases ===
        "object"
        ? state
            .freeTraitPurchases
        : {}
    ),

    [
      section
    ]:
      Array.isArray(
        order
      )
        ? [
            ...order,
          ]
        : [],
  };
}


export function createFreeTraitPurchaseInput(
  section,
  order
) {
  return `
    <input
      type="hidden"
      data-creation-free-trait-purchases="${escapeSheetHtml(
        section
      )}"
      value="${escapeSheetHtml(
        JSON.stringify(
          Array.isArray(
            order
          )
            ? order
            : []
        )
      )}"
    >
  `;
}


export function readFreeTraitPurchaseOrder(
  form,
  section
) {
  const input =
    form?.querySelector(
      `[data-creation-free-trait-purchases="${CSS.escape(
        section
      )}"]`
    );


  if (!input) {
    return [];
  }


  try {
    const parsed =
      JSON.parse(
        input.value ||
        "[]"
      );


    return Array.isArray(
      parsed
    )
      ? parsed
      : [];

  } catch {
    return [];
  }
}


export function writeFreeTraitPurchaseOrder(
  form,
  section,
  order
) {
  const input =
    form?.querySelector(
      `[data-creation-free-trait-purchases="${CSS.escape(
        section
      )}"]`
    );


  if (!input) {
    return;
  }


  input.value =
    JSON.stringify(
      Array.isArray(
        order
      )
        ? order
        : []
    );
}


export function reconcileFormFreeTraitPurchases({
  form,
  section,
  values,
  total,
  preferredKey = "",
  reductionKey = "",
}) {
  const order =
    normalizeFreeTraitPurchaseOrder({
      order:
        readFreeTraitPurchaseOrder(
          form,
          section
        ),

      values,
      total,
      preferredKey,
      reductionKey,
    });


  writeFreeTraitPurchaseOrder(
    form,
    section,
    order
  );


  return order;
}


export function isInitialCreationLifecycle(
  character
) {
  return (
    String(
      character
        ?.sheetLifecycle ||
      ""
    ) !==
    "active"
  );
}
