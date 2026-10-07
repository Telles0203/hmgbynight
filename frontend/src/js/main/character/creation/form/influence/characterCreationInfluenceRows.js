import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getInfluenceLabel,
} from "./characterCreationInfluenceCatalog.js";


function normalizeLevel(
  value
) {
  const level =
    Number(
      value
    );


  return (
    Number.isInteger(
      level
    ) &&
    level >
      0
      ? level
      : 0
  );
}


function createEffectiveEntries(
  entries,
  grants
) {
  const purchased =
    {};


  (
    Array.isArray(
      entries
    )
      ? entries
      : []
  ).forEach(
    (
      entry
    ) => {
      purchased[
        entry.influence
      ] =
        normalizeLevel(
          entry.level
        );
    }
  );


  const keys =
    new Set([
      ...Object.keys(
        purchased
      ),

      ...Object.keys(
        grants ||
        {}
      ),
    ]);


  return Array.from(
    keys
  ).map(
    (
      influence
    ) => {
      const purchasedLevel =
        normalizeLevel(
          purchased[
            influence
          ]
        );


      const grantedLevel =
        normalizeLevel(
          grants?.[
            influence
          ]
        );


      return {
        influence,

        purchasedLevel,

        grantedLevel,

        level:
          purchasedLevel +
          grantedLevel,
      };
    }
  );
}


export function createInfluenceRow(
  entry,
  maximum,
  freeTraitLevel = 0
) {
  const grantedLevel =
    normalizeLevel(
      entry?.grantedLevel
    );


  const level =
    Math.max(
      grantedLevel,
      Math.min(
        maximum,
        normalizeLevel(
          entry?.level
        )
      )
    );


  return `
    <div
      class="
        character-creation-influence-row
        ${freeTraitLevel > 0
          ? "is-free-trait-spend"
          : ""}
      "
      data-creation-influence-row
      data-creation-influence-key="${escapeSheetHtml(
        entry?.influence ||
        ""
      )}"
      data-creation-influence-grant="${grantedLevel}"
      data-creation-free-trait-level="${Math.max(
        0,
        Number(
          freeTraitLevel
        ) ||
        0
      )}"
    >

      <div
        class="
          character-creation-influence-name
        "
      >

        <span>
          ${escapeSheetHtml(
            getInfluenceLabel(
              entry?.influence
            )
          )}
        </span>

        ${grantedLevel > 0
          ? `
            <small
              class="
                character-creation-clan-grant-badge
              "
            >
              Clã +${grantedLevel}
            </small>
          `
          : ""}

      </div>

      <div
        class="
          character-creation-influence-controls
        "
      >

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            py-0
            px-2
          "
          data-character-creation-influence-action="decrease"
          ${level <=
          grantedLevel
            ? "disabled"
            : ""}
        >
          −
        </button>

        <span
          class="
            fw-semibold
            text-center
          "
          data-creation-influence-level
        >
          ${level}
        </span>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            py-0
            px-2
          "
          data-character-creation-influence-action="increase"
          ${level >=
          maximum
            ? "disabled"
            : ""}
        >
          +
        </button>

        ${grantedLevel > 0
          ? ""
          : `
            <button
              type="button"
              class="
                btn
                btn-outline-danger
                btn-sm
                py-0
                px-2
              "
              data-character-creation-remove-influence
              aria-label="Remover Influência"
              title="Remover Influência"
            >
              ×
            </button>
          `}

      </div>

    </div>
  `;
}


export function createInfluenceRows(
  entries,
  maximum,
  freeTraitPurchases = {},
  grants = {}
) {
  return createEffectiveEntries(
    entries,
    grants
  )
    .filter(
      (
        entry
      ) =>
        entry.level >
        0
    )
    .sort(
      (
        first,
        second
      ) =>
        getInfluenceLabel(
          first?.influence
        ).localeCompare(
          getInfluenceLabel(
            second?.influence
          )
        )
    )
    .map(
      (
        entry
      ) =>
        createInfluenceRow(
          entry,
          maximum,
          freeTraitPurchases[
            entry.influence
          ] ||
          0
        )
    )
    .join("");
}


export function readInfluences(
  form
) {
  const influences =
    {};


  form
    .querySelectorAll(
      "[data-creation-influence-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationInfluenceKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const effectiveLevel =
          Number(
            row.querySelector(
              "[data-creation-influence-level]"
            )?.textContent
          );


        const grantedLevel =
          Number(
            row.dataset
              .creationInfluenceGrant
          ) ||
          0;


        const purchasedLevel =
          effectiveLevel -
          grantedLevel;


        if (
          key &&
          Number.isInteger(
            purchasedLevel
          ) &&
          purchasedLevel >
            0
        ) {
          influences[
            key
          ] =
            purchasedLevel;
        }
      }
    );


  return influences;
}
