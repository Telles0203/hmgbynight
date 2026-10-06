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


function getPriorityTargets(
  priorities
) {
  const normalized = {
    primary:
      String(
        priorities?.primary ||
        ""
      )
        .trim()
        .toLowerCase(),

    secondary:
      String(
        priorities?.secondary ||
        ""
      )
        .trim()
        .toLowerCase(),

    tertiary:
      String(
        priorities?.tertiary ||
        ""
      )
        .trim()
        .toLowerCase(),
  };


  const values =
    Object.values(
      normalized
    );


  const valid =
    values.every(
      (
        category
      ) =>
        ATTRIBUTE_CATEGORIES
          .includes(
            category
          )
    ) &&
    new Set(
      values
    ).size ===
      ATTRIBUTE_CATEGORIES.length;


  if (
    !valid
  ) {
    return {
      valid:
        false,

      priorities:
        normalized,

      targets:
        {},
    };
  }


  return {
    valid:
      true,

    priorities:
      normalized,

    targets: {
      [
        normalized.primary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .primary,

      [
        normalized.secondary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .secondary,

      [
        normalized.tertiary
      ]:
        ATTRIBUTE_PRIORITY_POOLS
          .tertiary,
    },
  };
}


module.exports = {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
  getPriorityTargets,
};