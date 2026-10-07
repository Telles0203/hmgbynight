function normalizeValue(
  value,
  maximum
) {
  const normalized =
    Number(
      value
    );


  if (
    !Number.isFinite(
      normalized
    )
  ) {
    return 0;
  }


  return Math.max(
    0,
    Math.min(
      maximum,
      normalized
    )
  );
}


function getPipState({
  position,
  base,
  current,
  showSacrificed,
}) {
  if (
    current <
      base
  ) {
    if (
      position <=
      current
    ) {
      return "normal";
    }


    if (
      showSacrificed &&
      position <=
        base
    ) {
      return "sacrificed";
    }


    return "empty";
  }


  if (
    position <=
      base
  ) {
    return "normal";
  }


  if (
    position <=
      current
  ) {
    return "purchased";
  }


  return "empty";
}


function getPipClass(
  state
) {
  if (
    state ===
    "normal"
  ) {
    return "is-filled";
  }


  if (
    state ===
    "sacrificed"
  ) {
    return "is-creation-sacrificed";
  }


  if (
    state ===
    "purchased"
  ) {
    return "is-filled is-creation-purchased";
  }


  return "";
}


function getPipTitle(
  state
) {
  if (
    state ===
    "sacrificed"
  ) {
    return "Ponto sacrificado na criação para gerar Free Traits.";
  }


  if (
    state ===
    "purchased"
  ) {
    return "Ponto comprado durante a criação com Free Traits.";
  }


  return "";
}


export function createCreationResourcePips({
  base,
  current,
  maximum = 10,
  showSacrificed = true,
}) {
  const normalizedMaximum =
    Math.max(
      0,
      Number(
        maximum
      ) ||
      0
    );


  const normalizedBase =
    normalizeValue(
      base,
      normalizedMaximum
    );


  const normalizedCurrent =
    normalizeValue(
      current,
      normalizedMaximum
    );


  return Array.from(
    {
      length:
        normalizedMaximum,
    },

    (
      _,
      index
    ) => {
      const position =
        index +
        1;


      const state =
        getPipState({
          position,

          base:
            normalizedBase,

          current:
            normalizedCurrent,

          showSacrificed,
        });


      const title =
        getPipTitle(
          state
        );


      return `
        <span
          class="
            character-sheet-pip
            ${getPipClass(
              state
            )}
          "
          ${title
            ? `title="${title}"`
            : ""}
        ></span>
      `;
    }
  ).join("");
}
