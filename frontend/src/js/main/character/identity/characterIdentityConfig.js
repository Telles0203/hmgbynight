export const CHARACTER_IDENTITY_FIELD_CONFIG = {
  title: {
    label:
      "Título",

    property:
      "title",

    endpoint:
      "title",

    type:
      "text",

    placeholder:
      "Digite o título...",
  },

  clan: {
    label:
      "Clã",

    property:
      "clan",

    labelProperty:
      "clanDisplayName",

    endpoint:
      "clan",

    type:
      "clan",
  },

  moralityPath: {
    label:
      "Trilha Moral",

    property:
      "moralityPath",

    labelProperty:
      "moralityPathLabel",

    endpoint:
      "morality-path",

    type:
      "moralityPath",
  },
};


export function getTitleMaxLength() {
  const configured =
    Number(
      window.ByNightMain
        ?.character
        ?.options
        ?.limits
        ?.titleMaxLength
    );


  return Number.isInteger(
    configured
  )
    ? configured
    : 80;
}


export function getIdentityInputDisplayValue(
  input
) {
  if (
    input instanceof
    HTMLSelectElement
  ) {
    return (
      input.options[
        input.selectedIndex
      ]?.textContent ||
      ""
    );
  }


  return String(
    input.value ||
    ""
  );
}