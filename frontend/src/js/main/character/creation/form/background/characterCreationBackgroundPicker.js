import {
  getBackgroundLabel,
  getSelectableBackgroundOptions,
} from "./characterCreationBackgroundCatalog.js";

import {
  createBackgroundRow,
} from "./characterCreationBackgroundRows.js";

import {
  refreshCharacterCreationBackgroundEditor,
} from "./characterCreationBackgroundProgress.js";


function getUsedBackgroundKeys(
  form
) {
  return new Set(
    Array.from(
      form?.querySelectorAll(
        "[data-creation-background-row]"
      ) ||
      []
    )
      .map(
        (
          row
        ) =>
          String(
            row.dataset
              .creationBackgroundKey ||
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


function getAvailableBackgrounds(
  form
) {
  const used =
    getUsedBackgroundKeys(
      form
    );


  return getSelectableBackgroundOptions()
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


export function createBackgroundPicker(
  entries
) {
  const used =
    new Set(
      (
        Array.isArray(
          entries
        )
          ? entries
          : []
      )
        .map(
          (
            entry
          ) =>
            String(
              entry?.background ||
              ""
            )
              .trim()
              .toLowerCase()
        )
        .filter(
          Boolean
        )
    );


  const available =
    getSelectableBackgroundOptions()
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
        character-creation-background-picker
      "
      data-creation-background-picker
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
          data-creation-background-choice
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          <option value="">
            Selecione um Antecedente
          </option>

          ${available
            .map(
              (
                option
              ) => `
                <option
                  value="${String(
                    option.value
                  )}"
                >
                  ${String(
                    option.label ||
                    getBackgroundLabel(
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
          data-character-creation-add-background
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          + Adicionar
        </button>

      </div>

      <small
        class="
          character-creation-background-picker-note
        "
      >
        Influence será configurada separadamente na seção Influências.
      </small>

    </div>
  `;
}


export function refreshBackgroundPicker(
  form
) {
  const select =
    form?.querySelector(
      "[data-creation-background-choice]"
    );


  const button =
    form?.querySelector(
      "[data-character-creation-add-background]"
    );


  if (
    !select ||
    !button
  ) {
    return;
  }


  const available =
    getAvailableBackgrounds(
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
    "Selecione um Antecedente";


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
          getBackgroundLabel(
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


export function addBackground(
  button
) {
  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const select =
    form?.querySelector(
      "[data-creation-background-choice]"
    );


  const list =
    form?.querySelector(
      "[data-creation-background-list]"
    );


  const background =
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
    !background
  ) {
    return;
  }


  if (
    getUsedBackgroundKeys(
      form
    ).has(
      background
    )
  ) {
    refreshBackgroundPicker(
      form
    );


    return;
  }


  const option =
    getSelectableBackgroundOptions()
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
          background
      );


  if (!option) {
    return;
  }


  const maximum =
    Number(
      form.dataset
        .backgroundMaximum
    ) ||
    5;


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createBackgroundRow(
      {
        background,

        level:
          0,

        specialMode:
          "standard",

        requiresNarratorApproval:
          option
            .requiresNarratorApproval ===
          true,
      },
      maximum
    );


  const row =
    wrapper.firstElementChild;


  if (!row) {
    return;
  }


  list.appendChild(
    row
  );


  select.value =
    "";


  refreshBackgroundPicker(
    form
  );


  refreshCharacterCreationBackgroundEditor(
    form
  );
}


export function removeBackground(
  button
) {
  const row =
    button.closest(
      "[data-creation-background-row]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form ||
    row.dataset
      .creationBackgroundSpecialMode ===
      "influence"
  ) {
    return;
  }


  row.remove();


  refreshBackgroundPicker(
    form
  );


  refreshCharacterCreationBackgroundEditor(
    form
  );
}
