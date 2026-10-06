export function escapeSheetHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ??
      ""
    );


  return element.innerHTML;
}


export function humanizeSheetKey(
  value
) {
  return String(
    value ||
    ""
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}


export function createSheetPips(
  value,
  maximum
) {
  const current =
    Number.isFinite(
      value
    )
      ? value
      : 0;


  const max =
    Number.isFinite(
      maximum
    )
      ? maximum
      : 0;


  return Array.from(
    {
      length:
        max,
    },

    (
      _,
      index
    ) => `
      <span
        class="
          character-sheet-pip
          ${
            index <
            current
              ? "is-filled"
              : ""
          }
        "
      ></span>
    `
  ).join("");
}