import {
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
} from "../../data/clanRuleCatalog.js";


export function createClanAbilityGrantSummary(
  character
) {
  const fixed =
    getFixedClanAbilityGrants(
      character
    );


  const choices =
    getClanAbilityChoiceGrants(
      character
    );


  const hasFixed =
    Object.values(
      fixed
    ).some(
      (
        level
      ) =>
        Number(
          level
        ) >
        0
    );


  if (
    !hasFixed &&
    choices.length ===
      0
  ) {
    return "";
  }


  return `
    <div
      class="
        character-creation-clan-ability-grants
      "
    >

      ${hasFixed
        ? `
          <small
            class="
              character-creation-clan-choice-pending
            "
          >
            Habilidades de clã já aparecem abaixo com o nível gratuito aplicado. Apenas os níveis adquiridos além desse mínimo contam nos pontos de criação.
          </small>
        `
        : ""}

      ${choices.length >
        0
          ? `
            <small
              class="
                character-creation-clan-choice-pending
              "
            >
              Este clã possui uma escolha de Habilidade gratuita que será configurada em um bloco específico.
            </small>
          `
          : ""}

    </div>
  `;
}
