import {
  renderChronicleError,
  renderChronicleLoading,
  renderChronicleManagement,
  setActiveChronicleTab,
  showChronicleManagementAlert,
} from "./chronicleManagementView.js";

import {
  animateCloseChronicleManagement,
  animateOpenChronicleManagement,
  prepareChronicleManagementPanel,
} from "./chronicleManagementAnimations.js";


let currentChronicleId =
  null;

let currentChronicleData =
  null;

let activeTab =
  "overview";


function getDashboardPanels() {
  return document.querySelector(
    "#mainDashboard .main-dashboard-panels"
  );
}


function ensureChronicleManagementPanel() {
  let panel =
    document.getElementById(
      "chronicleManagementPanel"
    );


  if (panel) {
    return panel;
  }


  const dashboard =
    document.getElementById(
      "mainDashboard"
    );


  if (!dashboard) {
    return null;
  }


  panel =
    document.createElement(
      "section"
    );


  panel.id =
    "chronicleManagementPanel";

  panel.className =
    "d-none";


  panel.addEventListener(
    "click",
    handleChronicleManagementClick
  );

  panel.addEventListener(
    "submit",
    handleChronicleManagementSubmit
  );


  dashboard.appendChild(
    panel
  );


  return panel;
}


async function requestJson(
  url,
  options = {}
) {
  const response =
    await fetch(
      url,
      options
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
        "A operação não pôde ser concluída."
    );
  }


  return data;
}


async function loadChronicleManagement() {
  const panel =
    ensureChronicleManagementPanel();


  if (
    !panel ||
    !currentChronicleId
  ) {
    return;
  }


  renderChronicleLoading(
    panel
  );


  try {
    const data =
      await requestJson(
        `/api/houses/${encodeURIComponent(
          currentChronicleId
        )}/management`,
        {
          method:
            "GET",

          credentials:
            "include",

          cache:
            "no-store",
        }
      );


    currentChronicleData =
      data;


    renderChronicleManagement(
      panel,
      data
    );


    setActiveChronicleTab(
      panel,
      activeTab
    );

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao abrir gerenciamento:",
      error
    );


    renderChronicleError(
      panel,
      error.message ||
        "Não foi possível abrir a Crônica."
    );
  }
}


export async function openChronicleManagement(
  chronicleId
) {
  const cleanId =
    String(
      chronicleId ||
      ""
    ).trim();


  if (!cleanId) {
    return;
  }


  currentChronicleId =
    cleanId;

  currentChronicleData =
    null;

  activeTab =
    "overview";


  const panels =
    getDashboardPanels();

  const managementPanel =
    ensureChronicleManagementPanel();


  if (!managementPanel) {
    return;
  }


  await prepareChronicleManagementPanel(
    managementPanel
  );


  renderChronicleLoading(
    managementPanel
  );


  await animateOpenChronicleManagement(
    panels,
    managementPanel
  );


  await loadChronicleManagement();
}


async function closeChronicleManagement() {
  const panels =
    getDashboardPanels();

  const managementPanel =
    document.getElementById(
      "chronicleManagementPanel"
    );


  await animateCloseChronicleManagement(
    panels,
    managementPanel
  );


  currentChronicleId =
    null;

  currentChronicleData =
    null;

  activeTab =
    "overview";
}


async function refreshRelatedPanels() {
  await Promise.all([
    window.loadHouses?.(),
    window.loadCharacters?.(),
  ]);
}


async function runButtonAction(
  button,
  loadingText,
  action
) {
  const originalText =
    button?.textContent ||
    "";


  try {
    if (button) {
      button.disabled =
        true;

      button.textContent =
        loadingText;
    }


    await action();

  } finally {
    if (
      button &&
      button.isConnected
    ) {
      button.disabled =
        false;

      button.textContent =
        originalText;
    }
  }
}


async function approveCharacter(
  characterId,
  button
) {
  await runButtonAction(
    button,
    "Aprovando...",
    async () => {
      await requestJson(
        `/api/houses/${encodeURIComponent(
          currentChronicleId
        )}/characters/${encodeURIComponent(
          characterId
        )}/approve`,
        {
          method:
            "POST",

          credentials:
            "include",
        }
      );


      activeTab =
        "requests";


      await refreshRelatedPanels();

      await loadChronicleManagement();
    }
  );
}


async function rejectCharacter(
  characterId,
  button
) {
  const confirmed =
    window.confirm(
      "Rejeitar esta solicitação de vínculo?"
    );


  if (!confirmed) {
    return;
  }


  await runButtonAction(
    button,
    "Rejeitando...",
    async () => {
      await requestJson(
        `/api/houses/${encodeURIComponent(
          currentChronicleId
        )}/characters/${encodeURIComponent(
          characterId
        )}/reject`,
        {
          method:
            "POST",

          credentials:
            "include",
        }
      );


      activeTab =
        "requests";


      await refreshRelatedPanels();

      await loadChronicleManagement();
    }
  );
}


async function saveMemberRole(
  memberId,
  button
) {
  const card =
    button.closest(
      "[data-chronicle-member-id]"
    );


  const select =
    card?.querySelector(
      ".chronicle-member-role"
    );


  const role =
    String(
      select?.value ||
      ""
    ).trim();


  if (!role) {
    return;
  }


  await runButtonAction(
    button,
    "Salvando...",
    async () => {
      await requestJson(
        `/api/houses/${encodeURIComponent(
          currentChronicleId
        )}/members/${encodeURIComponent(
          memberId
        )}/role`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              role,
            }),
        }
      );


      activeTab =
        "people";


      await loadChronicleManagement();
    }
  );
}


async function handleChronicleManagementClick(
  event
) {
  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (!target) {
    return;
  }


  const panel =
    event.currentTarget;


  if (
    target.closest(
      ".chronicle-back-button"
    )
  ) {
    await closeChronicleManagement();

    return;
  }


  if (
    target.closest(
      ".chronicle-refresh-button"
    )
  ) {
    await loadChronicleManagement();

    return;
  }


  const tabButton =
    target.closest(
      ".chronicle-tab-button"
    );


  if (tabButton) {
    activeTab =
      tabButton.dataset
        .chronicleTab ||
      "overview";


    setActiveChronicleTab(
      panel,
      activeTab
    );


    return;
  }


  const approveButton =
    target.closest(
      ".chronicle-approve-character"
    );


  if (approveButton) {
    const characterId =
      approveButton.dataset
        .characterId;


    try {
      await approveCharacter(
        characterId,
        approveButton
      );

    } catch (error) {
      console.error(
        "[CHRONICLE] Erro ao aprovar personagem:",
        error
      );


      showChronicleManagementAlert(
        panel,
        error.message
      );
    }


    return;
  }


  const rejectButton =
    target.closest(
      ".chronicle-reject-character"
    );


  if (rejectButton) {
    const characterId =
      rejectButton.dataset
        .characterId;


    try {
      await rejectCharacter(
        characterId,
        rejectButton
      );

    } catch (error) {
      console.error(
        "[CHRONICLE] Erro ao rejeitar personagem:",
        error
      );


      showChronicleManagementAlert(
        panel,
        error.message
      );
    }


    return;
  }


  const roleButton =
    target.closest(
      ".chronicle-save-member-role"
    );


  if (roleButton) {
    const memberId =
      roleButton.dataset
        .memberId;


    try {
      await saveMemberRole(
        memberId,
        roleButton
      );

    } catch (error) {
      console.error(
        "[CHRONICLE] Erro ao alterar membro:",
        error
      );


      showChronicleManagementAlert(
        panel,
        error.message
      );
    }
  }
}


async function handleChronicleManagementSubmit(
  event
) {
  if (
    !(
      event.target instanceof
      HTMLFormElement
    ) ||
    event.target.id !==
      "chronicleSettingsForm"
  ) {
    return;
  }


  event.preventDefault();


  const panel =
    event.currentTarget;

  const input =
    event.target.querySelector(
      "#chronicleSettingsName"
    );

  const button =
    event.target.querySelector(
      ".chronicle-save-settings"
    );


  const name =
    String(
      input?.value ||
      ""
    ).trim();


  if (
    name.length < 2 ||
    name.length > 80
  ) {
    showChronicleManagementAlert(
      panel,
      "O nome da Crônica deve possuir entre 2 e 80 caracteres."
    );

    return;
  }


  try {
    await runButtonAction(
      button,
      "Salvando...",
      async () => {
        await requestJson(
          `/api/houses/${encodeURIComponent(
            currentChronicleId
          )}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body:
              JSON.stringify({
                name,
              }),
          }
        );


        activeTab =
          "settings";


        await refreshRelatedPanels();

        await loadChronicleManagement();
      }
    );

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao salvar configurações:",
      error
    );


    showChronicleManagementAlert(
      panel,
      error.message
    );
  }
}