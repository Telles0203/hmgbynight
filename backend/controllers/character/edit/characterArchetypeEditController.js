const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../../models/Character"
);

const {
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../../../data/vampire/archetypes"
);

const {
  canDirectlyEditCharacter,
} = require(
  "../characterState"
);


async function updateCharacterArchetype(
  req,
  res,
  field
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
      !characterId ||
      !mongoose.isValidObjectId(
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
            "Arquétipo inválido.",
        });
    }


    const value =
      rawValue.trim();


    if (
      value &&
      !isCoreArchetypeRef(
        value
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "A opção selecionada não está disponível.",
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
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já foi aprovado por uma Crônica. Esta alteração não pode ser realizada diretamente.",
        });
    }


    const currentValue =
      String(
        character[
          field
        ] ||
        ""
      );


    if (
      currentValue ===
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

          [
            `${field}Label`
          ]:
            getCoreArchetypeLabel(
              value
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
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "O personagem foi aprovado antes da alteração ser concluída.",
        });
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

        [
          `${field}Label`
        ]:
          getCoreArchetypeLabel(
            value
          ),
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
          "Não foi possível atualizar o arquétipo.",
      });
  }
}


async function updateCharacterNature(
  req,
  res
) {
  return updateCharacterArchetype(
    req,
    res,
    "nature"
  );
}


async function updateCharacterDemeanor(
  req,
  res
) {
  return updateCharacterArchetype(
    req,
    res,
    "demeanor"
  );
}


module.exports = {
  updateCharacterNature,
  updateCharacterDemeanor,
};