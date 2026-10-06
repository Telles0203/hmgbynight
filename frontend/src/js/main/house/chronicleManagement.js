import {
  renderChronicleError,
  renderChronicleLoading,
  renderChronicleManagement,
  setActiveChronicleTab,
  showChronicleManagementAlert,
} from "./chronicleManagementView.js";

import {
  animateChronicleDetails,
  animateChroniclePanels,
  collapseChronicleElements,
  expandChronicleElements,
  getChronicleMotionDuration,
} from "./chronicleManagementAnimations.js";


let currentChronicleId =
  null;

let currentChronicleData =
  null;

let activeTab =
  "overview";

let chronicleTransitioning =
  false;


function getChronicleViewElements(
  chronicleId
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
      `.chronicle-card[data-house-id="${CSS.escape(
        String(
          chronicleId
        )
      )}"]`
    );


  const allCards =
    Array.from(
      document.querySelectorAll(
        ".chronicle-card"
      )
    );


  const panelHeader =
    document.getElementById(
      "housePanelHeader"
    );


  const createArea =
    document.getElementById(
      "chronicleCreateArea"
    );


  const detailsContainer =
    selectedCard?.querySelector(
      ".chronicle-card-details-inner"
    );


  if (
    !dashboard ||
    !panelsContainer ||
    !characterPanel ||
    !housePanel ||
    !selectedCard ||
    !detailsContainer
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
    detailsContainer,
  };
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


export function toggleChronicleManagement(
  chronicleId
) {
  if (
    chronicleTransitioning
  ) {
    return;
  }


  if (
    String(
      currentChronicleId
    ) ===
    String(
      chronicleId
    )
  ) {
    closeChronicleManagement();

    return;
  }


  openChronicleManagement(
    chronicleId
  );
}


export async function openChronicleManagement(
  chronicleId
) {
  if (
    chronicleTransitioning
  ) {
    return;
  }


  const cleanId =
    String(
      chronicleId ||
      ""
    ).trim();


  if (!cleanId) {
    return;
  }


  const elements =
    getChronicleViewElements(
      cleanId
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
    detailsContainer,
  } =
    elements;


  chronicleTransitioning =
    true;


  currentChronicleId =
    cleanId;

  currentChronicleData =
    null;

  activeTab =
    "overview";


  try {
    selectedCard.classList.add(
      "is-selected"
    );


    const openButton =
      selectedCard.querySelector(
        ".chronicle-open-button"
      );


    if (openButton) {
      openButton.replaceChildren(
        document.createTextNode(
          "‹"
        )
      );


      openButton.setAttribute(
        "aria-label",
        "Voltar para minhas Crônicas"
      );


      openButton.setAttribute(
        "title",
        "Voltar para minhas Crônicas"
      );
    }


    bindManagementEvents(
      detailsContainer
    );


    renderChronicleLoading(
      detailsContainer
    );


    const elementsToCollapse = [
      ...allCards.filter(
        (card) =>
          card !==
          selectedCard
      ),

      panelHeader,
      createArea,
    ].filter(
      Boolean
    );


    await collapseChronicleElements(
      elementsToCollapse,
      getChronicleMotionDuration()
    );


    await animateChroniclePanels({
      dashboard,
      panelsContainer,
      characterPanel,
      housePanel,
      opening:
        true,

      duration:
        getChronicleMotionDuration(),
    });


    await animateChronicleDetails(
      selectedCard,
      true,
      getChronicleMotionDuration()
    );


    await loadChronicleManagement();

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao abrir Crônica:",
      error
    );


    renderChronicleError(
      detailsContainer,
      "Não foi possível abrir a Crônica."
    );

  } finally {
    chronicleTransitioning =
      false;
  }
}


export async function closeChronicleManagement() {
  if (
    chronicleTransitioning ||
    !currentChronicleId
  ) {
    return;
  }


  const elements =
    getChronicleViewElements(
      currentChronicleId
    );


  if (!elements) {
    currentChronicleId =
      null;

    currentChronicleData =
      null;

    activeTab =
      "overview";


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
    detailsContainer,
  } =
    elements;


  chronicleTransitioning =
    true;


  try {
    await animateChronicleDetails(
      selectedCard,
      false,
      getChronicleMotionDuration()
    );


    await animateChroniclePanels({
      dashboard,
      panelsContainer,
      characterPanel,
      housePanel,
      opening:
        false,

      duration:
        getChronicleMotionDuration(),
    });


    const elementsToExpand = [
      panelHeader,

      ...allCards.filter(
        (card) =>
          card !==
          selectedCard
      ),

      createArea,
    ].filter(
      Boolean
    );


    await expandChronicleElements(
      elementsToExpand,
      getChronicleMotionDuration()
    );


    selectedCard.classList.remove(
      "is-selected"
    );


    const openButton =
      selectedCard.querySelector(
        ".chronicle-open-button"
      );


    if (openButton) {
      openButton.replaceChildren(
        document.createTextNode(
          "›"
        )
      );


      openButton.setAttribute(
        "aria-label",
        "Abrir Crônica"
      );


      openButton.setAttribute(
        "title",
        "Abrir Crônica"
      );
    }


    detailsContainer.replaceChildren();


    currentChronicleId =
      null;

    currentChronicleData =
      null;

    activeTab =
      "overview";


    await window
      .loadHouses
      ?.();

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao fechar Crônica:",
      error
    );

  } finally {
    chronicleTransitioning =
      false;
  }
}


async function loadChronicleManagement() {
  if (!currentChronicleId) {
    return;
  }


  const elements =
    getChronicleViewElements(
      currentChronicleId
    );


  if (!elements) {
    return;
  }


  const {
    detailsContainer,
  } =
    elements;


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
      detailsContainer,
      data
    );


    setActiveChronicleTab(
      detailsContainer,
      activeTab
    );


    updateSelectedChronicleHeader(
      data.chronicle
    );

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao carregar gerenciamento:",
      error
    );


    renderChronicleError(
      detailsContainer,
      error.message ||
        "Não foi possível carregar a Crônica."
    );
  }
}


function updateSelectedChronicleHeader(
  chronicle
) {
  if (
    !currentChronicleId ||
    !chronicle
  ) {
    return;
  }


  const card =
    document.querySelector(
      `.chronicle-card[data-house-id="${CSS.escape(
        String(
          currentChronicleId
        )
      )}"]`
    );


  const nameElement =
    card?.querySelector(
      ".chronicle-card-name"
    );


  if (nameElement) {
    nameElement.textContent =
      chronicle.name ||
      "";
  }
}


function bindManagementEvents(
  container
) {
  if (
    container.dataset
      .chronicleManagementBound ===
    "true"
  ) {
    return;
  }


  container.dataset
    .chronicleManagementBound =
    "true";


  container.addEventListener(
    "click",
    handleChronicleManagementClick
  );


  container.addEventListener(
    "submit",
    handleChronicleManagementSubmit
  );
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


      await window
        .loadCharacters
        ?.();


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


      await window
        .loadCharacters
        ?.();


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


  const container =
    event.currentTarget;


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
      container,
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
        container,
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
        container,
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
        container,
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


  const container =
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
      container,
      "O nome da Crônica deve possuir entre 2 e 80 caracteres."
    );


    return;
  }


  try {
    await runButtonAction(
      button,
      "Salvando...",
      async () => {
        const data =
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


        if (
          currentChronicleData
            ?.chronicle
        ) {
          currentChronicleData
            .chronicle
            .name =
            data.chronicle.name;
        }


        updateSelectedChronicleHeader(
          data.chronicle
        );


        activeTab =
          "settings";


        await loadChronicleManagement();
      }
    );

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao salvar configurações:",
      error
    );


    showChronicleManagementAlert(
      container,
      error.message
    );
  }
}