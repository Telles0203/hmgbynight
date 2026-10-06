function normalizePointValue(
  value,
  fallback = 0
) {
  const number =
    Number(
      value
    );


  if (
    !Number.isInteger(
      number
    ) ||
    number <
      0
  ) {
    return fallback;
  }


  return number;
}


function createPointProgress({
  total,
  spent,
}) {
  const normalizedTotal =
    normalizePointValue(
      total
    );


  const normalizedSpent =
    normalizePointValue(
      spent
    );


  const remaining =
    Math.max(
      0,
      normalizedTotal -
        normalizedSpent
    );


  return {
    total:
      normalizedTotal,

    spent:
      normalizedSpent,

    remaining,

    complete:
      normalizedSpent ===
      normalizedTotal,

    overSpent:
      normalizedSpent >
      normalizedTotal,
  };
}


function createUntrackedPointProgress(
  total
) {
  return {
    total:
      normalizePointValue(
        total
      ),

    spent:
      null,

    remaining:
      null,

    complete:
      false,

    overSpent:
      false,
  };
}


module.exports = {
  normalizePointValue,
  createPointProgress,
  createUntrackedPointProgress,
};