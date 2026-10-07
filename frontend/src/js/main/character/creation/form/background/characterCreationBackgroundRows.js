import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getBackgroundLabel,
  getBackgroundOption,
} from "./characterCreationBackgroundCatalog.js";


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


function createStandardBackgroundControls(
  level,
  maximum,
  grantedLevel
) {
  return `
    <div
      class="
        character-creation-background-controls
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
        data-character-creation-background-action="decrease"
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
        data-creation-background-level
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
        data-character-creation-background-action="increase"
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
            data-character-creation-remove-background
            aria-label="Remover Antecedente"
            title="Remover Antecedente"
          >
            ×
          </button>
        `}

    </div>
  `;
}


function createInfluenceBackgroundControls(
  level
) {
  return `
    <div
      class="
        character-creation-background-controls
      "
    >
      <span
        class="
          fw-semibold
          text-center
        "
        data-creation-background-level
      >
        ${level}
      </span>
    </div>
  `;
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
        entry.background
      ] =
        {
          ...entry,
        };
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
      background
    ) => {
      const purchasedEntry =
        purchased[
          background
        ] ||
        {};


      const purchasedLevel =
        normalizeLevel(
          purchasedEntry.level
        );


      const grantedLevel =
        normalizeLevel(
          grants?.[
            background
          ]
        );


      const option =
        getBackgroundOption(
          background
        );


      return {
        background,

        purchasedLevel,

        grantedLevel,

        level:
          purchasedLevel +
          grantedLevel,

        specialMode:
          purchasedEntry
            .specialMode ||
          option?.specialMode ||
          "standard",

        requiresNarratorApproval:
          purchasedEntry
            .requiresNarratorApproval ===
            true ||
          option
            ?.requiresNarratorApproval ===
            true,
      };
    }
  );
}


export function createBackgroundRow(
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


  const influence =
    entry?.specialMode ===
    "influence";


  return `
    <div
      class="
        character-creation-background-row
        ${freeTraitLevel > 0
          ? "is-free-trait-spend"
          : ""}
      "
      data-creation-background-row
      data-creation-background-key="${escapeSheetHtml(
        entry?.background ||
        ""
      )}"
      data-creation-background-grant="${grantedLevel}"
      data-creation-background-special-mode="${influence
        ? "influence"
        : "standard"}"
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
          character-creation-background-name
        "
      >

        <span>
          ${escapeSheetHtml(
            getBackgroundLabel(
              entry?.background
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

        ${influence
          ? `
            <small
              class="
                character-background-special-badge
              "
            >
              Influências
            </small>
          `
          : ""}

      </div>

      ${influence
        ? createInfluenceBackgroundControls(
            level
          )
        : createStandardBackgroundControls(
            level,
            maximum,
            grantedLevel
          )}

    </div>
  `;
}


export function createBackgroundRows(
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
        getBackgroundLabel(
          first?.background
        ).localeCompare(
          getBackgroundLabel(
            second?.background
          )
        )
    )
    .map(
      (
        entry
      ) =>
        createBackgroundRow(
          entry,
          maximum,
          freeTraitPurchases[
            entry.background
          ] ||
          0
        )
    )
    .join("");
}


export function readBackgrounds(
  form
) {
  const backgrounds =
    {};


  form
    .querySelectorAll(
      "[data-creation-background-row]"
    )
    .forEach(
      (
        row
      ) => {
        const key =
          String(
            row.dataset
              .creationBackgroundKey ||
            ""
          )
            .trim()
            .toLowerCase();


        const effectiveLevel =
          Number(
            row.querySelector(
              "[data-creation-background-level]"
            )?.textContent
          );


        const grantedLevel =
          Number(
            row.dataset
              .creationBackgroundGrant
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
          backgrounds[
            key
          ] =
            purchasedLevel;
        }
      }
    );


  return backgrounds;
}
