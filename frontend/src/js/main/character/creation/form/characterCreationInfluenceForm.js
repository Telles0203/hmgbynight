import {
  createCreationActions,
} from "./characterCreationFormCommon.js";

import {
  getBackgroundCreationRules,
} from "./background/characterCreationBackgroundCatalog.js";

import {
  createBackgroundAllocationPeerInput,
  getBackgroundAllocationPurchaseCounts,
  getBackgroundAllocationSpent,
  normalizeBackgroundAllocationPurchaseOrder,
} from "./background/characterCreationBackgroundAllocation.js";

import {
  getInfluenceEntries,
} from "./influence/characterCreationInfluenceCatalog.js";

import {
  createInfluenceRows,
  readInfluences,
} from "./influence/characterCreationInfluenceRows.js";

import {
  createInfluencePicker,
  addInfluence,
  removeInfluence,
} from "./influence/characterCreationInfluencePicker.js";

import {
  adjustCharacterCreationInfluenceLevel,
} from "./influence/characterCreationInfluenceProgress.js";

import {
  createFreeTraitPurchaseInput,
  getStateFreeTraitPurchaseOrder,
  isInitialCreationLifecycle,
  readFreeTraitPurchaseOrder,
  setStateFreeTraitPurchaseOrder,
} from "../freeTraits/characterCreationFreeTraitPurchases.js";


function createInfluenceRuleNotice(
  rules,
  character
) {
  const sabbat =
    character?.sect ===
    "sabbat";


  return `
    <div
      class="
        character-creation-influence-rule-notice
        rounded
        px-2
        py-2
      "
    >
      <div>
        <strong
          class="
            character-creation-influence-rule-highlight
          "
        >
          Pool compartilhado:
        </strong>

        ${sabbat
          ? "personagens Sabbat não recebem Traits gratuitos neste pool."
          : `Antecedentes e Influências dividem os mesmos ${rules.total} Traits da criação.`}

        Cada área de Influência pode possuir no máximo

        <strong
          class="
            character-creation-influence-rule-highlight
          "
        >
          ${rules.maximum} Traits
        </strong>.
      </div>

      <div
        class="
          mt-1
          character-creation-influence-rule-reference
        "
      >
        <em>
          Referência: Laws of the Night Revised, Influence a partir da p. 96.
        </em>
      </div>
    </div>
  `;
}


export function createInfluenceCreationEditor(
  character,
  state
) {
  const rules =
    getBackgroundCreationRules(
      character
    );


  const entries =
    getInfluenceEntries(
      state
    );


  const spent =
    getBackgroundAllocationSpent(
      state?.backgrounds,
      state?.influences
    );


  const extra =
    Math.max(
      0,
      spent -
        rules.total
    );


  const freeTraitCost =
    extra *
    rules.freeTraitCost;


  const freeTraitOrder =
    isInitialCreationLifecycle(
      character
    )
      ? normalizeBackgroundAllocationPurchaseOrder({
          order:
            getStateFreeTraitPurchaseOrder(
              state,
              "backgrounds"
            ),

          backgrounds:
            state?.backgrounds,

          influences:
            state?.influences,

          total:
            rules.total,
        })
      : [];


  const freeTraitPurchases =
    getBackgroundAllocationPurchaseCounts(
      freeTraitOrder
    )
      .influences;


  return `
    <form
      class="
        character-creation-inline-editor
      "
      data-character-creation-inline-form
      data-character-creation-section="influences"
      data-influence-creation-total="${rules.total}"
      data-influence-free-trait-cost="${rules.freeTraitCost}"
      data-influence-maximum="${rules.maximum}"
    >

      ${createFreeTraitPurchaseInput(
        "backgrounds",
        freeTraitOrder
      )}

      ${createBackgroundAllocationPeerInput(
        "backgrounds",
        state?.backgrounds
      )}

      <div
        class="
          character-creation-inline-heading
          d-flex
          justify-content-between
          align-items-center
          gap-2
        "
      >

        <strong>
          Influências
        </strong>

        <span
          class="
            badge
            rounded-pill
            border
            bg-transparent
            ${spent > rules.total
              ? "border-danger text-danger"
              : "border-secondary text-secondary"}
          "
          data-creation-influence-points
        >
          ${spent}/${rules.total}
        </span>

      </div>

      ${createInfluenceRuleNotice(
        rules,
        character
      )}

      <div
        class="
          character-creation-influence-list
        "
        data-creation-influence-list
      >
        ${createInfluenceRows(
          entries,
          rules.maximum,
          freeTraitPurchases
        )}
      </div>

      ${createInfluencePicker(
        entries
      )}

      <small
        class="
          character-free-trait-inline-cost
          mt-1
          ${freeTraitCost > 0
            ? ""
            : "d-none"}
        "
        data-creation-influence-free-trait-cost
      >
        ${freeTraitCost > 0
          ? `Pool compartilhado: -${freeTraitCost} Free Trait${freeTraitCost === 1 ? "" : "s"}`
          : ""}
      </small>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function readInfluenceCreationSection(
  form,
  state
) {
  state.influences =
    readInfluences(
      form
    );


  state.backgrounds =
    state.backgrounds &&
    typeof state.backgrounds ===
      "object"
      ? state.backgrounds
      : {};


  setStateFreeTraitPurchaseOrder(
    state,
    "backgrounds",
    normalizeBackgroundAllocationPurchaseOrder({
      order:
        readFreeTraitPurchaseOrder(
          form,
          "backgrounds"
        ),

      backgrounds:
        state.backgrounds,

      influences:
        state.influences,

      total:
        Number(
          form.dataset
            .influenceCreationTotal
        ) ||
        5,
    })
  );


  return state;
}


export {
  adjustCharacterCreationInfluenceLevel,
  addInfluence,
  removeInfluence,
};
