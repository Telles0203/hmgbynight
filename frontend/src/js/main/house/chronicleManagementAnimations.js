let panelAnimations =
  [];

let chronicleDetailsAnimation =
  null;


const verticalMetrics =
  new WeakMap();


const MOTION_DURATION =
  1000;


export function getChronicleMotionDuration() {
  return MOTION_DURATION;
}


export async function animateChronicleDetails(
  card,
  opening,
  duration = MOTION_DURATION
) {
  cancelChronicleDetailsAnimation();


  const details =
    card?.querySelector(
      ".chronicle-card-details"
    );


  if (!details) {
    return;
  }


  let startHeight;
  let targetHeight;


  if (opening) {
    card.classList.remove(
      "is-closing"
    );


    startHeight =
      0;


    card.classList.add(
      "is-open"
    );


    targetHeight =
      details.scrollHeight;

  } else {
    startHeight =
      details
        .getBoundingClientRect()
        .height;


    targetHeight =
      0;


    card.classList.add(
      "is-closing"
    );
  }


  const animation =
    details.animate(
      createDetailsKeyframes({
        startHeight,
        targetHeight,
        opening,
      }),
      {
        duration,

        easing:
          "linear",

        fill:
          "both",
      }
    );


  chronicleDetailsAnimation =
    animation;


  try {
    await animation.finished;

  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      throw error;
    }


    return;
  }


  if (
    chronicleDetailsAnimation !==
    animation
  ) {
    return;
  }


  chronicleDetailsAnimation =
    null;


  if (!opening) {
    card.classList.remove(
      "is-open",
      "is-closing"
    );
  }


  animation.cancel();
}


function createDetailsKeyframes({
  startHeight,
  targetHeight,
  opening,
}) {
  const steps =
    60;


  return Array.from(
    {
      length:
        steps + 1,
    },

    (
      _,
      index
    ) => {
      const progress =
        index /
        steps;


      const eased =
        easeInOutSine(
          progress
        );


      const height =
        startHeight +
        (
          targetHeight -
          startHeight
        ) *
        eased;


      return {
        offset:
          progress,

        height:
          `${Math.max(
            0,
            height
          )}px`,

        opacity:
          opening
            ? eased
            : 1 - eased,
      };
    }
  );
}


export async function collapseChronicleElements(
  elements,
  duration = MOTION_DURATION
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


  element.classList.remove(
    "chronicle-view-collapsed",
    "chronicle-view-expanding"
  );


  element.classList.add(
    "chronicle-view-collapsing"
  );


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
            "translateY(0px)",
        },

        {
          height:
            "0px",

          marginTop:
            "0px",

          marginBottom:
            "0px",

          paddingTop:
            "0px",

          paddingBottom:
            "0px",

          borderTopWidth:
            "0px",

          borderBottomWidth:
            "0px",

          opacity:
            0,

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


  try {
    await animation.finished;

  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      throw error;
    }


    return;
  }


  element.classList.add(
    "chronicle-view-collapsed"
  );


  element.classList.remove(
    "chronicle-view-collapsing"
  );


  animation.cancel();
}


export async function expandChronicleElements(
  elements,
  duration = MOTION_DURATION
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
    element.classList.remove(
      "chronicle-view-collapsed",
      "chronicle-view-expanding",
      "chronicle-view-collapsing"
    );


    return;
  }


  element.classList.remove(
    "chronicle-view-collapsing"
  );


  element.classList.add(
    "chronicle-view-expanding"
  );


  const animation =
    element.animate(
      [
        {
          height:
            "0px",

          marginTop:
            "0px",

          marginBottom:
            "0px",

          paddingTop:
            "0px",

          paddingBottom:
            "0px",

          borderTopWidth:
            "0px",

          borderBottomWidth:
            "0px",

          opacity:
            0,

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
            "translateY(0px)",
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


  try {
    await animation.finished;

  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      throw error;
    }


    return;
  }


  element.classList.remove(
    "chronicle-view-collapsed",
    "chronicle-view-expanding"
  );


  animation.cancel();


  verticalMetrics.delete(
    element
  );
}


export async function animateChroniclePanels({
  dashboard,
  panelsContainer,
  characterPanel,
  housePanel,
  opening,
  duration = MOTION_DURATION,
}) {
  cancelPanelAnimations();


  const mobile =
    window.matchMedia(
      "(max-width: 991.98px)"
    ).matches;


  if (mobile) {
    await animateMobilePanels({
      dashboard,
      characterPanel,
      opening,
      duration,
    });


    return;
  }


  await animateDesktopPanels({
    dashboard,
    panelsContainer,
    characterPanel,
    housePanel,
    opening,
    duration,
  });
}


async function animateMobilePanels({
  dashboard,
  characterPanel,
  opening,
  duration,
}) {
  if (opening) {
    await collapseChronicleElements(
      [
        characterPanel,
      ],
      duration
    );


    dashboard.classList.add(
      "chronicle-focus"
    );


    return;
  }


  dashboard.classList.remove(
    "chronicle-focus"
  );


  await expandChronicleElements(
    [
      characterPanel,
    ],
    duration
  );
}


async function animateDesktopPanels({
  dashboard,
  panelsContainer,
  characterPanel,
  housePanel,
  opening,
  duration,
}) {
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


  const normalWidth =
    (
      containerWidth -
      gap
    ) / 2;


  const houseOffset =
    normalWidth +
    gap;


  if (!opening) {
    dashboard.classList.remove(
      "chronicle-focus"
    );
  }


  const characterAnimation =
    characterPanel.animate(
      createHorizontalKeyframes({
        startX:
          opening
            ? 0
            : -115,

        endX:
          opening
            ? -115
            : 0,

        startOpacity:
          opening
            ? 1
            : 0,

        endOpacity:
          opening
            ? 0
            : 1,

        unit:
          "%",
      }),
      {
        duration,

        easing:
          "linear",

        fill:
          "both",
      }
    );


  const houseAnimation =
    housePanel.animate(
      createHousePanelKeyframes({
        startWidth:
          opening
            ? normalWidth
            : containerWidth,

        endWidth:
          opening
            ? containerWidth
            : normalWidth,

        startX:
          opening
            ? 0
            : -houseOffset,

        endX:
          opening
            ? -houseOffset
            : 0,
      }),
      {
        duration,

        easing:
          "linear",

        fill:
          "both",
      }
    );


  panelAnimations = [
    characterAnimation,
    houseAnimation,
  ];


  try {
    await Promise.all(
      panelAnimations.map(
        (animation) =>
          animation.finished
      )
    );

  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      throw error;
    }


    return;
  }


  if (opening) {
    dashboard.classList.add(
      "chronicle-focus"
    );
  }


  panelAnimations =
    [];


  characterAnimation.cancel();
  houseAnimation.cancel();
}


function createHorizontalKeyframes({
  startX,
  endX,
  startOpacity,
  endOpacity,
  unit,
}) {
  const steps =
    60;


  return Array.from(
    {
      length:
        steps + 1,
    },

    (
      _,
      index
    ) => {
      const progress =
        index /
        steps;


      const eased =
        easeInOutSine(
          progress
        );


      const x =
        startX +
        (
          endX -
          startX
        ) *
        eased;


      const opacity =
        startOpacity +
        (
          endOpacity -
          startOpacity
        ) *
        eased;


      return {
        offset:
          progress,

        transform:
          `translateX(${x}${unit})`,

        opacity,
      };
    }
  );
}


function createHousePanelKeyframes({
  startWidth,
  endWidth,
  startX,
  endX,
}) {
  const steps =
    60;


  return Array.from(
    {
      length:
        steps + 1,
    },

    (
      _,
      index
    ) => {
      const progress =
        index /
        steps;


      const eased =
        easeInOutSine(
          progress
        );


      const width =
        startWidth +
        (
          endWidth -
          startWidth
        ) *
        eased;


      const x =
        startX +
        (
          endX -
          startX
        ) *
        eased;


      return {
        offset:
          progress,

        width:
          `${width}px`,

        transform:
          `translateX(${x}px)`,
      };
    }
  );
}


function easeInOutSine(
  value
) {
  return -(
    Math.cos(
      Math.PI *
      value
    ) - 1
  ) / 2;
}


function cancelPanelAnimations() {
  if (
    panelAnimations.length ===
    0
  ) {
    return;
  }


  const animations =
    panelAnimations;


  panelAnimations =
    [];


  animations.forEach(
    (animation) => {
      animation.cancel();
    }
  );
}


function cancelChronicleDetailsAnimation() {
  if (!chronicleDetailsAnimation) {
    return;
  }


  chronicleDetailsAnimation.cancel();


  chronicleDetailsAnimation =
    null;
}