const verticalMetrics =
  new WeakMap();


export async function collapseElements(
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


  element.classList.remove(
    "character-view-collapsed",
    "character-view-expanding"
  );


  element.classList.add(
    "character-view-collapsing"
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
            "translateY(0)",
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


  await animation.finished;


  element.classList.add(
    "character-view-collapsed"
  );


  element.classList.remove(
    "character-view-collapsing"
  );


  animation.cancel();
}


export async function expandElements(
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


  element.classList.remove(
    "character-view-collapsing"
  );


  element.classList.add(
    "character-view-expanding"
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


  element.classList.remove(
    "character-view-collapsed",
    "character-view-expanding"
  );


  animation.cancel();


  verticalMetrics.delete(
    element
  );
}
