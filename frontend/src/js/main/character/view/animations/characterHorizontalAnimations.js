import {
  easeInOutSine,
} from "./characterAnimationMath.js";


let horizontalAnimations =
  [];


export async function animateHorizontalPanels({
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


  const keyframes =
    createHorizontalKeyframes({
      startWidth,
      targetWidth,
      startHouseOffset,
      targetHouseOffset,
      startHouseOpacity,
      targetHouseOpacity,
    });


  const characterAnimation =
    characterPanel.animate(
      keyframes.character,
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
      keyframes.house,
      {
        duration,

        easing:
          "linear",

        fill:
          "both",
      }
    );


  horizontalAnimations = [
    characterAnimation,
    houseAnimation,
  ];


  try {
    await Promise.all(
      horizontalAnimations.map(
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


  if (
    horizontalAnimations[0] !==
      characterAnimation ||
    horizontalAnimations[1] !==
      houseAnimation
  ) {
    return;
  }


  if (opening) {
    panelsContainer.classList.add(
      "character-horizontal-open"
    );

  } else {
    panelsContainer.classList.remove(
      "character-horizontal-open"
    );
  }


  horizontalAnimations =
    [];


  characterAnimation.cancel();
  houseAnimation.cancel();
}


function createHorizontalKeyframes({
  startWidth,
  targetWidth,
  startHouseOffset,
  targetHouseOffset,
  startHouseOpacity,
  targetHouseOpacity,
}) {
  const steps =
    60;


  const character =
    [];


  const house =
    [];


  for (
    let index = 0;
    index <= steps;
    index += 1
  ) {
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


    character.push({
      offset:
        progress,

      width:
        `${width}px`,
    });


    house.push({
      offset:
        progress,

      transform:
        `translateX(${houseOffset}%)`,

      opacity:
        houseOpacity,
    });
  }


  return {
    character,
    house,
  };
}


function cancelHorizontalAnimation() {
  if (
    horizontalAnimations.length ===
    0
  ) {
    return;
  }


  const animations =
    horizontalAnimations;


  horizontalAnimations =
    [];


  animations.forEach(
    (animation) => {
      animation.cancel();
    }
  );
}
