import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getFreeTraitPurchaseCounts,
  normalizeFreeTraitPurchaseOrder,
} from "../../freeTraits/characterCreationFreeTraitPurchases.js";


const BACKGROUND_PREFIX =
  "background::";

const INFLUENCE_PREFIX =
  "influence::";


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
  value
) {
  const source =
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
      ? value
      : {};


  const result =
    {};


  Object.entries(
    source
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
        result[
          key
        ] =
          level;
      }
    }
  );


  return result;
}


export function createBackgroundAllocationKey(
  value
) {
  const key =
    normalizeKey(
      value
    );


  return key
    ? `${BACKGROUND_PREFIX}${key}`
    : "";
}


export function createInfluenceAllocationKey(
  value
) {
  const key =
    normalizeKey(
      value
    );


  return key
    ? `${INFLUENCE_PREFIX}${key}`
    : "";
}


export function getBackgroundAllocationValues(
  backgrounds,
  influences
) {
  const result =
    {};


  Object.entries(
    normalizeLevelMap(
      backgrounds
    )
  ).forEach(
    ([
      key,
      level,
    ]) => {
      result[
        createBackgroundAllocationKey(
          key
        )
      ] =
        level;
    }
  );


  Object.entries(
    normalizeLevelMap(
      influences
    )
  ).forEach(
    ([
      key,
      level,
    ]) => {
      result[
        createInfluenceAllocationKey(
          key
        )
      ] =
        level;
    }
  );


  return result;
}


export function getBackgroundAllocationSpent(
  backgrounds,
  influences
) {
  return Object.values(
    getBackgroundAllocationValues(
      backgrounds,
      influences
    )
  ).reduce(
    (
      total,
      level
    ) =>
      total +
      level,
    0
  );
}


function migratePurchaseOrder(
  order,
  values
) {
  return (
    Array.isArray(
      order
    )
      ? order
      : []
  ).map(
    (
      rawKey
    ) => {
      const key =
        normalizeKey(
          rawKey
        );


      if (
        key.startsWith(
          BACKGROUND_PREFIX
        ) ||
        key.startsWith(
          INFLUENCE_PREFIX
        )
      ) {
        return key;
      }


      const backgroundKey =
        createBackgroundAllocationKey(
          key
        );


      if (
        values[
          backgroundKey
        ]
      ) {
        return backgroundKey;
      }


      const influenceKey =
        createInfluenceAllocationKey(
          key
        );


      if (
        values[
          influenceKey
        ]
      ) {
        return influenceKey;
      }


      return key;
    }
  );
}


export function normalizeBackgroundAllocationPurchaseOrder({
  order,
  backgrounds,
  influences,
  total,
  preferredKey = "",
  reductionKey = "",
}) {
  const values =
    getBackgroundAllocationValues(
      backgrounds,
      influences
    );


  return normalizeFreeTraitPurchaseOrder({
    order:
      migratePurchaseOrder(
        order,
        values
      ),

    values,
    total,
    preferredKey,
    reductionKey,
  });
}


export function getBackgroundAllocationPurchaseCounts(
  order
) {
  const counts =
    getFreeTraitPurchaseCounts(
      order
    );


  const result = {
    backgrounds:
      {},

    influences:
      {},
  };


  Object.entries(
    counts
  ).forEach(
    ([
      key,
      count,
    ]) => {
      if (
        key.startsWith(
          BACKGROUND_PREFIX
        )
      ) {
        result
          .backgrounds[
            key.slice(
              BACKGROUND_PREFIX.length
            )
          ] =
            count;


        return;
      }


      if (
        key.startsWith(
          INFLUENCE_PREFIX
        )
      ) {
        result
          .influences[
            key.slice(
              INFLUENCE_PREFIX.length
            )
          ] =
            count;
      }
    }
  );


  return result;
}


export function createBackgroundAllocationPeerInput(
  section,
  values
) {
  return `
    <input
      type="hidden"
      data-creation-background-allocation-peer="${escapeSheetHtml(
        section
      )}"
      value="${escapeSheetHtml(
        JSON.stringify(
          normalizeLevelMap(
            values
          )
        )
      )}"
    >
  `;
}


export function readBackgroundAllocationPeerValues(
  form,
  section
) {
  const input =
    form?.querySelector(
      `[data-creation-background-allocation-peer="${CSS.escape(
        section
      )}"]`
    );


  if (!input) {
    return {};
  }


  try {
    return normalizeLevelMap(
      JSON.parse(
        input.value ||
        "{}"
      )
    );

  } catch {
    return {};
  }
}
