const bcrypt = require(
  "bcryptjs"
);

const mongoose = require(
  "mongoose"
);

const Character = require(
  "../models/Character"
);

const User = require(
  "../models/User"
);

const {
  SECT_OPTIONS,
  isValidSect,
} = require(
  "../data/vampire/sects"
);

const {
  CLAN_OPTIONS,
  isValidClan,
} = require(
  "../data/vampire/clans"
);

const {
  getClanDisplayName,
} = require(
  "../data/vampire/clanDisplay"
);


const CHARACTER_NAME_MIN_LENGTH = 2;
const CHARACTER_NAME_MAX_LENGTH = 60;


// ==============================
// Character options
// ==============================

async function getCharacterOptions(
  req,
  res
) {
  try {
    return res.json({
      ok: true,

      sects: SECT_OPTIONS.map(
        (sect) => ({
          value: sect.value,
          label: sect.label,
        })
      ),

      clans: CLAN_OPTIONS.map(
        (clan) => ({
          value: clan.value,
          label: clan.label,
        })
      ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
      error
    );

    return res.status(500).json({
      ok: false,

      error:
        "Erro interno ao carregar opções do personagem.",
    });
  }
}


// ==============================
// Create PC
// ==============================

async function createCharacter(
  req,
  res
) {
  try {
    const {
      name,
      sect,
      clan,
    } = req.body || {};

    const cleanName =
      String(
        name || ""
      ).trim();

    const cleanSect =
      String(
        sect || ""
      )
        .trim()
        .toLowerCase();

    const cleanClan =
      String(
        clan || ""
      )
        .trim()
        .toLowerCase();


    if (!cleanName) {
      return res.status(400).json({
        ok: false,

        error:
          "Informe o nome do personagem.",
      });
    }


    if (
      cleanName.length <
        CHARACTER_NAME_MIN_LENGTH ||
      cleanName.length >
        CHARACTER_NAME_MAX_LENGTH
    ) {
      return res.status(400).json({
        ok: false,

        error:
          `O nome do personagem deve possuir entre ${CHARACTER_NAME_MIN_LENGTH} e ${CHARACTER_NAME_MAX_LENGTH} caracteres.`,
      });
    }


    if (!cleanSect) {
      return res.status(400).json({
        ok: false,

        error:
          "Selecione a seita do personagem.",
      });
    }


    if (
      !isValidSect(
        cleanSect
      )
    ) {
      return res.status(400).json({
        ok: false,

        error:
          "Seita inválida.",
      });
    }


    if (!cleanClan) {
      return res.status(400).json({
        ok: false,

        error:
          "Selecione o clã do personagem.",
      });
    }


    if (
      !isValidClan(
        cleanClan
      )
    ) {
      return res.status(400).json({
        ok: false,

        error:
          "Clã inválido.",
      });
    }


    const character =
      await Character.create({
        name: cleanName,
        type: "PC",

        sect: cleanSect,
        clan: cleanClan,

        ownerUser:
          req.user.sub,

        motherHouse:
          null,
      });


    return res.status(201).json({
      ok: true,

      character: {
        id:
          character._id,

        name:
          character.name,

        type:
          character.type,

        sect:
          character.sect,

        clan:
          character.clan,

        clanDisplayName:
          getClanDisplayName(
            character.sect,
            character.clan
          ),

        motherHouse:
          character.motherHouse,

        createdAt:
          character.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao criar personagem:",
      error
    );

    return res.status(500).json({
      ok: false,

      error:
        "Erro interno ao criar personagem.",
    });
  }
}


// ==============================
// List user's PCs
// ==============================

async function listCharacters(
  req,
  res
) {
  try {
    const characters =
      await Character.find({
        ownerUser:
          req.user.sub,

        type:
          "PC",
      })
        .select(
          "name type sect clan motherHouse createdAt updatedAt"
        )
        .sort({
          createdAt:
            -1,
        })
        .lean();


    return res.json({
      ok: true,

      characters:
        characters.map(
          (character) => ({
            id:
              character._id,

            name:
              character.name,

            type:
              character.type,

            sect:
              character.sect,

            clan:
              character.clan,

            clanDisplayName:
              getClanDisplayName(
                character.sect,
                character.clan
              ),

            motherHouse:
              character.motherHouse,

            createdAt:
              character.createdAt,

            updatedAt:
              character.updatedAt,
          })
        ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao listar personagens:",
      error
    );

    return res.status(500).json({
      ok: false,

      error:
        "Erro interno ao buscar personagens.",
    });
  }
}


// ==============================
// Delete PC
// ==============================

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


    // ==============================
    // Authentication
    // ==============================

    if (!userId) {
      return res.status(401).json({
        ok: false,

        error:
          "Não autenticado.",
      });
    }


    // ==============================
    // Character ID
    // ==============================

    if (
      !characterId ||
      !mongoose.isValidObjectId(
        characterId
      )
    ) {
      return res.status(400).json({
        ok: false,

        error:
          "Personagem inválido.",
      });
    }


    // ==============================
    // Password
    // ==============================

    if (
      !currentPassword ||
      typeof currentPassword !==
        "string"
    ) {
      return res.status(400).json({
        ok: false,

        error:
          "Informe sua senha atual.",
      });
    }


    // ==============================
    // Character ownership
    // ==============================

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
      return res.status(404).json({
        ok: false,

        error:
          "Personagem não encontrado.",
      });
    }


    // ==============================
    // House protection
    // ==============================

    if (
      character.motherHouse
    ) {
      return res.status(409).json({
        ok: false,

        error:
          "Personagens vinculados a uma House não podem ser excluídos por aqui. A exclusão deve ser realizada pela House.",
      });
    }


    // ==============================
    // Load user password
    // ==============================

    const user =
      await User.findById(
        userId
      ).select(
        "+passwordHash"
      );


    if (!user) {
      return res.status(404).json({
        ok: false,

        error:
          "Usuário não encontrado.",
      });
    }


    // ==============================
    // Verify password
    // ==============================

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );


    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,

        error:
          "A senha atual está incorreta.",
      });
    }


    // ==============================
    // Delete
    //
    // motherHouse: null também é
    // verificado novamente aqui.
    // ==============================

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
      return res.status(409).json({
        ok: false,

        error:
          "O personagem não pôde ser excluído. Verifique se ele foi vinculado a uma House.",
      });
    }


    return res.json({
      ok: true,

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

    return res.status(500).json({
      ok: false,

      error:
        "Não foi possível excluir o personagem.",
    });
  }
}


// ==============================
// Exports
// ==============================

module.exports = {
  getCharacterOptions,
  createCharacter,
  listCharacters,
  deleteCharacter,
};