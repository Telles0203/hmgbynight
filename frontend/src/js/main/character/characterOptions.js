window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };

async function loadCharacterOptions() {
  try {
    const response =
      await fetch(
        "/api/characters/options",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
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
          "Não foi possível carregar as opções do personagem."
      );
    }

    window.ByNightMain.character.options = {
      sects: Array.isArray(
        data.sects
      )
        ? data.sects
        : [],

      clans: Array.isArray(
        data.clans
      )
        ? data.clans
        : [],
    };

    populateCharacterOptions();
  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
      error
    );

    if (
      typeof window.showCharacterAlert ===
      "function"
    ) {
      window.showCharacterAlert(
        "Não foi possível carregar as opções de criação."
      );
    }
  }
}

function populateCharacterOptions() {
  const options =
    window.ByNightMain.character.options;

  const sectSelect =
    document.getElementById(
      "characterSect"
    );

  const otherSectSelect =
    document.getElementById(
      "characterOtherSect"
    );

  const clanSelect =
    document.getElementById(
      "characterClan"
    );

  if (
    !options ||
    !sectSelect ||
    !otherSectSelect ||
    !clanSelect
  ) {
    return;
  }

  const mainSectValues = [
    "camarilla",
    "anarch",
    "sabbat",
  ];

  sectSelect.innerHTML = "";

  const emptySectOption =
    document.createElement(
      "option"
    );

  emptySectOption.value = "";
  emptySectOption.textContent =
    "Selecione a seita";

  sectSelect.appendChild(
    emptySectOption
  );

  mainSectValues.forEach(
    (sectValue) => {
      const sect =
        options.sects.find(
          (option) =>
            option.value ===
            sectValue
        );

      if (!sect) {
        return;
      }

      const option =
        document.createElement(
          "option"
        );

      option.value =
        sect.value;

      option.textContent =
        sect.label;

      sectSelect.appendChild(
        option
      );
    }
  );

  const otherOption =
    document.createElement(
      "option"
    );

  otherOption.value =
    "other";

  otherOption.textContent =
    "Outras opções";

  sectSelect.appendChild(
    otherOption
  );

  otherSectSelect.innerHTML =
    "";

  const emptyOtherOption =
    document.createElement(
      "option"
    );

  emptyOtherOption.value = "";

  emptyOtherOption.textContent =
    "Selecione uma opção";

  otherSectSelect.appendChild(
    emptyOtherOption
  );

  options.sects
    .filter(
      (sect) =>
        !mainSectValues.includes(
          sect.value
        )
    )
    .forEach(
      (sect) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          sect.value;

        option.textContent =
          sect.label;

        otherSectSelect.appendChild(
          option
        );
      }
    );

  clanSelect.innerHTML = "";

  const emptyClanOption =
    document.createElement(
      "option"
    );

  emptyClanOption.value = "";

  emptyClanOption.textContent =
    "Selecione o clã";

  clanSelect.appendChild(
    emptyClanOption
  );

  options.clans.forEach(
    (clan) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        clan.value;

      option.textContent =
        clan.label;

      clanSelect.appendChild(
        option
      );
    }
  );

  updateOtherSectVisibility();
}

function updateOtherSectVisibility() {
  const sectSelect =
    document.getElementById(
      "characterSect"
    );

  const otherSectSelect =
    document.getElementById(
      "characterOtherSect"
    );

  const otherSectContainer =
    document.getElementById(
      "otherSectContainer"
    );

  if (
    !sectSelect ||
    !otherSectSelect ||
    !otherSectContainer
  ) {
    return;
  }

  const showOther =
    sectSelect.value === "other";

  otherSectContainer.classList.toggle(
    "d-none",
    !showOther
  );

  otherSectSelect.required =
    showOther;

  otherSectSelect.disabled =
    !showOther;

  if (!showOther) {
    otherSectSelect.value = "";
  }
}

function getSelectedSect() {
  const sectSelect =
    document.getElementById(
      "characterSect"
    );

  const otherSectSelect =
    document.getElementById(
      "characterOtherSect"
    );

  if (!sectSelect) {
    return "";
  }

  if (
    sectSelect.value === "other"
  ) {
    return (
      otherSectSelect?.value ||
      ""
    );
  }

  return sectSelect.value;
}

function getSectLabel(
  sectValue
) {
  const options =
    window.ByNightMain.character.options;

  if (!options) {
    return sectValue || "";
  }

  const sect =
    options.sects.find(
      (option) =>
        option.value ===
        sectValue
    );

  return (
    sect?.label ||
    sectValue ||
    ""
  );
}

window.loadCharacterOptions =
  loadCharacterOptions;

window.populateCharacterOptions =
  populateCharacterOptions;

window.updateOtherSectVisibility =
  updateOtherSectVisibility;

window.getSelectedSect =
  getSelectedSect;

window.getSectLabel =
  getSectLabel;