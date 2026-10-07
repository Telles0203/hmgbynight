import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  abilityRequiresFocus,
  getAbilityCatalogOptions,
  getAbilityFocusOptions,
} from "../../data/abilityCatalog.js";


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

    ...getAbilityCatalogOptions()
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


export function createAbilityFocusEditor(
  ability,
  focus = ""
) {
  const requiresFocus =
    abilityRequiresFocus(
      ability
    );


  const options =
    getAbilityFocusOptions(
      ability
    );


  const normalizedFocus =
    String(
      focus ||
      ""
    )
      .trim()
      .toLowerCase();


  const preset =
    options.some(
      (
        option
      ) =>
        String(
          option?.value ||
          ""
        )
          .trim()
          .toLowerCase() ===
        normalizedFocus
    );


  const custom =
    Boolean(
      normalizedFocus
    ) &&
    !preset;


  return `
    <div
      class="
        character-creation-ability-focus
        ${requiresFocus
          ? ""
          : "d-none"}
      "
      data-creation-ability-focus-container
    >

      <select
        class="
          form-select
          form-select-sm
          bg-black
          text-light
          border-secondary
        "
        data-creation-ability-focus
      >

        <option value="">
          Selecione o foco
        </option>

        ${options
          .map(
            (
              option
            ) => `
              <option
                value="${escapeSheetHtml(
                  option.value
                )}"
                ${String(
                  option.value
                )
                  .toLowerCase() ===
                normalizedFocus
                  ? "selected"
                  : ""}
              >
                ${escapeSheetHtml(
                  option.label
                )}
              </option>
            `
          )
          .join("")}

        <option
          value="__custom__"
          ${custom
            ? "selected"
            : ""}
        >
          Outro...
        </option>

      </select>

      <input
        type="text"
        class="
          form-control
          form-control-sm
          bg-black
          text-light
          border-secondary
          mt-2
          ${custom
            ? ""
            : "d-none"}
        "
        data-creation-ability-custom-focus
        maxlength="60"
        value="${custom
          ? escapeSheetHtml(
              focus
            )
          : ""}"
        placeholder="Informe o foco"
      >

    </div>
  `;
}
