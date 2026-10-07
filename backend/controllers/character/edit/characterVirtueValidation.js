const {
  VIRTUE_MAX,
  getActiveVirtueKeys,
  getVirtueMinimumValue,
} = require(
  "../../../data/vampire/virtues"
);


function getCurrentVirtueValues(
  character
) {
  return {
    conscience:
      Number.isFinite(
        character.virtues
          ?.conscience
      )
        ? character.virtues
            .conscience
        : null,

    conviction:
      Number.isFinite(
        character.virtues
          ?.conviction
      )
        ? character.virtues
            .conviction
        : null,

    selfControl:
      Number.isFinite(
        character.virtues
          ?.selfControl
      )
        ? character.virtues
            .selfControl
        : null,

    instinct:
      Number.isFinite(
        character.virtues
          ?.instinct
      )
        ? character.virtues
            .instinct
        : null,

    courage:
      Number.isFinite(
        character.virtues
          ?.courage
      )
        ? character.virtues
            .courage
        : null,
  };
}


function validateSubmittedVirtues(
  moralityPath,
  submittedVirtues,
  currentVirtues
) {
  const activeKeys =
    getActiveVirtueKeys(
      moralityPath
    );


  if (
    activeKeys.length ===
    0
  ) {
    return {
      ok:
        false,

      error:
        "Não foi possível identificar as Virtudes ativas do personagem.",
    };
  }


  const submittedKeys =
    Object.keys(
      submittedVirtues
    );


  if (
    submittedKeys.some(
      (
        key
      ) =>
        !activeKeys.includes(
          key
        )
    )
  ) {
    return {
      ok:
        false,

      error:
        "Foi enviada uma Virtude que não está ativa para a Trilha do personagem.",
    };
  }


  if (
    activeKeys.some(
      (
        key
      ) =>
        !Object.prototype
          .hasOwnProperty
          .call(
            submittedVirtues,
            key
          )
    )
  ) {
    return {
      ok:
        false,

      error:
        "Envie todas as Virtudes ativas antes de salvar.",
    };
  }


  const proposedVirtues = {
    ...currentVirtues,
  };


  for (
    const virtueKey
    of activeKeys
  ) {
    const value =
      Number(
        submittedVirtues[
          virtueKey
        ]
      );


    if (
      !Number.isInteger(
        value
      )
    ) {
      return {
        ok:
          false,

        error:
          "Os valores das Virtudes devem ser números inteiros.",
      };
    }


    const minimum =
      getVirtueMinimumValue(
        moralityPath,
        virtueKey
      );


    if (
      value <
      minimum
    ) {
      return {
        ok:
          false,

        error:
          `A Virtude não pode ficar abaixo de ${minimum}.`,
      };
    }


    if (
      value >
      VIRTUE_MAX
    ) {
      return {
        ok:
          false,

        error:
          `Uma Virtude não pode ultrapassar ${VIRTUE_MAX}.`,
      };
    }


    proposedVirtues[
      virtueKey
    ] =
      value;
  }


  return {
    ok:
      true,

    proposedVirtues,
  };
}


module.exports = {
  getCurrentVirtueValues,
  validateSubmittedVirtues,
};
