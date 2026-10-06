const CHRONICLE_MANAGEMENT_STYLESHEET_ID =
  "chronicleManagementStylesheet";

const CHRONICLE_MANAGEMENT_STYLESHEET_HREF =
  "/src/css/chronicleManagement.css";


let stylesheetPromise =
  null;


function wait(
  milliseconds
) {
  return new Promise(
    (resolve) => {
      window.setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


function forceReflow(
  element
) {
  if (!element) {
    return;
  }


  void element.offsetHeight;
}


function waitForTransitionEnd(
  element,
  fallbackMs = 220
) {
  return new Promise(
    (resolve) => {
      if (!element) {
        resolve();

        return;
      }


      let resolved =
        false;


      const finish = () => {
        if (resolved) {
          return;
        }


        resolved =
          true;


        element.removeEventListener(
          "transitionend",
          onTransitionEnd
        );


        resolve();
      };


      const onTransitionEnd =
        (event) => {
          if (
            event.target !==
            element
          ) {
            return;
          }


          finish();
        };


      element.addEventListener(
        "transitionend",
        onTransitionEnd
      );


      window.setTimeout(
        finish,
        fallbackMs
      );
    }
  );
}


export function ensureChronicleManagementStyles() {
  if (
    stylesheetPromise
  ) {
    return stylesheetPromise;
  }


  const existing =
    document.getElementById(
      CHRONICLE_MANAGEMENT_STYLESHEET_ID
    );


  if (existing) {
    stylesheetPromise =
      Promise.resolve();

    return stylesheetPromise;
  }


  stylesheetPromise =
    new Promise(
      (
        resolve,
        reject
      ) => {
        const link =
          document.createElement(
            "link"
          );


        link.id =
          CHRONICLE_MANAGEMENT_STYLESHEET_ID;

        link.rel =
          "stylesheet";

        link.href =
          CHRONICLE_MANAGEMENT_STYLESHEET_HREF;


        link.addEventListener(
          "load",
          () => {
            resolve();
          },
          {
            once:
              true,
          }
        );


        link.addEventListener(
          "error",
          () => {
            reject(
              new Error(
                "Não foi possível carregar o estilo do gerenciamento da Crônica."
              )
            );
          },
          {
            once:
              true,
          }
        );


        document.head.appendChild(
          link
        );
      }
    );


  return stylesheetPromise;
}


export async function prepareChronicleManagementPanel(
  panel
) {
  await ensureChronicleManagementStyles();


  if (!panel) {
    return;
  }


  panel.classList.add(
    "chronicle-management-panel"
  );
}


export async function animateOpenChronicleManagement(
  panels,
  managementPanel
) {
  await ensureChronicleManagementStyles();


  if (
    !managementPanel
  ) {
    return;
  }


  managementPanel.classList.add(
    "chronicle-management-panel"
  );


  managementPanel.classList.remove(
    "d-none",
    "chronicle-management-panel-visible",
    "chronicle-management-panel-hiding"
  );


  if (panels) {
    panels.classList.remove(
      "chronicle-dashboard-panels-hidden",
      "chronicle-dashboard-panels-showing"
    );

    panels.classList.add(
      "chronicle-dashboard-panels-hiding"
    );

    forceReflow(
      panels
    );

    await waitForTransitionEnd(
      panels,
      180
    );

    panels.classList.remove(
      "chronicle-dashboard-panels-hiding"
    );

    panels.classList.add(
      "chronicle-dashboard-panels-hidden"
    );
  }


  managementPanel.classList.remove(
    "chronicle-management-panel-hiding"
  );

  forceReflow(
    managementPanel
  );

  await wait(
    10
  );

  managementPanel.classList.add(
    "chronicle-management-panel-visible"
  );

  await waitForTransitionEnd(
    managementPanel,
    260
  );
}


export async function animateCloseChronicleManagement(
  panels,
  managementPanel
) {
  await ensureChronicleManagementStyles();


  if (
    !managementPanel
  ) {
    return;
  }


  managementPanel.classList.remove(
    "chronicle-management-panel-visible"
  );

  managementPanel.classList.add(
    "chronicle-management-panel-hiding"
  );

  await waitForTransitionEnd(
    managementPanel,
    180
  );


  managementPanel.classList.add(
    "d-none"
  );

  managementPanel.classList.remove(
    "chronicle-management-panel-hiding"
  );


  if (panels) {
    panels.classList.remove(
      "chronicle-dashboard-panels-hidden",
      "chronicle-dashboard-panels-hiding"
    );

    panels.classList.add(
      "chronicle-dashboard-panels-showing"
    );

    forceReflow(
      panels
    );

    await waitForTransitionEnd(
      panels,
      180
    );

    panels.classList.remove(
      "chronicle-dashboard-panels-showing"
    );
  }
}