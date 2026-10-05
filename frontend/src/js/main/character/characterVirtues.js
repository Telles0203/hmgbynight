// =============================================
// Character Virtues
// =============================================


// =============================================
// Public click handler
// =============================================

export async function handleCharacterVirtueClick(
  event,
  container
) {
  const target =
    event.target instanceof Element
      ? event.target
      : null;


  if (!target) {
    return false;
  }


  const button =
    target.closest(
      "[data-character-virtue-action]"
    );


  if (
    !button ||
    !container.contains(
      button
    )
  ) {
    return false;
  }


  event.preventDefault();


  const row =
    button.closest(
      ".character-virtue-row"
    );


  const card =
    button.closest(
      ".character-card"
    );


  if (
    !row ||
    !card
  ) {
    return true;
  }


  const characterId =
    String(
      row.dataset
        .characterId ||
      ""
    );


  const virtueKey =
    String(
      row.dataset
        .virtueKey ||
      ""
    );


  const currentValue =
    Number(
      row.dataset
        .virtueValue
    );


  const minimum =
    Number(
      row.dataset
        .virtueMinimum
    );


  const maximum =
    Number(
      row.dataset
        .virtueMaximum
    );


  const action =
    String(
      button.dataset
        .characterVirtueAction ||
      ""
    );


  if (
    !characterId ||
    !virtueKey ||
    !Number.isFinite(
      currentValue
    )
  ) {
    return true;
  }


  let nextValue =
    currentValue;


  if (
    action ===
    "increase"
  ) {
    nextValue +=
      1;

  } else if (
    action ===
    "decrease"
  ) {
    nextValue -=
      1;

  } else {
    return true;
  }


  // =============================================
  // Client-side convenience checks
  //
  // Backend remains authoritative.
  // =============================================

  if (
    Number.isFinite(
      minimum
    ) &&
    nextValue <
      minimum
  ) {
    return true;
  }


  if (
    Number.isFinite(
      maximum
    ) &&
    nextValue >
      maximum
  ) {
    return true;
  }


  await updateCharacterVirtue({
    characterId,
    virtueKey,
    value:
      nextValue,
    card,
  });


  return true;
}


// =============================================
// Update Virtue
// =============================================

async function updateCharacterVirtue({
  characterId,
  virtueKey,
  value,
  card,
}) {
  const section =
    card.querySelector(
      ".character-virtues-section"
    );


  const errorElement =
    section?.querySelector(
      ".character-virtue-error"
    );


  clearVirtueError(
    errorElement
  );


  setVirtueControlsBusy(
    section,
    true
  );


  try {
    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          characterId
        )}/virtues/${encodeURIComponent(
          virtueKey
        )}`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              value,
            }),
        }
      );


    const data =
      await response
        .json()
        .catch(() => ({}));


    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        "Não foi possível alterar a Virtude."
      );
    }


    const updatedCharacter =
      data.character;


    if (
      !updatedCharacter
    ) {
      throw new Error(
        "O servidor não retornou os dados atualizados da Virtude."
      );
    }


    updateCharacterVirtueLocalState(
      characterId,
      updatedCharacter
    );


    renderCharacterVirtueState(
      card,
      updatedCharacter
    );

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao alterar Virtude:",
      error
    );


    showVirtueError(
      errorElement,
      error?.message ||
      "Não foi possível alterar a Virtude."
    );


    restoreCharacterVirtueState(
      card,
      characterId
    );

  } finally {
    setVirtueControlsBusy(
      section,
      false
    );


    restoreCharacterVirtueState(
      card,
      characterId
    );
  }
}


// =============================================
// Update local character
// =============================================

function updateCharacterVirtueLocalState(
  characterId,
  updatedCharacter
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return;
  }


  const character =
    characters.find(
      (item) =>
        String(
          item.id
        ) ===
        String(
          characterId
        )
    );


  if (!character) {
    return;
  }


  if (
    updatedCharacter.virtues &&
    typeof updatedCharacter.virtues ===
      "object"
  ) {
    character.virtues =
      updatedCharacter.virtues;
  }


  if (
    Array.isArray(
      updatedCharacter.activeVirtues
    )
  ) {
    character.activeVirtues =
      updatedCharacter.activeVirtues;
  }


  if (
    updatedCharacter.virtuePoints &&
    typeof updatedCharacter.virtuePoints ===
      "object"
  ) {
    character.virtuePoints =
      updatedCharacter.virtuePoints;
  }
}


// =============================================
// Restore from local state
// =============================================

function restoreCharacterVirtueState(
  card,
  characterId
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return;
  }


  const character =
    characters.find(
      (item) =>
        String(
          item.id
        ) ===
        String(
          characterId
        )
    );


  if (!character) {
    return;
  }


  renderCharacterVirtueState(
    card,
    {
      virtues:
        character.virtues,

      activeVirtues:
        character.activeVirtues,

      virtuePoints:
        character.virtuePoints,
    }
  );
}


// =============================================
// Render current Virtue state
// =============================================

function renderCharacterVirtueState(
  card,
  character
) {
  if (!card) {
    return;
  }


  const activeVirtues =
    Array.isArray(
      character
        ?.activeVirtues
    )
      ? character.activeVirtues
      : [];


  const points =
    character
      ?.virtuePoints;


  // =============================================
  // Counter
  // =============================================

  const counter =
    card.querySelector(
      "[data-virtue-points]"
    );


  if (
    counter &&
    points
  ) {
    const spent =
      Number.isFinite(
        points.spent
      )
        ? points.spent
        : 0;


    const total =
      Number.isFinite(
        points.total
      )
        ? points.total
        : 7;


    counter.textContent =
      `${spent}/${total}`;


    counter.dataset.complete =
      points.complete
        ? "true"
        : "false";
  }


  // =============================================
  // Rows
  // =============================================

  activeVirtues.forEach(
    (virtue) => {
      const key =
        String(
          virtue?.key ||
          ""
        );


      if (!key) {
        return;
      }


      const row =
        card.querySelector(
          `.character-virtue-row[data-virtue-key="${CSS.escape(
            key
          )}"]`
        );


      if (!row) {
        return;
      }


      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const maximum =
        Number.isFinite(
          virtue.maximum
        )
          ? virtue.maximum
          : 5;


      const value =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;


      row.dataset
        .virtueValue =
          String(
            value
          );


      row.dataset
        .virtueMinimum =
          String(
            minimum
          );


      row.dataset
        .virtueMaximum =
          String(
            maximum
          );


      const valueElement =
        row.querySelector(
          ".character-virtue-value"
        );


      if (
        valueElement
      ) {
        valueElement.textContent =
          String(
            value
          );
      }


      const decreaseButton =
        row.querySelector(
          '[data-character-virtue-action="decrease"]'
        );


      const increaseButton =
        row.querySelector(
          '[data-character-virtue-action="increase"]'
        );


      if (
        decreaseButton
      ) {
        decreaseButton.disabled =
          value <=
          minimum;
      }


      if (
        increaseButton
      ) {
        const noPointsRemaining =
          Number.isFinite(
            points?.remaining
          ) &&
          points.remaining <=
            0;


        increaseButton.disabled =
          value >=
            maximum ||
          noPointsRemaining;
      }
    }
  );
}


// =============================================
// Busy state
// =============================================

function setVirtueControlsBusy(
  section,
  busy
) {
  if (!section) {
    return;
  }


  section.dataset.busy =
    busy
      ? "true"
      : "false";


  section
    .querySelectorAll(
      "[data-character-virtue-action]"
    )
    .forEach(
      (button) => {
        if (busy) {
          button.disabled =
            true;
        }
      }
    );
}


// =============================================
// Errors
// =============================================

function showVirtueError(
  element,
  message
) {
  if (!element) {
    return;
  }


  element.textContent =
    String(
      message ||
      ""
    );


  element.classList.remove(
    "d-none"
  );
}


function clearVirtueError(
  element
) {
  if (!element) {
    return;
  }


  element.textContent =
    "";


  element.classList.add(
    "d-none"
  );
}