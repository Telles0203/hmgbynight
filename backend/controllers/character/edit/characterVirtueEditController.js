const mongoose = require(
  "mongoose"
);

const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../../data/vampire/moralityPaths"
);

const {
  VIRTUE_MAX,
  getActiveVirtueKeys,
  isActiveVirtueKey,
  getVirtueMinimumValue,
  getVirtueCreationProgress,
} = require(
  "../../../data/vampire/virtues"
);

const {
  serializeVirtues,
} = require(
  "../characterHelpers"
);

const {
  getEffectiveCharacterForEditing,
} = require(
  "../../../services/characterSheetDraftService"
);

const {
  findOwnedCharacterForEdit,
  persistCharacterChanges,
  respondCharacterEditFailure,
} = require(
  "./characterEditPersistence"
);

const {
  buildCharacterCreationAfterVirtueChange,
} = require(
  "./characterVirtueCreationSync"
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


async function getEditableCharacter(
  characterId,
  userId
) {
  return findOwnedCharacterForEdit(
    characterId,
    userId,
    [
      "moralityPath",
      "moralityRating",
      "virtues",
      "creation",
      "sect",
      "clan",
    ]
  );
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


  const virtuePoints =
    getVirtueCreationProgress(
      moralityPath,
      proposedVirtues
    );


  if (
    virtuePoints.spent >
    virtuePoints.total
  ) {
    return {
      ok:
        false,

      error:
        `Você possui apenas ${virtuePoints.total} pontos para distribuir entre as Virtudes.`,
    };
  }


  return {
    ok:
      true,

    proposedVirtues,
  };
}


async function updateCharacterVirtues(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const characterId =
      String(
        req.params?.characterId ||
        ""
      ).trim();


    const submittedVirtues =
      req.body?.virtues;


    if (
      !userId
    ) {
      return res
        .status(
          401
        )
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    if (
      !characterId ||
      !mongoose.isValidObjectId(
        characterId
      )
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Personagem inválido.",
        });
    }


    if (
      !submittedVirtues ||
      typeof submittedVirtues !==
        "object" ||
      Array.isArray(
        submittedVirtues
      )
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Informe as Virtudes do personagem.",
        });
    }


    const character =
      await getEditableCharacter(
        characterId,
        userId
      );


    if (
      !character
    ) {
      return res
        .status(
          404
        )
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    const effective =
      await getEffectiveCharacterForEditing(
        character
      );


    const moralityPath =
      String(
        effective.character
          .moralityPath ||
        DEFAULT_MORALITY_PATH
      );


    const validation =
      validateSubmittedVirtues(
        moralityPath,
        submittedVirtues,
        getCurrentVirtueValues(
          effective.character
        )
      );


    if (
      !validation.ok
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            validation.error,
        });
    }


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          virtues:
            validation
              .proposedVirtues,
        },
      });


    if (
      !persisted.ok
    ) {
      return respondCharacterEditFailure(
        res,
        persisted
      );
    }


    const serialized =
      serializeVirtues(
        moralityPath,
        validation
          .proposedVirtues
      );


    const creation =
      buildCharacterCreationAfterVirtueChange(
        effective.character,
        validation
          .proposedVirtues
      );


    return res.json({
      ok:
        true,

      savedAsDraft:
        persisted.mode ===
        "approval_draft",

      sheetDraft:
        persisted.sheetDraft,

      creation,

      character: {
        id:
          character._id,

        virtues:
          serialized.values,

        activeVirtues:
          serialized.active,

        virtuePoints:
          serialized.points,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao salvar Virtudes:",
      error
    );


    return res
      .status(
        500
      )
      .json({
        ok:
          false,

        error:
          "Não foi possível salvar as Virtudes.",
      });
  }
}


async function updateCharacterVirtue(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const characterId =
      String(
        req.params?.characterId ||
        ""
      ).trim();


    const virtueKey =
      String(
        req.params?.virtueKey ||
        ""
      ).trim();


    const value =
      Number(
        req.body?.value
      );


    if (
      !userId
    ) {
      return res
        .status(
          401
        )
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    if (
      !characterId ||
      !mongoose.isValidObjectId(
        characterId
      ) ||
      !Number.isInteger(
        value
      )
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Valor ou personagem inválido.",
        });
    }


    const character =
      await getEditableCharacter(
        characterId,
        userId
      );


    if (
      !character
    ) {
      return res
        .status(
          404
        )
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    const effective =
      await getEffectiveCharacterForEditing(
        character
      );


    const moralityPath =
      String(
        effective.character
          .moralityPath ||
        DEFAULT_MORALITY_PATH
      );


    if (
      !isActiveVirtueKey(
        moralityPath,
        virtueKey
      )
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Esta Virtude não está ativa para a Trilha de Moralidade do personagem.",
        });
    }


    const minimum =
      getVirtueMinimumValue(
        moralityPath,
        virtueKey
      );


    if (
      value <
        minimum ||
      value >
        VIRTUE_MAX
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            `A Virtude deve possuir um valor entre ${minimum} e ${VIRTUE_MAX}.`,
        });
    }


    const proposedVirtues = {
      ...getCurrentVirtueValues(
        effective.character
      ),

      [
        virtueKey
      ]:
        value,
    };


    const virtuePoints =
      getVirtueCreationProgress(
        moralityPath,
        proposedVirtues
      );


    if (
      virtuePoints.spent >
      virtuePoints.total
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Você já distribuiu todos os pontos disponíveis de Virtudes.",
        });
    }


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          virtues:
            proposedVirtues,
        },
      });


    if (
      !persisted.ok
    ) {
      return respondCharacterEditFailure(
        res,
        persisted
      );
    }


    const serialized =
      serializeVirtues(
        moralityPath,
        proposedVirtues
      );


    const creation =
      buildCharacterCreationAfterVirtueChange(
        effective.character,
        proposedVirtues
      );


    return res.json({
      ok:
        true,

      savedAsDraft:
        persisted.mode ===
        "approval_draft",

      sheetDraft:
        persisted.sheetDraft,

      creation,

      character: {
        id:
          character._id,

        virtues:
          serialized.values,

        activeVirtues:
          serialized.active,

        virtuePoints:
          serialized.points,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao atualizar Virtude:",
      error
    );


    return res
      .status(
        500
      )
      .json({
        ok:
          false,

        error:
          "Não foi possível atualizar a Virtude.",
      });
  }
}


module.exports = {
  updateCharacterVirtues,
  updateCharacterVirtue,
};