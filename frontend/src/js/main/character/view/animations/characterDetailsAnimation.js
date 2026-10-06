import {
  easeInOutSine,
} from "./characterAnimationMath.js";


let characterDetailsAnimation =
  null;


export async function animateCharacterDetails(
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
      createCharacterDetailsKeyframes({
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


  characterDetailsAnimation =
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
    characterDetailsAnimation !==
    animation
  ) {
    return;
  }


  characterDetailsAnimation =
    null;


  if (!opening) {
    card.classList.remove(
      "is-open",
      "is-closing"
    );
  }


  animation.cancel();
}


function createCharacterDetailsKeyframes({
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


function cancelCharacterDetailsAnimation() {
  if (!characterDetailsAnimation) {
    return;
  }


  characterDetailsAnimation.cancel();


  characterDetailsAnimation =
    null;
}
