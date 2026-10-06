import {
  animateCharacterDetails,
  collapseElements,
  expandElements,
  animateHorizontalPanels,
} from "./characterAnimations.js";


window.ByNightMain =
  window.ByNightMain || {};


window.ByNightMain.character =
  window.ByNightMain.character || {
    options:
      null,

    characters:
      [],
  };


const MOTION_DURATION_SECONDS =
  1;


const MOTION_DURATION =
  MOTION_DURATION_SECONDS *
  1000;


let characterTransitioning =
  false;


export function toggleCharacterView(
  characterId
) {
  const selectedId =
    window.ByNightMain
      .character
      .selectedCharacterId;


  if (
    String(
      selectedId
    ) ===
    String(
      characterId
    )
  ) {
    closeCharacterView();

    return;
  }


  openCharacterView(
    characterId
  );
}


export async function openCharacterView(
  characterId
) {
  if (
    characterTransitioning
  ) {
    return;
  }


  const elements =
    getViewElements(
      characterId
    );


  if (
    !elements
  ) {
    return;
  }


  const {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    selectedCard,
    allCards,
    panelHeader,
    createArea,
  } =
    elements;


  characterTransitioning =
    true;


  try {
    window.ByNightMain
      .character
      .selectedCharacterId =
        characterId;


    selectedCard.classList.add(
      "is-selected"
    );


    selectedCard
      .querySelector(
        ".character-open-button"
      )
      ?.replaceChildren(
        document.createTextNode(
          "← Voltar"
        )
      );


    const elementsToCollapse = [
      ...allCards.filter(
        (
          card
        ) =>
          card !==
          selectedCard
      ),

      panelHeader,
      createArea,
    ].filter(
      Boolean
    );


    await collapseElements(
      elementsToCollapse,
      MOTION_DURATION
    );


    dashboard.classList.add(
      "character-focus"
    );


    await animateHorizontalPanels({
      panelsContainer,
      characterPanel,
      housePanel,

      opening:
        true,

      duration:
        MOTION_DURATION,
    });


    await animateCharacterDetails(
      selectedCard,
      true,
      MOTION_DURATION
    );

  } catch (error) {
    console.error(
      "[CHARACTER VIEW] Erro ao abrir personagem:",
      error
    );

  } finally {
    characterTransitioning =
      false;
  }
}


export async function closeCharacterView() {
  if (
    characterTransitioning
  ) {
    return;
  }


  const characterId =
    window.ByNightMain
      .character
      .selectedCharacterId;


  if (
    !characterId
  ) {
    return;
  }


  const elements =
    getViewElements(
      characterId
    );


  if (
    !elements
  ) {
    return;
  }


  const {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    selectedCard,
    allCards,
    panelHeader,
    createArea,
  } =
    elements;


  characterTransitioning =
    true;


  try {
    await animateCharacterDetails(
      selectedCard,
      false,
      MOTION_DURATION
    );


    await animateHorizontalPanels({
      panelsContainer,
      characterPanel,
      housePanel,

      opening:
        false,

      duration:
        MOTION_DURATION,
    });


    dashboard.classList.remove(
      "character-focus"
    );


    const elementsToExpand = [
      panelHeader,

      ...allCards.filter(
        (
          card
        ) =>
          card !==
          selectedCard
      ),

      createArea,
    ].filter(
      Boolean
    );


    await expandElements(
      elementsToExpand,
      MOTION_DURATION
    );


    selectedCard.classList.remove(
      "is-selected"
    );


    selectedCard
      .querySelector(
        ".character-open-button"
      )
      ?.replaceChildren(
        document.createTextNode(
          "Abrir →"
        )
      );


    window.ByNightMain
      .character
      .selectedCharacterId =
        null;

  } catch (error) {
    console.error(
      "[CHARACTER VIEW] Erro ao fechar personagem:",
      error
    );

  } finally {
    characterTransitioning =
      false;
  }
}


function getViewElements(
  characterId
) {
  const dashboard =
    document.getElementById(
      "mainDashboard"
    );


  const panelsContainer =
    dashboard?.querySelector(
      ".main-dashboard-panels"
    );


  const characterPanel =
    document.getElementById(
      "characterPanel"
    );


  const housePanel =
    document.getElementById(
      "housePanel"
    );


  const selectedCard =
    document.querySelector(
      `.character-card[data-character-id="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    );


  const allCards =
    Array.from(
      document.querySelectorAll(
        ".character-card"
      )
    );


  const panelHeader =
    document.getElementById(
      "characterPanelHeader"
    );


  const createArea =
    document.getElementById(
      "characterCreateArea"
    );


  if (
    !dashboard ||
    !panelsContainer ||
    !characterPanel ||
    !housePanel ||
    !selectedCard
  ) {
    return null;
  }


  return {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    selectedCard,
    allCards,
    panelHeader,
    createArea,
  };
}