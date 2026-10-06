const CHARACTER_STATES = {
  building: {
    key:
      "building",

    label:
      "EM CONSTRUÇÃO INICIAL",

    description:
      "Este personagem ainda está sendo montado. Enquanto não for aprovado por uma Crônica, sua ficha pode ser alterada livremente utilizando os pontos de criação inicial.",
  },

  pending: {
    key:
      "pending",

    label:
      "VÍNCULO PENDENTE",

    description:
      "Este personagem solicitou vínculo com uma Crônica, mas ainda não foi aprovado. Enquanto aguarda a aprovação, sua ficha continua editável.",
  },

  approved: {
    key:
      "approved",

    label:
      "APROVADO",

    description:
      "Este personagem foi aprovado pela Crônica. Alterações que afetam a ficha não podem mais ser feitas diretamente pelo jogador.",
  },
};


function getCharacterLifecycleStatus(
  character
) {
  if (
    character?.motherHouse
  ) {
    return {
      ...CHARACTER_STATES
        .approved,
    };
  }


  if (
    character
      ?.pendingMotherHouse
  ) {
    return {
      ...CHARACTER_STATES
        .pending,
    };
  }


  return {
    ...CHARACTER_STATES
      .building,
  };
}


function canDirectlyEditCharacter(
  character
) {
  return !Boolean(
    character?.motherHouse
  );
}


function serializeCharacterState(
  character
) {
  const status =
    getCharacterLifecycleStatus(
      character
    );


  const directEdit =
    canDirectlyEditCharacter(
      character
    );


  return {
    status,

    editState: {
      directEdit,

      requiresChronicleApproval:
        !directEdit,

      reason:
        status.key ===
          "approved"
          ? "chronicle_approval_required"
          : status.key ===
              "pending"
            ? "pending_chronicle_link"
            : "initial_creation",

      fields: {
        title:
          directEdit,

        clan:
          directEdit,

        concept:
          directEdit,

        nature:
          directEdit,

        demeanor:
          directEdit,

        virtues:
          directEdit,

        chronicle:
          directEdit,
      },
    },
  };
}


module.exports = {
  getCharacterLifecycleStatus,
  canDirectlyEditCharacter,
  serializeCharacterState,
};