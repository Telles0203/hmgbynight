import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";


function getAbilityOptions() {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.abilities;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


export function getAbilityCreationRules(
  character
) {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.abilityRules ||
    {};


  const total =
    Number(
      options.total
    );


  const freeTraitCost =
    Number(
      options.freeTraitCost
    );


  const draftMaximum =
    Number(
      character
        ?.draftCreation
        ?.derived
        ?.generationRules
        ?.maximumAbilityLevel
    );


  const officialMaximum =
    Number(
      character
        ?.creation
        ?.derived
        ?.generationRules
        ?.maximumAbilityLevel
    );


  const maximum =
    Number.isInteger(
      draftMaximum
    )
      ? draftMaximum
      : (
          Number.isInteger(
            officialMaximum
          )
            ? officialMaximum
            : 5
        );


  return {
    total:
      Number.isInteger(
        total
      )
        ? total
        : 5,

    freeTraitCost:
      Number.isInteger(
        freeTraitCost
      )
        ? freeTraitCost
        : 1,

    maximum:
      Math.max(
        1,
        maximum
      ),
  };
}


export function createAbilityOptions(
  selectedValue = ""
) {
  const selected =
    String(
      selectedValue ||
      ""
    );


  return [
    `
      <option value="">
        Selecione uma Habilidade
      </option>
    `,

    ...getAbilityOptions()
      .map(
        (
          ability
        ) => {
          const value =
            String(
              ability?.value ||
              ""
            );


          const label =
            String(
              ability?.label ||
              value
            );


          return `
            <option
              value="${escapeSheetHtml(
                value
              )}"
              ${value === selected
                ? "selected"
                : ""}
            >
              ${escapeSheetHtml(
                label
              )}
            </option>
          `;
        }
      ),
  ].join("");
}
