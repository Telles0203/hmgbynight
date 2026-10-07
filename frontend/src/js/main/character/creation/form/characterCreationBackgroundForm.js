import {
  createCreationActions,
} from "./characterCreationFormCommon.js";

import {
  getBackgroundCreationRules,
  getBackgroundEntries,
} from "./background/characterCreationBackgroundCatalog.js";

import {
  createBackgroundRows,
  readBackgrounds,
} from "./background/characterCreationBackgroundRows.js";

import {
  createBackgroundPicker,
  addBackground,
  removeBackground,
} from "./background/characterCreationBackgroundPicker.js";

import {
  adjustCharacterCreationBackgroundLevel,
} from "./background/characterCreationBackgroundProgress.js";

import {
  createFreeTraitPurchaseInput,
  getFreeTraitPurchaseCounts,
  getStateFreeTraitPurchaseOrder,
  isInitialCreationLifecycle,
  normalizeFreeTraitPurchaseOrder,
  readFreeTraitPurchaseOrder,
  setStateFreeTraitPurchaseOrder,
} from "../freeTraits/characterCreationFreeTraitPurchases.js";


function createBackgroundRuleNotice(
  rules,
  character
) {
  const sabbat =
    character?.sect ===
    "sabbat";


  return `
    <div
      class="
        character-creation-background-rule-notice
        rounded
        px-2
        py-2
      "
    >
      <div>
        <strong
          class="
            character-creation-background-rule-highlight
          "
        >
          Criação:
        </strong>

        ${sabbat
          ? "personagens Sabbat não recebem Antecedentes gratuitos."
          : `distribua ${rules.total} Traits entre os Antecedentes.`}

        Cada Antecedente pode possuir no máximo

        <strong
          class="
            character-creation-background-rule-highlight
          "
        >
          ${rules.maximum} Traits
        </strong>.
      </div>

      <div
        class="
          mt-1
          character-creation-background-rule-reference
        "
      >
        <em>
          Referência: Laws of the Night Revised, p. 67; Antecedentes a partir da p. 93.
        </em>
      </div>
    </div>
  `;
}


export function createBackgroundCreationEditor(
  character,
  state
) {
  const rules =
    getBackgroundCreationRules(
      character
    );


  const entries =
    getBackgroundEntries(
      state
    );


  const spent =
    entries.reduce(
      (
        total,
        entry
      ) =>
        total +
        Math.max(
          0,
          Number(
            entry?.level
          ) ||
          0
        ),
      0
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
      ? normalizeFreeTraitPurchaseOrder({
          order:
            getStateFreeTraitPurchaseOrder(
              state,
              "backgrounds"
            ),

          values:
            state?.backgrounds,

          total:
            rules.total,
        })
      : [];


  const freeTraitPurchases =
    getFreeTraitPurchaseCounts(
      freeTraitOrder
    );


  return `
    <form
      class="
        character-creation-inline-editor
      "
      data-character-creation-inline-form
      data-character-creation-section="backgrounds"
      data-background-creation-total="${rules.total}"
      data-background-free-trait-cost="${rules.freeTraitCost}"
      data-background-maximum="${rules.maximum}"
    >

      ${createFreeTraitPurchaseInput(
        "backgrounds",
        freeTraitOrder
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
          Antecedentes
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
          data-creation-background-points
        >
          ${spent}/${rules.total}
        </span>

      </div>

      ${createBackgroundRuleNotice(
        rules,
        character
      )}

      <div
        class="
          character-creation-background-list
        "
        data-creation-background-list
      >
        ${createBackgroundRows(
          entries,
          rules.maximum,
          freeTraitPurchases
        )}
      </div>

      ${createBackgroundPicker(
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
        data-creation-background-free-trait-cost
      >
        ${freeTraitCost > 0
          ? `Extra da criação: -${freeTraitCost} Free Trait${freeTraitCost === 1 ? "" : "s"}`
          : ""}
      </small>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function readBackgroundCreationSection(
  form,
  state
) {
  state.backgrounds =
    readBackgrounds(
      form
    );


  setStateFreeTraitPurchaseOrder(
    state,
    "backgrounds",
    normalizeFreeTraitPurchaseOrder({
      order:
        readFreeTraitPurchaseOrder(
          form,
          "backgrounds"
        ),

      values:
        state.backgrounds,

      total:
        Number(
          form.dataset
            .backgroundCreationTotal
        ) ||
        5,
    })
  );


  return state;
}


export {
  adjustCharacterCreationBackgroundLevel,
  addBackground,
  removeBackground,
};
