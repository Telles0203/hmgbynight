import {
  escapeSheetHtml,
} from "../../../view/sheet/characterSheetCommon.js";

import {
  getDisciplineLabel,
} from "../../data/clanRuleCatalog.js";

import {
  createDisciplineRow,
} from "./characterCreationDisciplineRows.js";

import {
  refreshCharacterCreationDisciplineEditor,
} from "./characterCreationDisciplineProgress.js";


function getDisciplineOptions() {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.disciplines;


  return Array.isArray(
    options
  )
    ? options
    : [];
}


function getUsedDisciplineKeys(
  form
) {
  return new Set(
    Array.from(
      form?.querySelectorAll(
        "[data-creation-discipline-row]"
      ) ||
      []
    )
      .map(
        (
          row
        ) =>
          String(
            row.dataset
              .creationDisciplineKey ||
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


function getAvailableDisciplines(
  used
) {
  return getDisciplineOptions()
    .filter(
      (
        option
      ) => {
        const key =
          String(
            option?.value ||
            ""
          )
            .trim()
            .toLowerCase();


        return (
          key &&
          !used.has(
            key
          )
        );
      }
    );
}


function createDisciplineOptionMarkup(
  option
) {
  const value =
    String(
      option?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const label =
    String(
      option?.label ||
      getDisciplineLabel(
        value
      )
    );


  return `
    <option
      value="${escapeSheetHtml(
        value
      )}"
    >
      ${escapeSheetHtml(
        label
      )}
    </option>
  `;
}


export function createOutsideDisciplinePicker(
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
              entry?.discipline ||
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
    getAvailableDisciplines(
      used
    );


  return `
    <div
      class="
        character-creation-outside-discipline-picker
        mt-2
      "
      data-creation-outside-discipline-picker
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
          data-creation-outside-discipline-choice
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          <option value="">
            Selecione uma Disciplina
          </option>

          ${available
            .map(
              createDisciplineOptionMarkup
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
          data-character-creation-add-outside-discipline
          ${available.length === 0
            ? "disabled"
            : ""}
        >
          + Adicionar Disciplina
        </button>

      </div>

      <small
        class="
          text-secondary
          character-creation-outside-discipline-note
        "
      >
        Disciplinas fora do clã requerem aprovação da Narração.
      </small>

    </div>
  `;
}


export function refreshOutsideDisciplinePicker(
  form
) {
  const picker =
    form?.querySelector(
      "[data-creation-outside-discipline-picker]"
    );


  const select =
    picker?.querySelector(
      "[data-creation-outside-discipline-choice]"
    );


  const button =
    picker?.querySelector(
      "[data-character-creation-add-outside-discipline]"
    );


  if (
    !picker ||
    !select ||
    !button
  ) {
    return;
  }


  const available =
    getAvailableDisciplines(
      getUsedDisciplineKeys(
        form
      )
    );


  select.replaceChildren();


  const placeholder =
    document.createElement(
      "option"
    );


  placeholder.value =
    "";

  placeholder.textContent =
    "Selecione uma Disciplina";


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
        )
          .trim()
          .toLowerCase();

      element.textContent =
        String(
          option?.label ||
          getDisciplineLabel(
            element.value
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


export function addOutsideDiscipline(
  button
) {
  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const select =
    form?.querySelector(
      "[data-creation-outside-discipline-choice]"
    );


  const list =
    form?.querySelector(
      "[data-creation-discipline-list]"
    );


  const discipline =
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
    !discipline
  ) {
    return;
  }


  if (
    getUsedDisciplineKeys(
      form
    ).has(
      discipline
    )
  ) {
    refreshOutsideDisciplinePicker(
      form
    );


    return;
  }


  const maximum =
    Number(
      form.dataset
        .disciplineMaximum
    ) ||
    2;


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createDisciplineRow(
      {
        discipline,

        level:
          0,

        clan:
          false,
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


  refreshOutsideDisciplinePicker(
    form
  );


  refreshCharacterCreationDisciplineEditor(
    form
  );
}


export function removeOutsideDiscipline(
  button
) {
  const row =
    button.closest(
      "[data-creation-discipline-row]"
    );


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  if (
    !row ||
    !form ||
    row.dataset
      .creationDisciplineClan ===
      "true"
  ) {
    return;
  }


  row.remove();


  refreshOutsideDisciplinePicker(
    form
  );


  refreshCharacterCreationDisciplineEditor(
    form
  );
}
