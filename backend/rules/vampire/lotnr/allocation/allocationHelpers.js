const {
  ATTRIBUTE_CATEGORIES,
  ATTRIBUTE_PRIORITY_POOLS,
} = require(
  "../ruleset"
);


function normalizeInteger(
  value,
  fallback = 0
) {
  const normalized =
    Number(
      value
    );


  return Number.isInteger(
    normalized
  )
    ? normalized
    : fallback;
}


function normalizeLevelMap(
  value
) {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value
    )
  ) {
    return {};
  }


  const normalized =
    {};


  Object.entries(
    value
  ).forEach(
    ([
      key,
      level,
    ]) => {
      const normalizedKey =
        String(
          key ||
          ""
        )
          .trim()
          .toLowerCase();


      const normalizedLevel =
        Number(
          level
        );


      if (
        normalizedKey &&
        Number.isInteger(
          normalizedLevel
        )
      ) {
        normalized[
          normalizedKey
        ] =
          normalizedLevel;
      }
    }
  );


  return normalized;
}


function createPointProgress(
  total,
  spent
) {
  const normalizedTotal =
    Math.max(
      0,
      normalizeInteger(
        total
      )
    );


  const normalizedSpent =
    Math.max(
      0,
      normalizeInteger(
        spent
      )
    );


  return {
    total:
      normalizedTotal,

    spent:
      normalizedSpent,

    remaining:
      Math.max(
        0,
        normalizedTotal -
          normalizedSpent
      ),

    complete:
      normalizedSpent >=
      normalizedTotal,

    overSpent:
      normalizedSpent >
      normalizedTotal,
  };
}


function normalizeAttributePriority(
  value
) {
  const normalized =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();


  return ATTRIBUTE_CATEGORIES
    .includes(
      normalized
    )
      ? normalized
      : "";
}


function createPartialPriorityTargets(
  priorities
) {
  const targets =
    {};


  const assignedCategories =
    new Set();


  [
    [
      "primary",
      ATTRIBUTE_PRIORITY_POOLS
        .primary,
    ],

    [
      "secondary",
      ATTRIBUTE_PRIORITY_POOLS
        .secondary,
    ],

    [
      "tertiary",
      ATTRIBUTE_PRIORITY_POOLS
        .tertiary,
    ],
  ].forEach(
    ([
      priority,
      target,
    ]) => {
      const category =
        priorities[
          priority
        ];


      if (
        !category ||
        assignedCategories.has(
          category
        )
      ) {
        return;
      }


      targets[
        category
      ] =
        target;


      assignedCategories.add(
        category
      );
    }
  );


  return targets;
}


function getPriorityTargets(
  priorities
) {
  const normalized = {
    primary:
      normalizeAttributePriority(
        priorities?.primary
      ),

    secondary:
      normalizeAttributePriority(
        priorities?.secondary
      ),

    tertiary:
      normalizeAttributePriority(
        priorities?.tertiary
      ),
  };


  const values =
    Object.values(
      normalized
    );


  const assignedValues =
    values.filter(
      Boolean
    );


  const valid =
    assignedValues.length ===
      ATTRIBUTE_CATEGORIES.length &&
    new Set(
      assignedValues
    ).size ===
      ATTRIBUTE_CATEGORIES.length;


  const targets =
    createPartialPriorityTargets(
      normalized
    );


  return {
    valid,

    priorities:
      normalized,

    targets,
  };
}


module.exports = {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
};