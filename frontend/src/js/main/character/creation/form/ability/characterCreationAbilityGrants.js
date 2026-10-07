import {
  getClanAbilityChoiceGrants,
  getResolvedClanAbilityGrants,
  resolveCharacterClanResourceGrants,
} from "../../data/clanRuleCatalog.js";


export function createClanAbilityGrantSummary(
  character,
  state
) {
  const fixed =
    getResolvedClanAbilityGrants(
      character,
      state
    );


  const resourceGrants =
    resolveCharacterClanResourceGrants(
      character,
      state
    );


  const choices =
    getClanAbilityChoiceGrants(
      character
    )
      .filter(
        (
          group
        ) =>
          !group.choiceId ||
          !resourceGrants
            .selections[
              group.choiceId
            ]
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
            Habilidades concedidas pelo clã aparecem abaixo com o nível gratuito aplicado. Apenas níveis adquiridos além desse mínimo contam no pool da criação.
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
              Este clã ainda possui uma escolha de Habilidade gratuita pendente.
            </small>
          `
          : ""}

    </div>
  `;
}
