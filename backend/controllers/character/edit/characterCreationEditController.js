const mongoose = require(
  "mongoose"
);

const {
  validateCharacterCreation,
} = require(
  "../../../rules/vampire/lotnr/validation"
);

const {
  getEffectiveCharacterForEditing,
  normalizeValue,
} = require(
  "../../../services/characterSheetDraftService"
);

const {
  serializeCharacterCreation,
} = require(
  "../characterCreationSerialization"
);

const {
  sanitizeCharacterCreationPayload,
} = require(
  "./characterCreationPayload"
);

const {
  findOwnedCharacterForEdit,
  persistCharacterChanges,
  respondCharacterEditFailure,
} = require(
  "./characterEditPersistence"
);


async function updateCharacterCreation(
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
      !req.body?.creation ||
      typeof req.body.creation !==
        "object" ||
      Array.isArray(
        req.body.creation
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
            "Os dados da criação são inválidos.",
        });
    }


    const character =
      await findOwnedCharacterForEdit(
        characterId,
        userId,
        [
          "creation",
          "sect",
          "clan",
          "moralityPath",
          "virtues",
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


    const creation =
      sanitizeCharacterCreationPayload(
        req.body.creation
      );


    const effective =
      await getEffectiveCharacterForEditing(
        character
      );


    const proposedCharacter = {
      ...normalizeValue(
        effective.character
      ),

      creation,
    };


    const validation =
      validateCharacterCreation(
        proposedCharacter
      );


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          creation,
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


    return res.json({
      ok:
        true,

      savedAsDraft:
        persisted.mode ===
        "approval_draft",

      sheetDraft:
        persisted.sheetDraft,

      creation:
        serializeCharacterCreation(
          validation
        ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao salvar criação da ficha:",
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
          "Não foi possível salvar os dados de criação da ficha.",
      });
  }
}


module.exports = {
  updateCharacterCreation,
};