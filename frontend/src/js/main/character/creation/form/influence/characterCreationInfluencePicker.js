import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getInfluenceLabel,
  getInfluenceOptions,
} from "./characterCreationInfluenceCatalog.js";

import {
  createInfluenceRow,
} from "./characterCreationInfluenceRows.js";

import {
  refreshCharacterCreationInfluenceEditor,
} from "./characterCreationInfluenceProgress.js";


function normalizeKeys(
  values
) {
  return (
    Array.isArray(
      values
    )
      ? values
      : []
  )
    .map(
      (
        value
      ) =>
        String(
          value ||
          ""
        )
          .trim()
          .toLowerCase()
    )
    .filter(
      Boolean
    );
}


function getUsedInfluenceKeys(
  form
) {
  return new Set(
    Array.from(
      form?.querySelectorAll(
        "[data-creation-influence-row]"
      ) ||
      []
    )
      .map(
        (
          row
        ) =>
          String(
            row.dataset
              .creationInfluenceKey ||
            ""
          )
            .trim()
            .toLowerCase()
      )
      .filter(
        Boolean
      )
  );
}


function getAvailableInfluences(
  form
) {
  const used =
    getUsedInfluenceKeys(
      form
    );


  return getInfluenceOptions()
    .filter(
      (
        option
      ) =>
        !used.has(
          String(
            option?.value ||
            ""
          )
            .trim()
            .toLowerCase()
        )
    );
}


export function createInfluencePicker(
  entries,
  blockedKeys = []
) {
  const used =
    new Set([
      ...(
        Array.isArray(
          entries
        )
          ? entries
              .map(
                (
                  entry
                ) =>
                  String(
                    entry?.influence ||
                    ""
                  )
                    .trim()
                    .toLowerCase()
              )
          : []
      ),

      ...normalizeKeys(
        blockedKeys
      ),
    ]);


  const available =
    getInfluenceOptions()
      .filter(
        (
          option
        ) =>
          !used.has(
            String(
              option?.value ||
              ""
            )
              .trim()
              .toLowerCase()
          )
      );


  return `
    <div
      class="
        character-creation-influence-picker
      "
      data-creation-influence-picker
    >

      <div
        class="
          d-flex
          align-items-center
          gap-2
        "
      >

        <select
          class="
            form-select
            form-select-sm
            bg-black
            text-light
            border-secondary
          "
          data-creation-influence-choice
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          <option value="">
            Selecione uma Influência
          </option>

          ${available
            .map(
              (
                option
              ) => `
                <option
                  value="${escapeSheetHtml(
                    option.value
                  )}"
                >
                  ${escapeSheetHtml(
                    option.label ||
                    getInfluenceLabel(
                      option.value
                    )
                  )}
                </option>
              `
            )
            .join("")}

        </select>

        <button
          type="button"
          class="
            btn
            btn-outline-secondary
            btn-sm
            text-nowrap
          "
          data-character-creation-add-influence
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          + Adicionar
        </button>

      </div>

    </div>
  `;
}


export function refreshInfluencePicker(
  form
) {
  const select =
    form?.querySelector(
      "[data-creation-influence-choice]"
    );


  const button =
    form?.querySelector(
      "[data-character-creation-add-influence]"
    );


  if (
    !select ||
    !button
  ) {
    return;
  }


  const available =
    getAvailableInfluences(
      form
    );


  select.replaceChildren();


  const placeholder =
    document.createElement(
      "option"
    );


  placeholder.value =
    "";

  placeholder.textContent =
    "Selecione uma Influência";


  select.appendChild(
    placeholder
  );


  available.forEach(
    (
      option
    ) => {
      const element =
        document.createElement(
          "option"
        );


      element.value =
        String(
          option?.value ||
          ""
        );


      element.textContent =
        String(
          option?.label ||
          getInfluenceLabel(
            option?.value
          )
        );


      select.appendChild(
        element
      );
    }
  );


  const disabled =
    available.length ===
    0;


  select.disabled =
    disabled;

  button.disabled =
    disabled;
}


export function addInfluence(
  button
) {
  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const select =
    form?.querySelector(
      "[data-creation-influence-choice]"
    );


  const list =
    form?.querySelector(
      "[data-creation-influence-list]"
    );


  const influence =
    String(
      select?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    !form ||
    !select ||
    !list ||
    !influence
  ) {
    return;
  }


  if (
    getUsedInfluenceKeys(
      form
    ).has(
      influence
    )
  ) {
    refreshInfluencePicker(
      form
    );


    return;
  }


  const option =
    getInfluenceOptions()
      .find(
        (
          item
        ) =>
          String(
            item?.value ||
            ""
          )
            .trim()
            .toLowerCase() ===
          influence
      );


  if (!option) {
    return;
  }


  const maximum =
    Number(
      form.dataset
        .influenceMaximum
    ) ||
    5;


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createInfluenceRow(
      {
        influence,

        level:
          0,
      },
      maximum
    );


  const row =
    wrapper.firstElementChild;


  if (!row) {
    return;
  }


  list.prepend(
    row
  );


  select.value =
    "";


  refreshInfluencePicker(
    form
  );


  refreshCharacterCreationInfluenceEditor(
    form
  );
}


export function removeInfluence(
  button
) {
  const row =
    button.closest(
      "[data-creation-influence-row]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form ||
    Number(
      row.dataset
        .creationInfluenceGrant
    ) >
      0
  ) {
    return;
  }


  row.remove();


  refreshInfluencePicker(
    form
  );


  refreshCharacterCreationInfluenceEditor(
    form
  );
}
