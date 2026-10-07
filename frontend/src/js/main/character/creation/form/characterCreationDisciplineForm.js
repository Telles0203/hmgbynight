import {
  createCreationActions,
  createCreationMapEditor,
  readCreationLevelMap,
} from "./characterCreationFormCommon.js";

import {
  hasFixedClanDisciplines,
} from "../data/clanRuleCatalog.js";

import {
  getDisciplineCreationRules,
  getDisciplineEntries,
} from "./discipline/characterCreationDisciplineCatalog.js";

import {
  createDisciplineRows,
  readFixedDisciplines,
} from "./discipline/characterCreationDisciplineRows.js";

import {
  adjustCharacterCreationDisciplineLevel,
} from "./discipline/characterCreationDisciplineProgress.js";

import {
  createOutsideDisciplinePicker,
  addOutsideDiscipline,
  removeOutsideDiscipline,
} from "./discipline/characterCreationDisciplineOutside.js";

import {
  createFreeTraitPurchaseInput,
  getFreeTraitPurchaseCounts,
  getStateFreeTraitPurchaseOrder,
  isInitialCreationLifecycle,
  normalizeFreeTraitPurchaseOrder,
  readFreeTraitPurchaseOrder,
  setStateFreeTraitPurchaseOrder,
} from "../freeTraits/characterCreationFreeTraitPurchases.js";


function createDisciplineCreationLimitNotice(
  maximum
) {
  const normalizedMaximum =
    Number.isInteger(
      Number(
        maximum
      )
    )
      ? Number(
          maximum
        )
      : 2;


  return `
    <div
      class="
        small
        rounded
        px-2
        py-2
        character-creation-discipline-limit-notice
      "
    >
      <div>
        <strong class="character-creation-discipline-limit-highlight">
          Limite na criação:
        </strong>

        cada Disciplina pode possuir no máximo

        <strong class="character-creation-discipline-limit-highlight">
          ${normalizedMaximum} níveis
        </strong>.

        Níveis Intermediate e Advanced são adquiridos após a criação.
      </div>

      <div
        class="
          mt-1
          character-creation-discipline-limit-reference
        "
      >
        <em>
          Referência: Laws of the Night Revised, p. 67.
        </em>
      </div>
    </div>
  `;
}


function createFixedDisciplineEditor(
  character,
  state
) {
  const rules =
    getDisciplineCreationRules(
      character
    );


  const entries =
    getDisciplineEntries(
      character,
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
            entry.level
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


  const highlight =
    spent >
    rules.total;


  const freeTraitOrder =
    isInitialCreationLifecycle(
      character
    )
      ? normalizeFreeTraitPurchaseOrder({
          order:
            getStateFreeTraitPurchaseOrder(
              state,
              "disciplines"
            ),

          values:
            state?.disciplines,

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
      data-character-creation-section="disciplines"
      data-discipline-editor-mode="fixed"
      data-discipline-creation-total="${rules.total}"
      data-discipline-free-trait-cost="${rules.freeTraitCost}"
      data-discipline-maximum="${rules.maximum}"
    >

      ${createFreeTraitPurchaseInput(
        "disciplines",
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
          Disciplinas
        </strong>

        <span
          class="
            badge
            rounded-pill
            border
            bg-transparent
            ${highlight
              ? "border-danger text-danger"
              : "border-secondary text-secondary"}
          "
          data-creation-discipline-points
        >
          ${spent}/${rules.total}
        </span>

      </div>

      ${createDisciplineCreationLimitNotice(
        rules.maximum
      )}

      <div
        class="
          character-creation-discipline-list
        "
        data-creation-discipline-list
      >
        ${createDisciplineRows(
          entries,
          rules.maximum,
          freeTraitPurchases
        )}
      </div>

      ${createOutsideDisciplinePicker(
        entries
      )}

      <small
        class="
          character-free-trait-inline-cost
          mt-2
          ${freeTraitCost > 0
            ? ""
            : "d-none"}
        "
        data-creation-discipline-free-trait-cost
      >
        ${freeTraitCost > 0
          ? `Extra da criação: -${freeTraitCost} Free Trait${freeTraitCost === 1 ? "" : "s"}`
          : ""}
      </small>

      <div
        class="
          small
          text-secondary
          mt-2
        "
      >
        As Disciplinas marcadas como Clã são definidas automaticamente pelo clã do personagem.
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


function createFallbackDisciplineEditor(
  character,
  state
) {
  const rules =
    getDisciplineCreationRules(
      character
    );


  return `
    <form
      class="
        character-creation-inline-editor
      "
      data-character-creation-inline-form
      data-character-creation-section="disciplines"
      data-discipline-editor-mode="fallback"
    >

      <div
        class="
          character-creation-inline-heading
        "
      >
        <strong>
          Disciplinas
        </strong>
      </div>

      ${createDisciplineCreationLimitNotice(
        rules.maximum
      )}

      ${createCreationMapEditor({
        mapName:
          "disciplines",

        title:
          "Disciplinas",

        values:
          state?.disciplines,
      })}

      <div
        class="
          small
          text-secondary
          mt-2
        "
      >
        As regras automáticas de Disciplinas deste clã ainda não foram cadastradas.
      </div>

      ${createCreationActions(
        character
      )}

    </form>
  `;
}


export function createDisciplineCreationEditor(
  character,
  state
) {
  return hasFixedClanDisciplines(
    character
  )
    ? createFixedDisciplineEditor(
        character,
        state
      )
    : createFallbackDisciplineEditor(
        character,
        state
      );
}


export function readDisciplineCreationSection(
  form,
  state
) {
  const mode =
    String(
      form.dataset
        .disciplineEditorMode ||
      ""
    );


  state.disciplines =
    mode ===
    "fixed"
      ? readFixedDisciplines(
          form
        )
      : readCreationLevelMap(
          form,
          "disciplines"
        );


  if (
    mode ===
    "fixed"
  ) {
    setStateFreeTraitPurchaseOrder(
      state,
      "disciplines",
      normalizeFreeTraitPurchaseOrder({
        order:
          readFreeTraitPurchaseOrder(
            form,
            "disciplines"
          ),

        values:
          state.disciplines,

        total:
          Number(
            form.dataset
              .disciplineCreationTotal
          ) ||
          3,
      })
    );
  }


  return state;
}


export {
  adjustCharacterCreationDisciplineLevel,
  addOutsideDiscipline,
  removeOutsideDiscipline,
};
