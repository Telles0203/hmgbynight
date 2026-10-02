window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };


// =============================================
// VELOCIDADES
// =============================================

// Expansão/retração lateral do painel
const PANEL_DURATION_SECONDS = 1;

// Desaparecimento/aparecimento dos textos
const CONTENT_FADE_DURATION_SECONDS = 1.2;

// Cards internos da ficha
const SECTION_FADE_DURATION_SECONDS = 0.8;


// =============================================
// Calculated timings
// =============================================

const PANEL_DURATION =
  PANEL_DURATION_SECONDS * 1000;

const CONTENT_FADE_DURATION =
  CONTENT_FADE_DURATION_SECONDS * 1000;

const SECTION_FADE_DURATION =
  SECTION_FADE_DURATION_SECONDS * 1000;

const PANEL_START_DELAY =
  50;

// A ficha começa a aparecer ainda
// durante a expansão.
const DETAIL_REVEAL_DELAY =
  PANEL_DURATION * 0.30;

// A visão anterior só é removida
// depois de terminar o fade.
const OVERVIEW_REMOVE_DELAY =
  CONTENT_FADE_DURATION + 100;

// Tempo necessário para todas
// as animações terminarem.
const TRANSITION_FINISH_DELAY =
  Math.max(
    PANEL_START_DELAY +
      PANEL_DURATION,

    DETAIL_REVEAL_DELAY +
      CONTENT_FADE_DURATION,

    OVERVIEW_REMOVE_DELAY
  ) + 150;


// =============================================
// State
// =============================================

let characterTransitionTimers = [];

let characterHeightAnimationFrame =
  null;

let characterHorizontalAnimationFrame =
  null;

let characterTransitioning =
  false;


// ==============================
// Open character
// ==============================

function openCharacterView(
  characterId
) {
  if (characterTransitioning) {
    return;
  }

  const characters =
    window.ByNightMain
      .character
      .characters;

  const character =
    characters.find(
      (item) =>
        String(item.id) ===
        String(characterId)
    );

  if (!character) {
    console.error(
      "[CHARACTER] Personagem não encontrado."
    );

    return;
  }

  const elements =
    getCharacterViewElements();

  if (!elements) {
    return;
  }

  const {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    overview,
    detail,
    stage,
    nameElement,
    metaElement,
  } = elements;

  clearCharacterTransitions();

  applyTransitionDurations(
    dashboard
  );

  characterTransitioning =
    true;

  window.ByNightMain
    .character
    .selectedCharacter =
      character;

  // ==============================
  // Character information
  // ==============================

  nameElement.textContent =
    character.name;

  const clanName =
    character.clanDisplayName ||
    character.clan ||
    "";

  const sectName =
    window.getSectLabel?.(
      character.sect
    ) ||
    character.sect ||
    "";

  metaElement.textContent =
    [
      clanName,
      sectName,
    ]
      .filter(Boolean)
      .join(" · ");

  // ==============================
  // Prepare content
  // ==============================

  overview.classList.remove(
    "d-none",
    "is-hidden"
  );

  detail.classList.remove(
    "d-none",
    "is-visible",
    "is-static"
  );

  detail.setAttribute(
    "aria-hidden",
    "true"
  );

  const startHeight =
    overview.getBoundingClientRect()
      .height;

  stage.style.height =
    `${startHeight}px`;

  // ==============================
  // 1. Overview fades gradually
  // ==============================

  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        () => {
          overview.classList.add(
            "is-hidden"
          );
        }
      );
    }
  );

  // ==============================
  // 2. Horizontal expansion
  // ==============================

  addCharacterTransition(
    () => {
      dashboard.classList.add(
        "character-focus"
      );

      animateHorizontalPanels({
        panelsContainer,
        characterPanel,
        housePanel,
        opening: true,
        duration: PANEL_DURATION,
      });

      animateCharacterHeight({
        stage,
        targetElement: detail,
        startHeight,
        duration: PANEL_DURATION,
      });
    },
    PANEL_START_DELAY
  );

  // ==============================
  // 3. Character detail gradually
  // appears during expansion
  // ==============================

  addCharacterTransition(
    () => {
      detail.setAttribute(
        "aria-hidden",
        "false"
      );

      detail.classList.add(
        "is-visible"
      );
    },
    DETAIL_REVEAL_DELAY
  );

  // ==============================
  // 4. Remove old content only
  // after fade is completed
  // ==============================

  addCharacterTransition(
    () => {
      overview.classList.add(
        "d-none"
      );
    },
    OVERVIEW_REMOVE_DELAY
  );

  // ==============================
  // 5. Finish
  // ==============================

  addCharacterTransition(
    () => {
      cancelCharacterHeightAnimation();
      cancelHorizontalAnimation();

      characterPanel.style.width =
        "100%";

      housePanel.style.transform =
        "translateX(115%)";

      housePanel.style.opacity =
        "0";

      housePanel.style.pointerEvents =
        "none";

      detail.classList.add(
        "is-static"
      );

      stage.style.height =
        "auto";

      characterTransitioning =
        false;
    },
    TRANSITION_FINISH_DELAY
  );
}


// ==============================
// Close character
// ==============================

function closeCharacterView() {
  if (characterTransitioning) {
    return;
  }

  const elements =
    getCharacterViewElements();

  if (!elements) {
    return;
  }

  const {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    overview,
    detail,
    stage,
  } = elements;

  clearCharacterTransitions();

  applyTransitionDurations(
    dashboard
  );

  characterTransitioning =
    true;

  const startHeight =
    detail.getBoundingClientRect()
      .height;

  stage.style.height =
    `${startHeight}px`;

  detail.classList.remove(
    "is-static"
  );

  overview.classList.remove(
    "d-none"
  );

  overview.classList.add(
    "is-hidden"
  );

  overview.getBoundingClientRect();

  // ==============================
  // 1. Detail fades gradually
  // ==============================

  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        () => {
          detail.classList.remove(
            "is-visible"
          );
        }
      );
    }
  );

  // ==============================
  // 2. Horizontal return
  // ==============================

  addCharacterTransition(
    () => {
      animateHorizontalPanels({
        panelsContainer,
        characterPanel,
        housePanel,
        opening: false,
        duration: PANEL_DURATION,
      });

      animateCharacterHeight({
        stage,
        targetElement: overview,
        startHeight,
        duration: PANEL_DURATION,
      });
    },
    PANEL_START_DELAY
  );

  // ==============================
  // 3. Overview gradually returns
  // ==============================

  addCharacterTransition(
    () => {
      overview.classList.remove(
        "is-hidden"
      );
    },
    DETAIL_REVEAL_DELAY
  );

  // ==============================
  // 4. Detail can disappear
  // ==============================

  addCharacterTransition(
    () => {
      detail.classList.add(
        "d-none"
      );

      detail.setAttribute(
        "aria-hidden",
        "true"
      );
    },
    OVERVIEW_REMOVE_DELAY
  );

  // ==============================
  // 5. Finish
  // ==============================

  addCharacterTransition(
    () => {
      cancelCharacterHeightAnimation();
      cancelHorizontalAnimation();

      characterPanel.style.width =
        "";

      housePanel.style.transform =
        "";

      housePanel.style.opacity =
        "";

      housePanel.style.pointerEvents =
        "";

      dashboard.classList.remove(
        "character-focus"
      );

      stage.style.height =
        "auto";

      window.ByNightMain
        .character
        .selectedCharacter =
          null;

      characterTransitioning =
        false;
    },
    TRANSITION_FINISH_DELAY
  );
}


// ==============================
// Transition durations
// ==============================

function applyTransitionDurations(
  dashboard
) {
  dashboard.style.setProperty(
    "--overview-duration",
    `${CONTENT_FADE_DURATION}ms`
  );

  dashboard.style.setProperty(
    "--detail-duration",
    `${CONTENT_FADE_DURATION}ms`
  );

  dashboard.style.setProperty(
    "--section-duration",
    `${SECTION_FADE_DURATION}ms`
  );
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

  const defaultWidth =
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
      : defaultWidth;

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
    const elapsed =
      now - startedAt;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const easedProgress =
      easeInOutSine(
        progress
      );

    const currentPanelWidth =
      startWidth +
      (
        targetWidth -
        startWidth
      ) *
      easedProgress;

    const currentHouseOffset =
      startHouseOffset +
      (
        targetHouseOffset -
        startHouseOffset
      ) *
      easedProgress;

    const currentHouseOpacity =
      startHouseOpacity +
      (
        targetHouseOpacity -
        startHouseOpacity
      ) *
      easedProgress;

    characterPanel.style.width =
      `${currentPanelWidth}px`;

    housePanel.style.transform =
      `translateX(${currentHouseOffset}%)`;

    housePanel.style.opacity =
      String(
        currentHouseOpacity
      );

    if (progress < 1) {
      characterHorizontalAnimationFrame =
        requestAnimationFrame(
          update
        );

      return;
    }

    characterHorizontalAnimationFrame =
      null;
  }

  characterHorizontalAnimationFrame =
    requestAnimationFrame(
      update
    );
}

function cancelHorizontalAnimation() {
  if (
    characterHorizontalAnimationFrame ===
    null
  ) {
    return;
  }

  cancelAnimationFrame(
    characterHorizontalAnimationFrame
  );

  characterHorizontalAnimationFrame =
    null;
}


// ==============================
// Height animation
// ==============================

function animateCharacterHeight({
  stage,
  targetElement,
  startHeight,
  duration,
}) {
  cancelCharacterHeightAnimation();

  const startedAt =
    performance.now();

  function update(now) {
    const elapsed =
      now - startedAt;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const easedProgress =
      easeInOutSine(
        progress
      );

    const targetHeight =
      targetElement.scrollHeight;

    const currentHeight =
      startHeight +
      (
        targetHeight -
        startHeight
      ) *
      easedProgress;

    stage.style.height =
      `${Math.max(
        1,
        currentHeight
      )}px`;

    if (progress < 1) {
      characterHeightAnimationFrame =
        requestAnimationFrame(
          update
        );

      return;
    }

    characterHeightAnimationFrame =
      null;
  }

  characterHeightAnimationFrame =
    requestAnimationFrame(
      update
    );
}

function cancelCharacterHeightAnimation() {
  if (
    characterHeightAnimationFrame ===
    null
  ) {
    return;
  }

  cancelAnimationFrame(
    characterHeightAnimationFrame
  );

  characterHeightAnimationFrame =
    null;
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
// Elements
// ==============================

function getCharacterViewElements() {
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

  const overview =
    document.getElementById(
      "characterPanelOverview"
    );

  const detail =
    document.getElementById(
      "characterPanelDetail"
    );

  const nameElement =
    document.getElementById(
      "selectedCharacterName"
    );

  const metaElement =
    document.getElementById(
      "selectedCharacterMeta"
    );

  if (
    !dashboard ||
    !panelsContainer ||
    !characterPanel ||
    !housePanel ||
    !overview ||
    !detail ||
    !nameElement ||
    !metaElement
  ) {
    return null;
  }

  const stage =
    ensureCharacterStage(
      overview,
      detail
    );

  return {
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    overview,
    detail,
    stage,
    nameElement,
    metaElement,
  };
}


// ==============================
// Content stage
// ==============================

function ensureCharacterStage(
  overview,
  detail
) {
  let stage =
    document.getElementById(
      "characterContentStage"
    );

  if (stage) {
    return stage;
  }

  const parent =
    overview.parentElement;

  stage =
    document.createElement(
      "div"
    );

  stage.id =
    "characterContentStage";

  stage.className =
    "character-content-stage";

  parent.insertBefore(
    stage,
    overview
  );

  stage.appendChild(
    overview
  );

  stage.appendChild(
    detail
  );

  return stage;
}


// ==============================
// Timers
// ==============================

function addCharacterTransition(
  callback,
  delay
) {
  const timer =
    setTimeout(
      () => {
        callback();

        characterTransitionTimers =
          characterTransitionTimers.filter(
            (item) =>
              item !== timer
          );
      },
      delay
    );

  characterTransitionTimers.push(
    timer
  );
}

function clearCharacterTransitions() {
  characterTransitionTimers.forEach(
    (timer) => {
      clearTimeout(
        timer
      );
    }
  );

  characterTransitionTimers = [];

  cancelCharacterHeightAnimation();
  cancelHorizontalAnimation();
}


// ==============================
// Globals
// ==============================

window.openCharacterView =
  openCharacterView;

window.closeCharacterView =
  closeCharacterView;