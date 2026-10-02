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

let horizontalAnimationFrame = null;
let characterDetailsAnimationFrame = null;

let characterTransitioning = false;

const verticalMetrics =
  new WeakMap();


// ==============================
// Toggle
// ==============================

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


// ==============================
// Open
// ==============================

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


// ==============================
// Close
// ==============================

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


// ==============================
// Character details
// ==============================

function animateCharacterDetails(
  card,
  opening,
  duration
) {
  cancelCharacterDetailsAnimation();

  const details =
    card.querySelector(
      ".character-card-details"
    );

  if (!details) {
    return Promise.resolve();
  }

  return new Promise(
    (resolve) => {
      let startHeight;
      let targetHeight;

      if (opening) {

        card.classList.remove(
          "is-closing"
        );

        details.style.height =
          "0px";

        details.style.opacity =
          "0";

        /*
         * Registra o estado fechado.
         */
        details.getBoundingClientRect();

        /*
         * O CSS anima somente
         * o conteúdo interno.
         */
        card.classList.add(
          "is-open"
        );

        /*
         * Altura natural completa
         * da ficha.
         */
        targetHeight =
          details.scrollHeight;

        startHeight = 0;

      } else {

        startHeight =
          details
            .getBoundingClientRect()
            .height;

        targetHeight = 0;

        details.style.height =
          `${startHeight}px`;

        details.style.opacity =
          "1";

        /*
         * Mantém is-open durante
         * toda a retração.
         */
        card.classList.add(
          "is-closing"
        );

        details.getBoundingClientRect();
      }

      const startedAt =
        performance.now();

      function update(now) {
        const progress =
          Math.min(
            (
              now -
              startedAt
            ) /
            duration,
            1
          );

        const eased =
          easeInOutSine(
            progress
          );

        const currentHeight =
          startHeight +
          (
            targetHeight -
            startHeight
          ) *
          eased;

        const currentOpacity =
          opening
            ? eased
            : 1 - eased;

        details.style.height =
          `${Math.max(
            0,
            currentHeight
          )}px`;

        details.style.opacity =
          String(
            currentOpacity
          );

        if (progress < 1) {
          characterDetailsAnimationFrame =
            requestAnimationFrame(
              update
            );

          return;
        }

        characterDetailsAnimationFrame =
          null;

        if (opening) {

          details.style.height =
            "auto";

          details.style.opacity =
            "1";

        } else {

          card.classList.remove(
            "is-open",
            "is-closing"
          );

          details.style.height =
            "0px";

          details.style.opacity =
            "0";
        }

        resolve();
      }

      characterDetailsAnimationFrame =
        requestAnimationFrame(
          update
        );
    }
  );
}


// ==============================
// Collapse elements
// ==============================

async function collapseElements(
  elements,
  duration
) {
  await Promise.all(
    elements.map(
      (element) =>
        collapseElement(
          element,
          duration
        )
    )
  );
}


async function collapseElement(
  element,
  duration
) {
  const style =
    window.getComputedStyle(
      element
    );

  const metrics = {
    height:
      element
        .getBoundingClientRect()
        .height,

    marginTop:
      parseFloat(
        style.marginTop
      ) || 0,

    marginBottom:
      parseFloat(
        style.marginBottom
      ) || 0,

    paddingTop:
      parseFloat(
        style.paddingTop
      ) || 0,

    paddingBottom:
      parseFloat(
        style.paddingBottom
      ) || 0,

    borderTopWidth:
      parseFloat(
        style.borderTopWidth
      ) || 0,

    borderBottomWidth:
      parseFloat(
        style.borderBottomWidth
      ) || 0,

    opacity:
      parseFloat(
        style.opacity
      ) || 1,
  };

  verticalMetrics.set(
    element,
    metrics
  );

  element.style.overflow =
    "hidden";

  element.style.pointerEvents =
    "none";

  const animation =
    element.animate(
      [
        {
          height:
            `${metrics.height}px`,

          marginTop:
            `${metrics.marginTop}px`,

          marginBottom:
            `${metrics.marginBottom}px`,

          paddingTop:
            `${metrics.paddingTop}px`,

          paddingBottom:
            `${metrics.paddingBottom}px`,

          borderTopWidth:
            `${metrics.borderTopWidth}px`,

          borderBottomWidth:
            `${metrics.borderBottomWidth}px`,

          opacity:
            metrics.opacity,

          transform:
            "translateY(0)",
        },

        {
          height: "0px",
          marginTop: "0px",
          marginBottom: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          borderTopWidth: "0px",
          borderBottomWidth: "0px",

          opacity: 0,

          transform:
            "translateY(-16px)",
        },
      ],
      {
        duration,

        easing:
          "cubic-bezier(0.45, 0, 0.55, 1)",

        fill:
          "forwards",
      }
    );

  await animation.finished;

  element.style.height =
    "0px";

  element.style.marginTop =
    "0px";

  element.style.marginBottom =
    "0px";

  element.style.paddingTop =
    "0px";

  element.style.paddingBottom =
    "0px";

  element.style.borderTopWidth =
    "0px";

  element.style.borderBottomWidth =
    "0px";

  element.style.opacity =
    "0";

  element.style.transform =
    "translateY(-16px)";

  animation.cancel();
}


// ==============================
// Expand elements
// ==============================

async function expandElements(
  elements,
  duration
) {
  await Promise.all(
    elements.map(
      (element) =>
        expandElement(
          element,
          duration
        )
    )
  );
}


async function expandElement(
  element,
  duration
) {
  const metrics =
    verticalMetrics.get(
      element
    );

  if (!metrics) {
    return;
  }

  const animation =
    element.animate(
      [
        {
          height: "0px",
          marginTop: "0px",
          marginBottom: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          borderTopWidth: "0px",
          borderBottomWidth: "0px",

          opacity: 0,

          transform:
            "translateY(-16px)",
        },

        {
          height:
            `${metrics.height}px`,

          marginTop:
            `${metrics.marginTop}px`,

          marginBottom:
            `${metrics.marginBottom}px`,

          paddingTop:
            `${metrics.paddingTop}px`,

          paddingBottom:
            `${metrics.paddingBottom}px`,

          borderTopWidth:
            `${metrics.borderTopWidth}px`,

          borderBottomWidth:
            `${metrics.borderBottomWidth}px`,

          opacity:
            metrics.opacity,

          transform:
            "translateY(0)",
        },
      ],
      {
        duration,

        easing:
          "cubic-bezier(0.45, 0, 0.55, 1)",

        fill:
          "forwards",
      }
    );

  await animation.finished;

  animation.cancel();

  clearVerticalStyles(
    element
  );

  verticalMetrics.delete(
    element
  );
}


// ==============================
// Clear vertical styles
// ==============================

function clearVerticalStyles(
  element
) {
  element.style.height = "";
  element.style.marginTop = "";
  element.style.marginBottom = "";
  element.style.paddingTop = "";
  element.style.paddingBottom = "";
  element.style.borderTopWidth = "";
  element.style.borderBottomWidth = "";
  element.style.opacity = "";
  element.style.transform = "";
  element.style.overflow = "";
  element.style.pointerEvents = "";
}


// ==============================
// Horizontal animation
// ==============================

function animateHorizontalPanels({
  panelsContainer,
  characterPanel,
  housePanel,
  opening,
  duration,
}) {
  cancelHorizontalAnimation();

  return new Promise(
    (resolve) => {
      const containerWidth =
        panelsContainer
          .getBoundingClientRect()
          .width;

      const styles =
        window.getComputedStyle(
          panelsContainer
        );

      const gap =
        Number.parseFloat(
          styles.columnGap ||
          styles.gap ||
          "0"
        ) || 0;

      const mobile =
        window.matchMedia(
          "(max-width: 991.98px)"
        ).matches;

      const normalWidth =
        mobile
          ? containerWidth
          : (
              containerWidth -
              gap
            ) / 2;

      const fullWidth =
        containerWidth;

      const startWidth =
        characterPanel
          .getBoundingClientRect()
          .width;

      const targetWidth =
        opening
          ? fullWidth
          : normalWidth;

      const startHouseOffset =
        opening
          ? 0
          : 115;

      const targetHouseOffset =
        opening
          ? 115
          : 0;

      const startHouseOpacity =
        opening
          ? 1
          : 0;

      const targetHouseOpacity =
        opening
          ? 0
          : 1;

      const startedAt =
        performance.now();

      function update(now) {
        const progress =
          Math.min(
            (
              now -
              startedAt
            ) /
            duration,
            1
          );

        const eased =
          easeInOutSine(
            progress
          );

        const width =
          startWidth +
          (
            targetWidth -
            startWidth
          ) *
          eased;

        const houseOffset =
          startHouseOffset +
          (
            targetHouseOffset -
            startHouseOffset
          ) *
          eased;

        const houseOpacity =
          startHouseOpacity +
          (
            targetHouseOpacity -
            startHouseOpacity
          ) *
          eased;

        characterPanel.style.width =
          `${width}px`;

        housePanel.style.transform =
          `translateX(${houseOffset}%)`;

        housePanel.style.opacity =
          String(
            houseOpacity
          );

        if (progress < 1) {
          horizontalAnimationFrame =
            requestAnimationFrame(
              update
            );

          return;
        }

        horizontalAnimationFrame =
          null;

        if (opening) {

          characterPanel.style.width =
            `${fullWidth}px`;

          housePanel.style.transform =
            "translateX(115%)";

          housePanel.style.opacity =
            "0";

        } else {

          characterPanel.style.width =
            "";

          housePanel.style.transform =
            "";

          housePanel.style.opacity =
            "";
        }

        resolve();
      }

      horizontalAnimationFrame =
        requestAnimationFrame(
          update
        );
    }
  );
}


// ==============================
// Easing
// ==============================

function easeInOutSine(
  value
) {
  return -(
    Math.cos(
      Math.PI * value
    ) - 1
  ) / 2;
}


// ==============================
// Cancel animations
// ==============================

function cancelHorizontalAnimation() {
  if (
    horizontalAnimationFrame ===
    null
  ) {
    return;
  }

  cancelAnimationFrame(
    horizontalAnimationFrame
  );

  horizontalAnimationFrame =
    null;
}


function cancelCharacterDetailsAnimation() {
  if (
    characterDetailsAnimationFrame ===
    null
  ) {
    return;
  }

  cancelAnimationFrame(
    characterDetailsAnimationFrame
  );

  characterDetailsAnimationFrame =
    null;
}


// ==============================
// Elements
// ==============================

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


// ==============================
// Globals
// ==============================

window.toggleCharacterView =
  toggleCharacterView;

window.openCharacterView =
  openCharacterView;

window.closeCharacterView =
  closeCharacterView;