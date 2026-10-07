window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options:
      null,

    characters:
      [],
  };


async function loadCharacterOptions() {
  try {
    const response =
      await fetch(
        "/api/characters/options",
        {
          method:
            "GET",

          credentials:
            "include",

          cache:
            "no-store",
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        "Não foi possível carregar as opções do personagem."
      );
    }


    window.ByNightMain
      .character
      .options = {
        sects:
          Array.isArray(
            data.sects
          )
            ? data.sects
            : [],

        clans:
          Array.isArray(
            data.clans
          )
            ? data.clans
            : [],

        clanRules:
          Array.isArray(
            data.clanRules
          )
            ? data.clanRules
            : [],

        moralityPaths:
          Array.isArray(
            data.moralityPaths
          )
            ? data.moralityPaths
            : [],

        abilities:
          Array.isArray(
            data.abilities
          )
            ? data.abilities
            : [],

        abilityRules:
          data.abilityRules &&
          typeof data.abilityRules ===
            "object"
            ? data.abilityRules
            : {
                total:
                  5,

                freeTraitCost:
                  1,

                specializationFreeTraitCost:
                  1,
              },

        disciplineRules:
          data.disciplineRules &&
          typeof data.disciplineRules ===
            "object"
            ? data.disciplineRules
            : {
                defaultTotal:
                  3,

                sabbatTotal:
                  4,

                maximumLevelDuringCreation:
                  2,

                freeTraitCost:
                  3,
              },

        disciplines:
          Array.isArray(
            data.disciplines
          )
            ? data.disciplines
            : [],

        backgroundRules:
          data.backgroundRules &&
          typeof data.backgroundRules ===
            "object"
            ? data.backgroundRules
            : {
                defaultTotal:
                  5,

                sabbatTotal:
                  0,

                maximumPerBackground:
                  5,

                freeTraitCost:
                  1,
              },

        backgrounds:
          Array.isArray(
            data.backgrounds
          )
            ? data.backgrounds
            : [],

        ruleset:
          data.ruleset &&
          typeof data.ruleset ===
            "object"
            ? data.ruleset
            : null,

        limits:
          data.limits &&
          typeof data.limits ===
            "object"
            ? data.limits
            : {},
      };


    populateCharacterOptions();

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
      error
    );


    window.showCharacterAlert?.(
      "Não foi possível carregar as opções de criação."
    );
  }
}


function populateCharacterOptions() {
  const options =
    window.ByNightMain
      .character
      .options;


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


  sectSelect.innerHTML =
    '<option value="">Selecione a seita</option>';


  mainSectValues.forEach(
    (
      sectValue
    ) => {
      const sect =
        options.sects.find(
          (
            option
          ) =>
            option.value ===
            sectValue
        );


      if (
        !sect
      ) {
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
    '<option value="">Selecione uma opção</option>';


  options.sects
    .filter(
      (
        sect
      ) =>
        !mainSectValues.includes(
          sect.value
        )
    )
    .forEach(
      (
        sect
      ) => {
        const option =
          document.createElement(
            "option"
          );


        option.value =
          sect.value;

        option.textContent =
          sect.label;


        otherSectSelect
          .appendChild(
            option
          );
      }
    );


  clanSelect.innerHTML =
    '<option value="">Selecione o clã</option>';


  options.clans.forEach(
    (
      clan
    ) => {
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
    sectSelect.value ===
    "other";


  otherSectContainer
    .classList
    .toggle(
      "d-none",
      !showOther
    );


  otherSectSelect.required =
    showOther;

  otherSectSelect.disabled =
    !showOther;


  if (
    !showOther
  ) {
    otherSectSelect.value =
      "";
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


  if (
    !sectSelect
  ) {
    return "";
  }


  if (
    sectSelect.value ===
    "other"
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
    window.ByNightMain
      .character
      .options;


  const sect =
    options?.sects?.find(
      (
        option
      ) =>
        option.value ===
        sectValue
    );


  return (
    sect?.label ||
    sectValue ||
    ""
  );
}


function getClanLabel(
  clanValue
) {
  const options =
    window.ByNightMain
      .character
      .options;


  const clan =
    options?.clans?.find(
      (
        option
      ) =>
        option.value ===
        clanValue
    );


  return (
    clan?.label ||
    clanValue ||
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

window.getClanLabel =
  getClanLabel;
