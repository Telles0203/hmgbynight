const {
  CHARACTER_SHEET_LIFECYCLES,
  normalizeCharacterSheetLifecycle,
} = require(
  "../../data/characterSheetLifecycle"
);


const CHRONICLE_STATES = {
  none: {
    key:
      "none",

    label:
      "SEM CRÔNICA",

    description:
      "Este personagem ainda não está vinculado a uma Crônica.",
  },

  pending: {
    key:
      "pending",

    label:
      "VÍNCULO PENDENTE",

    description:
      "Este personagem solicitou vínculo com uma Crônica e aguarda aprovação.",
  },

  linked: {
    key:
      "linked",

    label:
      "CRÔNICA VINCULADA",

    description:
      "Este personagem já está vinculado a uma Crônica.",
  },
};


const SHEET_STATES = {
  [
    CHARACTER_SHEET_LIFECYCLES
      .INITIAL_DISTRIBUTION_PENDING
  ]: {
    key:
      CHARACTER_SHEET_LIFECYCLES
        .INITIAL_DISTRIBUTION_PENDING,

    label:
      "PONTOS DE ATENÇÃO",

    description:
      "Ficha aguardando distribuição inicial de pontos. A criação inicial deste personagem ainda não foi concluída. Os pontos e campos obrigatórios da ficha ainda precisam ser finalizados.",
  },

  [
    CHARACTER_SHEET_LIFECYCLES
      .INITIAL_REVIEW_PENDING
  ]: {
    key:
      CHARACTER_SHEET_LIFECYCLES
        .INITIAL_REVIEW_PENDING,

    label:
      "FICHA INICIAL AGUARDANDO APROVAÇÃO DA CRÔNICA",

    description:
      "A distribuição inicial foi enviada para a Crônica e aguarda análise da Narração.",
  },

  [
    CHARACTER_SHEET_LIFECYCLES
      .ACTIVE
  ]: {
    key:
      CHARACTER_SHEET_LIFECYCLES
        .ACTIVE,

    label:
      "FICHA ATIVA",

    description:
      "A criação inicial deste personagem foi concluída.",
  },
};


function getChronicleLinkStatus(
  character
) {
  if (
    character?.motherHouse
  ) {
    return {
      ...CHRONICLE_STATES
        .linked,
    };
  }


  if (
    character
      ?.pendingMotherHouse
  ) {
    return {
      ...CHRONICLE_STATES
        .pending,
    };
  }


  return {
    ...CHRONICLE_STATES
      .none,
  };
}


function getCharacterSheetStatus(
  character
) {
  const lifecycle =
    normalizeCharacterSheetLifecycle(
      character?.sheetLifecycle
    );


  return {
    ...SHEET_STATES[
      lifecycle
    ],
  };
}


function getCharacterLifecycleStatus(
  character
) {
  return getChronicleLinkStatus(
    character
  );
}


function canEditCharacterSheet(
  character
) {
  const lifecycle =
    normalizeCharacterSheetLifecycle(
      character?.sheetLifecycle
    );


  return (
    lifecycle ===
    CHARACTER_SHEET_LIFECYCLES
      .INITIAL_DISTRIBUTION_PENDING
  );
}


function canDirectlyEditCharacter(
  character
) {
  return (
    canEditCharacterSheet(
      character
    ) &&
    !character?.motherHouse
  );
}


function requiresChronicleApproval(
  character
) {
  return (
    canEditCharacterSheet(
      character
    ) &&
    Boolean(
      character?.motherHouse
    )
  );
}


function getEditMode(
  character
) {
  if (
    canDirectlyEditCharacter(
      character
    )
  ) {
    return "direct";
  }


  if (
    requiresChronicleApproval(
      character
    )
  ) {
    return "approval_draft";
  }


  return "locked";
}


function getEditReason(
  character
) {
  const lifecycle =
    normalizeCharacterSheetLifecycle(
      character?.sheetLifecycle
    );


  if (
    lifecycle ===
    CHARACTER_SHEET_LIFECYCLES
      .INITIAL_REVIEW_PENDING
  ) {
    return "initial_review_pending";
  }


  if (
    lifecycle ===
    CHARACTER_SHEET_LIFECYCLES
      .ACTIVE
  ) {
    return "sheet_active";
  }


  if (
    character?.motherHouse
  ) {
    return "chronicle_approval_required";
  }


  if (
    character
      ?.pendingMotherHouse
  ) {
    return "pending_chronicle_link";
  }


  return "initial_distribution";
}


function serializeCharacterState(
  character
) {
  const sheetLifecycle =
    normalizeCharacterSheetLifecycle(
      character?.sheetLifecycle
    );


  const sheetStatus =
    getCharacterSheetStatus(
      character
    );


  const chronicleStatus =
    getChronicleLinkStatus(
      character
    );


  const canEdit =
    canEditCharacterSheet(
      character
    );


  const directEdit =
    canDirectlyEditCharacter(
      character
    );


  const approvalRequired =
    requiresChronicleApproval(
      character
    );


  return {
    sheetLifecycle,

    sheetStatus,

    chronicleStatus,

    status:
      chronicleStatus,

    editState: {
      canEdit,

      directEdit,

      requiresChronicleApproval:
        approvalRequired,

      mode:
        getEditMode(
          character
        ),

      reason:
        getEditReason(
          character
        ),

      fields: {
        title:
          canEdit,

        clan:
          canEdit,

        concept:
          canEdit,

        nature:
          canEdit,

        demeanor:
          canEdit,

        virtues:
          canEdit,

        chronicle:
          canEdit &&
          !character?.motherHouse,
      },
    },
  };
}


module.exports = {
  getChronicleLinkStatus,
  getCharacterSheetStatus,
  getCharacterLifecycleStatus,
  canEditCharacterSheet,
  canDirectlyEditCharacter,
  requiresChronicleApproval,
  serializeCharacterState,
};