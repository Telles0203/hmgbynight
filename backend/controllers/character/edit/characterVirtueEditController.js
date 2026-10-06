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
  isActiveVirtueKey,
  getVirtueMinimumValue,
  getVirtueCreationProgress,
} = require(
  "../../../data/vampire/virtues"
);

const {
  getCurrentVirtueValues,
  validateSubmittedVirtues,
} = require(
  "./characterVirtueValidation"
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