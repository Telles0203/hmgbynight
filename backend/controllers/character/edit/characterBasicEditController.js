const mongoose = require(
  "mongoose"
);

const {
  isValidClan,
} = require(
  "../../../data/vampire/clans"
);

const {
  getClanDisplayName,
} = require(
  "../../../data/vampire/clanDisplay"
);

const {
  CHARACTER_TITLE_MAX_LENGTH,
  CHARACTER_CONCEPT_MAX_LENGTH,
} = require(
  "../characterHelpers"
);

const {
  findOwnedCharacterForEdit,
  persistCharacterChanges,
  respondCharacterEditFailure,
} = require(
  "./characterEditPersistence"
);


function validateCharacterId(
  characterId
) {
  return (
    characterId &&
    mongoose.isValidObjectId(
      characterId
    )
  );
}


async function updateTextField(
  req,
  res,
  {
    field,
    label,
    maxLength,
  }
) {
  try {
    const userId =
      req.user?.sub;


    const characterId =
      String(
        req.params?.characterId ||
        ""
      ).trim();


    const rawValue =
      req.body?.[
        field
      ];


    if (
      !userId
    ) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    if (
      !validateCharacterId(
        characterId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Personagem inválido.",
        });
    }


    if (
      typeof rawValue !==
      "string"
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `${label} inválido.`,
        });
    }


    const value =
      rawValue.trim();


    if (
      value.length >
      maxLength
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `${label} pode possuir no máximo ${maxLength} caracteres.`,
        });
    }


    const character =
      await findOwnedCharacterForEdit(
        characterId,
        userId,
        [
          field,
        ]
      );


    if (
      !character
    ) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          [
            field
          ]:
            value,
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

      character: {
        id:
          character._id,

        [
          field
        ]:
          value,
      },
    });

  } catch (error) {
    console.error(
      `[CHARACTER] Erro ao atualizar ${field}:`,
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          `Não foi possível atualizar ${label.toLowerCase()}.`,
      });
  }
}


async function updateCharacterConcept(
  req,
  res
) {
  return updateTextField(
    req,
    res,
    {
      field:
        "concept",

      label:
        "Conceito",

      maxLength:
        CHARACTER_CONCEPT_MAX_LENGTH,
    }
  );
}


async function updateCharacterTitle(
  req,
  res
) {
  return updateTextField(
    req,
    res,
    {
      field:
        "title",

      label:
        "Título",

      maxLength:
        CHARACTER_TITLE_MAX_LENGTH,
    }
  );
}


async function updateCharacterClan(
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


    const clan =
      String(
        req.body?.clan ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      !userId
    ) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    if (
      !validateCharacterId(
        characterId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Personagem inválido.",
        });
    }


    if (
      !clan ||
      !isValidClan(
        clan
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Clã inválido.",
        });
    }


    const character =
      await findOwnedCharacterForEdit(
        characterId,
        userId,
        [
          "sect",
          "clan",
        ]
      );


    if (
      !character
    ) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          clan,
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

      character: {
        id:
          character._id,

        clan,

        clanDisplayName:
          getClanDisplayName(
            character.sect,
            clan
          ),
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao atualizar Clã:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível atualizar o Clã.",
      });
  }
}


module.exports = {
  updateCharacterConcept,
  updateCharacterTitle,
  updateCharacterClan,
};