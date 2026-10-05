import {
  animateCharacterDetails,
  collapseElements,
  expandElements,
  animateHorizontalPanels,
} from "./characterAnimations.js";


// =============================================
// ByNight Main
// =============================================

window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };


// =============================================
// VELOCIDADE DE CADA ETAPA
// =============================================

const MOTION_DURATION_SECONDS = 1;

const MOTION_DURATION =
  MOTION_DURATION_SECONDS * 1000;


// =============================================
// State
// =============================================

let characterTransitioning = false;


// =============================================
// Toggle
// =============================================

function toggleCharacterView(
  characterId
) {
  const selectedId =
    window.ByNightMain
      .character
      .selectedCharacterId;

  if (
    String(selectedId) ===
    String(characterId)
  ) {
    closeCharacterView();
    return;
  }

  openCharacterView(
    characterId
  );
}


// =============================================
// Open
// =============================================

async function openCharacterView(
  characterId
) {
  if (characterTransitioning) {
    return;
  }

  const elements =
    getViewElements(
      characterId
    );

  if (!elements) {
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
  } = elements;

  characterTransitioning =
    true;

  window.ByNightMain
    .character
    .selectedCharacterId =
      characterId;

  dashboard.style.setProperty(
    "--character-motion-duration",
    `${MOTION_DURATION}ms`
  );

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


  // =============================================
  // FASE 1
  // Recolhe os outros personagens
  // e deixa somente o selecionado
  // =============================================

  const elementsToCollapse = [
    ...allCards.filter(
      (card) =>
        card !== selectedCard
    ),

    panelHeader,
    createArea,
  ].filter(Boolean);

  await collapseElements(
    elementsToCollapse,
    MOTION_DURATION
  );


  // =============================================
  // FASE 2
  // Expande para o lado
  // =============================================

  dashboard.classList.add(
    "character-focus"
  );

  await animateHorizontalPanels({
    panelsContainer,
    characterPanel,
    housePanel,
    opening: true,
    duration: MOTION_DURATION,
  });


  // =============================================
  // FASE 3
  // Expande a ficha para baixo
  // =============================================

  await animateCharacterDetails(
    selectedCard,
    true,
    MOTION_DURATION
  );


  // =============================================
  // Finish
  // =============================================

  characterTransitioning =
    false;
}


// =============================================
// Close
// =============================================

async function closeCharacterView() {
  if (characterTransitioning) {
    return;
  }

  const characterId =
    window.ByNightMain
      .character
      .selectedCharacterId;

  if (!characterId) {
    return;
  }

  const elements =
    getViewElements(
      characterId
    );

  if (!elements) {
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
  } = elements;

  characterTransitioning =
    true;


  // =============================================
  // FASE 1
  // Recolhe a ficha para cima
  // =============================================

  await animateCharacterDetails(
    selectedCard,
    false,
    MOTION_DURATION
  );


  // =============================================
  // FASE 2
  // Retorna para o lado
  // =============================================

  await animateHorizontalPanels({
    panelsContainer,
    characterPanel,
    housePanel,
    opening: false,
    duration: MOTION_DURATION,
  });

  dashboard.classList.remove(
    "character-focus"
  );


  // =============================================
  // FASE 3
  // Outros personagens expandem
  // novamente para baixo
  // =============================================

  const elementsToExpand = [
    panelHeader,

    ...allCards.filter(
      (card) =>
        card !== selectedCard
    ),

    createArea,
  ].filter(Boolean);

  await expandElements(
    elementsToExpand,
    MOTION_DURATION
  );


  // =============================================
  // Finish
  // =============================================

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

  characterTransitioning =
    false;
}


// =============================================
// Elements
// =============================================

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
        String(characterId)
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


// =============================================
// Globals
// =============================================

window.toggleCharacterView =
  toggleCharacterView;

window.openCharacterView =
  openCharacterView;

window.closeCharacterView =
  closeCharacterView;