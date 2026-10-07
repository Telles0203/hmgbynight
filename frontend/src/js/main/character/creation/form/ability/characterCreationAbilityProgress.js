function getAbilityEditorProgress(
  form
) {
  const total =
    Number(
      form.dataset
        .abilityCreationTotal
    );


  const freeTraitCost =
    Number(
      form.dataset
        .abilityFreeTraitCost
    );


  let spent =
    0;


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const ability =
          String(
            row.querySelector(
              "[data-creation-ability-key]"
            )?.value ||
            ""
          ).trim();


        if (!ability) {
          return;
        }


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
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


  const normalizedTotal =
    Number.isInteger(
      total
    )
      ? total
      : 5;


  const normalizedCost =
    Number.isInteger(
      freeTraitCost
    )
      ? freeTraitCost
      : 1;


  const extra =
    Math.max(
      0,
      spent -
        normalizedTotal
    );


  return {
    spent,

    total:
      normalizedTotal,

    extra,

    freeTraitCost:
      extra *
      normalizedCost,
  };
}


function refreshAbilityRowControls(
  form
) {
  const maximum =
    Number(
      form.dataset
        .abilityMaximum
    ) ||
    5;


  form
    .querySelectorAll(
      '.character-creation-map-row[data-creation-map="abilities"]'
    )
    .forEach(
      (
        row
      ) => {
        const selected =
          Boolean(
            String(
              row.querySelector(
                "[data-creation-ability-key]"
              )?.value ||
              ""
            ).trim()
          );


        const level =
          Number(
            row.querySelector(
              "[data-creation-ability-level]"
            )?.textContent
          ) ||
          1;


        const decrease =
          row.querySelector(
            '[data-character-creation-ability-action="decrease"]'
          );


        const increase =
          row.querySelector(
            '[data-character-creation-ability-action="increase"]'
          );


        if (decrease) {
          decrease.disabled =
            !selected ||
            level <=
              1;
        }


        if (increase) {
          increase.disabled =
            !selected ||
            level >=
              maximum;
        }
      }
    );
}


export function refreshCharacterCreationAbilityEditor(
  form
) {
  if (!form) {
    return;
  }


  const progress =
    getAbilityEditorProgress(
      form
    );


  const counter =
    form.querySelector(
      "[data-creation-ability-points]"
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
      "[data-creation-ability-free-trait-cost]"
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


  refreshAbilityRowControls(
    form
  );
}


export function adjustCharacterCreationAbilityLevel(
  button
) {
  const row =
    button.closest(
      '.character-creation-map-row[data-creation-map="abilities"]'
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


  const selected =
    String(
      row.querySelector(
        "[data-creation-ability-key]"
      )?.value ||
      ""
    ).trim();


  if (!selected) {
    return;
  }


  const levelElement =
    row.querySelector(
      "[data-creation-ability-level]"
    );


  if (!levelElement) {
    return;
  }


  const current =
    Number(
      levelElement.textContent
    ) ||
    1;


  const maximum =
    Number(
      form.dataset
        .abilityMaximum
    ) ||
    5;


  const action =
    String(
      button.dataset
        .characterCreationAbilityAction ||
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
      1 ||
    next >
      maximum
  ) {
    return;
  }


  levelElement.textContent =
    String(
      next
    );


  refreshCharacterCreationAbilityEditor(
    form
  );
}


export function getStateAbilityProgress(
  state,
  total,
  freeTraitCost
) {
  const spent =
    Object.values(
      state?.abilities ||
      {}
    ).reduce(
      (
        sum,
        level
      ) => {
        const normalized =
          Number(
            level
          );


        return (
          sum +
          (
            Number.isInteger(
              normalized
            ) &&
            normalized >
              0
              ? normalized
              : 0
          )
        );
      },
      0
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

    freeTraitCost:
      extra *
      freeTraitCost,
  };
}
