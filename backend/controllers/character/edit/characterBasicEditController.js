const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../../models/Character"
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
  canDirectlyEditCharacter,
} = require(
  "../characterState"
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


function rejectApprovedCharacter(
  res
) {
  return res
    .status(409)
    .json({
      ok:
        false,

      error:
        "Este personagem já foi aprovado por uma Crônica. Esta alteração não pode ser realizada diretamente.",
    });
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


    if (!userId) {
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
      await Character.findOne({
        _id:
          characterId,

        ownerUser:
          userId,

        type:
          "PC",
      }).select(
        `_id ${field} motherHouse pendingMotherHouse`
      );


    if (!character) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    if (
      !canDirectlyEditCharacter(
        character
      )
    ) {
      return rejectApprovedCharacter(
        res
      );
    }


    if (
      String(
        character[
          field
        ] ||
        ""
      ) ===
      value
    ) {
      return res.json({
        ok:
          true,

        character: {
          id:
            character._id,

          [
            field
          ]:
            value,
        },
      });
    }


    const result =
      await Character.updateOne(
        {
          _id:
            characterId,

          ownerUser:
            userId,

          type:
            "PC",

          motherHouse:
            null,
        },

        {
          $set: {
            [
              field
            ]:
              value,
          },
        }
      );


    if (
      result.matchedCount !==
      1
    ) {
      return rejectApprovedCharacter(
        res
      );
    }


    return res.json({
      ok:
        true,

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


    if (!userId) {
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
      await Character.findOne({
        _id:
          characterId,

        ownerUser:
          userId,

        type:
          "PC",
      }).select(
        "_id sect clan motherHouse pendingMotherHouse"
      );


    if (!character) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    if (
      !canDirectlyEditCharacter(
        character
      )
    ) {
      return rejectApprovedCharacter(
        res
      );
    }


    if (
      character.clan ===
      clan
    ) {
      return res.json({
        ok:
          true,

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
    }


    const result =
      await Character.updateOne(
        {
          _id:
            characterId,

          ownerUser:
            userId,

          type:
            "PC",

          motherHouse:
            null,
        },

        {
          $set: {
            clan,
          },
        }
      );


    if (
      result.matchedCount !==
      1
    ) {
      return rejectApprovedCharacter(
        res
      );
    }


    return res.json({
      ok:
        true,

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