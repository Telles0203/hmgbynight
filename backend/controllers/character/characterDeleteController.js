const bcrypt = require(
  "bcryptjs"
);

const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);

const User = require(
  "../../models/User"
);


// =============================================
// Delete PC
// =============================================

async function deleteCharacter(
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


    const currentPassword =
      req.body?.currentPassword;


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
    // Password
    // =============================================

    if (
      !currentPassword ||
      typeof currentPassword !==
        "string"
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Informe sua senha atual.",
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
        "name motherHouse"
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
    // Approved Chronicle protection
    //
    // Pending Chronicle NÃO bloqueia exclusão.
    //
    // Somente personagem já aprovado em uma
    // Crônica deixa de poder ser excluído
    // diretamente pelo jogador.
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
            "Personagens vinculados a uma Crônica não podem ser excluídos por aqui. A exclusão deve ser realizada pela própria Crônica.",
        });
    }


    // =============================================
    // User
    // =============================================

    const user =
      await User.findById(
        userId
      ).select(
        "+passwordHash"
      );


    if (!user) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Usuário não encontrado.",
        });
    }


    // =============================================
    // Verify password
    // =============================================

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );


    if (
      !passwordMatches
    ) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "A senha atual está incorreta.",
        });
    }


    // =============================================
    // Atomic delete
    //
    // Revalidamos motherHouse no momento exato
    // da exclusão para evitar corrida entre
    // aprovação da Crônica e delete.
    // =============================================

    const result =
      await Character.deleteOne({
        _id:
          character._id,

        ownerUser:
          userId,

        type:
          "PC",

        motherHouse:
          null,
      });


    if (
      result.deletedCount !==
      1
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "O personagem não pôde ser excluído. Verifique se ele foi vinculado a uma Crônica.",
        });
    }


    return res.json({
      ok:
        true,

      message:
        "Personagem excluído com sucesso.",

      deletedCharacter: {
        id:
          character._id,

        name:
          character.name,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao excluir personagem:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível excluir o personagem.",
      });
  }
}


// =============================================
// Exports
// =============================================

module.exports = {
  deleteCharacter,
};