const mongoose = require(
  "mongoose"
);

const {
  DEFAULT_MORALITY_PATH,
  getCoreMoralityPathByRef,
  isCoreMoralityPathRef,
} = require(
  "../../../data/vampire/moralityPaths"
);

const {
  serializeMoralityPath,
  serializeVirtues,
} = require(
  "../characterHelpers"
);

const {
  getCharacterCreationProgress,
} = require(
  "../../../rules/characterCreation/characterCreationProgress"
);

const {
  serializeCharacterCreation,
} = require(
  "../characterCreationSerialization"
);

const {
  getEffectiveCharacterForEditing,
  normalizeValue,
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
  buildMoralityPathVirtues,
} = require(
  "./characterMoralityPathTransition"
);


async function updateCharacterMoralityPath(
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


    const moralityPath =
      String(
        req.body?.moralityPath ||
        ""
      ).trim();


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
      !moralityPath ||
      !isCoreMoralityPathRef(
        moralityPath
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
            "Trilha Moral inválida.",
        });
    }


    const selectedPath =
      getCoreMoralityPathByRef(
        moralityPath
      );


    if (
      !selectedPath
    ) {
      return res
        .status(
          400
        )
        .json({
          ok:
            false,

          error:
            "Trilha Moral inválida.",
        });
    }


    const character =
      await findOwnedCharacterForEdit(
        characterId,
        userId,
        [
          "moralityPath",
          "virtues",
          "creation",
          "sect",
          "clan",
        ]
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


    const currentMoralityPath =
      String(
        effective
          .character
          ?.moralityPath ||
        DEFAULT_MORALITY_PATH
      );


    const proposedVirtues =
      buildMoralityPathVirtues({
        currentMoralityPath,

        nextMoralityPath:
          moralityPath,

        currentVirtues:
          effective
            .character
            ?.virtues,
      });


    const proposedCharacter = {
      ...normalizeValue(
        effective.character
      ),

      moralityPath,

      virtues:
        proposedVirtues,
    };


    const creation =
      serializeCharacterCreation(
        getCharacterCreationProgress(
          proposedCharacter
        )
      );


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          moralityPath,

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


    const serializedPath =
      serializeMoralityPath(
        moralityPath
      );


    const serializedVirtues =
      serializeVirtues(
        moralityPath,
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

      requiresNarratorApproval:
        selectedPath
          .requiresNarratorApproval ===
        true,

      creation,

      character: {
        id:
          character._id,

        moralityPath:
          serializedPath.ref,

        moralityPathLabel:
          serializedPath.label,

        virtues:
          serializedVirtues.values,

        activeVirtues:
          serializedVirtues.active,

        virtuePoints:
          serializedVirtues.points,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao atualizar Trilha Moral:",
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
          "Não foi possível atualizar a Trilha Moral.",
      });
  }
}


module.exports = {
  updateCharacterMoralityPath,
};