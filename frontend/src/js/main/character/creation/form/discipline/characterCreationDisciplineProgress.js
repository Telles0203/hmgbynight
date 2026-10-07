function getDisciplineEditorProgress(
  form
) {
  const total =
    Number(
      form.dataset
        .disciplineCreationTotal
    ) ||
    3;


  const freeTraitCost =
    Number(
      form.dataset
        .disciplineFreeTraitCost
    ) ||
    3;


  let spent =
    0;


  form
    .querySelectorAll(
      "[data-creation-discipline-row]"
    )
    .forEach(
      (
        row
      ) => {
        const level =
          Number(
            row.querySelector(
              "[data-creation-discipline-level]"
            )?.textContent
          );


        if (
          Number.isInteger(
            level
          ) &&
          level >
          0
        ) {
          spent +=
            level;
        }
      }
    );


  const extra =
    Math.max(
      0,
      spent -
      total
    );


  return {
    spent,

    total,

    extra,

    freeTraitCost:
      extra *
      freeTraitCost,
  };
}


function refreshDisciplineRowControls(
  form
) {
  const maximum =
    Number(
      form.dataset
        .disciplineMaximum
    ) ||
    2;


  form
    .querySelectorAll(
      "[data-creation-discipline-row]"
    )
    .forEach(
      (
        row
      ) => {
        const level =
          Number(
            row.querySelector(
              "[data-creation-discipline-level]"
            )?.textContent
          ) ||
          0;


        const decrease =
          row.querySelector(
            '[data-character-creation-discipline-action="decrease"]'
          );


        const increase =
          row.querySelector(
            '[data-character-creation-discipline-action="increase"]'
          );


        if (decrease) {
          decrease.disabled =
            level <=
            0;
        }


        if (increase) {
          increase.disabled =
            level >=
            maximum;
        }
      }
    );
}


export function refreshCharacterCreationDisciplineEditor(
  form
) {
  if (!form) {
    return;
  }


  const progress =
    getDisciplineEditorProgress(
      form
    );


  const counter =
    form.querySelector(
      "[data-creation-discipline-points]"
    );


  if (counter) {
    const highlight =
      progress.spent >
      progress.total;


    counter.textContent =
      `${progress.spent}/${progress.total}`;


    counter.classList.toggle(
      "text-danger",
      highlight
    );


    counter.classList.toggle(
      "border-danger",
      highlight
    );


    counter.classList.toggle(
      "text-secondary",
      !highlight
    );


    counter.classList.toggle(
      "border-secondary",
      !highlight
    );
  }


  const cost =
    form.querySelector(
      "[data-creation-discipline-free-trait-cost]"
    );


  if (cost) {
    if (
      progress.freeTraitCost >
      0
    ) {
      cost.textContent =
        `Extra da criação: -${progress.freeTraitCost} Free Trait${progress.freeTraitCost === 1 ? "" : "s"}`;

      cost.classList.remove(
        "d-none"
      );

    } else {
      cost.textContent =
        "";

      cost.classList.add(
        "d-none"
      );
    }
  }


  refreshDisciplineRowControls(
    form
  );
}


export function adjustCharacterCreationDisciplineLevel(
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
    !form
  ) {
    return;
  }


  const levelElement =
    row.querySelector(
      "[data-creation-discipline-level]"
    );


  if (!levelElement) {
    return;
  }


  const current =
    Number(
      levelElement.textContent
    ) ||
    0;


  const maximum =
    Number(
      form.dataset
        .disciplineMaximum
    ) ||
    2;


  const action =
    String(
      button.dataset
        .characterCreationDisciplineAction ||
      ""
    );


  const direction =
    action ===
    "increase"
      ? 1
      : (
          action ===
          "decrease"
            ? -1
            : 0
        );


  if (!direction) {
    return;
  }


  const next =
    current +
    direction;


  if (
    next <
    0 ||
    next >
    maximum
  ) {
    return;
  }


  levelElement.textContent =
    String(
      next
    );


  refreshCharacterCreationDisciplineEditor(
    form
  );
}
