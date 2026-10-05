const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);

const House = require(
  "../../models/House"
);


// =============================================
// Request / change pending Chronicle
// =============================================

async function requestMotherHouse(
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


    const houseId =
      String(
        req.body?.houseId ||
          ""
      ).trim();


    // =============================================
    // Authentication
    // =============================================

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


    // =============================================
    // Character ID
    // =============================================

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


    // =============================================
    // Chronicle ID
    // =============================================

    if (
      !houseId ||
      !mongoose.isValidObjectId(
        houseId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Selecione uma Crônica válida.",
        });
    }


    // =============================================
    // Chronicle
    // =============================================

    const house =
      await House.findOne({
        _id:
          houseId,

        isActive:
          true,
      }).select(
        "name"
      );


    if (!house) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "A Crônica selecionada não foi encontrada ou está inativa.",
        });
    }


    // =============================================
    // Character
    // =============================================

    const character =
      await Character.findOne({
        _id:
          characterId,

        ownerUser:
          userId,

        type:
          "PC",
      }).select(
        "_id motherHouse pendingMotherHouse"
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


    // =============================================
    // Already approved
    //
    // Once approved, Chronicle cannot be changed
    // directly by the player.
    // =============================================

    if (
      character.motherHouse
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já foi aprovado por uma Crônica. O vínculo não pode mais ser alterado diretamente.",
        });
    }


    // =============================================
    // Same pending Chronicle
    // =============================================

    if (
      character.pendingMotherHouse &&
      String(
        character.pendingMotherHouse
      ) ===
      String(
        house._id
      )
    ) {
      return res.json({
        ok:
          true,

        message:
          "Esta Crônica já está aguardando aprovação.",

        pendingMotherHouse: {
          id:
            house._id,

          name:
            house.name,
        },
      });
    }


    // =============================================
    // Create OR replace pending request
    //
    // Important:
    // pendingMotherHouse does NOT lock character
    // creation.
    // =============================================

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
            pendingMotherHouse:
              house._id,
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
            "Não foi possível alterar a solicitação. O personagem pode ter sido aprovado por uma Crônica enquanto a operação era realizada.",
        });
    }


    return res.json({
      ok:
        true,

      message:
        character.pendingMotherHouse
          ? "Crônica solicitada alterada."
          : "Solicitação enviada para a Crônica.",

      pendingMotherHouse: {
        id:
          house._id,

        name:
          house.name,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao solicitar Crônica:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível solicitar o vínculo com a Crônica.",
      });
  }
}


// =============================================
// Cancel pending Chronicle request
// =============================================

async function cancelMotherHouseRequest(
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


    const character =
      await Character.findOne({
        _id:
          characterId,

        ownerUser:
          userId,

        type:
          "PC",
      }).select(
        "_id motherHouse pendingMotherHouse"
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


    // =============================================
    // Approved Chronicle cannot be removed here
    // =============================================

    if (
      character.motherHouse
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já foi aprovado por uma Crônica. O vínculo não pode ser removido diretamente.",
        });
    }


    // =============================================
    // Nothing pending
    // =============================================

    if (
      !character.pendingMotherHouse
    ) {
      return res.json({
        ok:
          true,

        message:
          "O personagem não possui vínculo pendente.",

        pendingMotherHouse:
          null,
      });
    }


    // =============================================
    // Remove pending request
    // =============================================

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
            pendingMotherHouse:
              null,
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
            "Não foi possível remover a solicitação. O estado do personagem pode ter sido alterado.",
        });
    }


    return res.json({
      ok:
        true,

      message:
        "Solicitação de vínculo removida.",

      pendingMotherHouse:
        null,
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao remover solicitação de Crônica:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível remover a solicitação de vínculo.",
      });
  }
}


// =============================================
// Exports
// =============================================

module.exports = {
  requestMotherHouse,
  cancelMotherHouseRequest,
};