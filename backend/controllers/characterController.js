const bcrypt = require(
  "bcryptjs"
);

const mongoose = require(
  "mongoose"
);

const Character = require(
  "../models/Character"
);

const House = require(
  "../models/House"
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


const CHARACTER_NAME_MIN_LENGTH =
  2;

const CHARACTER_NAME_MAX_LENGTH =
  60;

const CHARACTER_CONCEPT_MAX_LENGTH =
  120;


// ==============================
// Helpers
// ==============================

function serializeHouse(
  house
) {
  if (!house) {
    return null;
  }


  if (
    typeof house ===
      "object" &&
    house._id
  ) {
    return {
      id:
        house._id,

      name:
        house.name || "",
    };
  }


  return {
    id:
      house,

    name:
      "",
  };
}


// ==============================
// Character options
// ==============================

async function getCharacterOptions(
  req,
  res
) {
  try {
    return res.json({
      ok:
        true,

      sects:
        SECT_OPTIONS.map(
          (sect) => ({
            value:
              sect.value,

            label:
              sect.label,
          })
        ),

      clans:
        CLAN_OPTIONS.map(
          (clan) => ({
            value:
              clan.value,

            label:
              clan.label,
          })
        ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

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
      requestedMotherHouseId,
    } =
      req.body || {};


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


    const cleanRequestedHouseId =
      String(
        requestedMotherHouseId ||
          ""
      ).trim();


    // ==============================
    // Name
    // ==============================

    if (!cleanName) {
      return res
        .status(400)
        .json({
          ok:
            false,

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
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `O nome do personagem deve possuir entre ${CHARACTER_NAME_MIN_LENGTH} e ${CHARACTER_NAME_MAX_LENGTH} caracteres.`,
        });
    }


    // ==============================
    // Sect
    // ==============================

    if (!cleanSect) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Selecione a seita do personagem.",
        });
    }


    if (
      !isValidSect(
        cleanSect
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Seita inválida.",
        });
    }


    // ==============================
    // Clan
    // ==============================

    if (!cleanClan) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Selecione o clã do personagem.",
        });
    }


    if (
      !isValidClan(
        cleanClan
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


    // ==============================
    // Optional mother Chronicle
    // ==============================

    let requestedHouse =
      null;


    if (
      cleanRequestedHouseId
    ) {
      if (
        !mongoose.isValidObjectId(
          cleanRequestedHouseId
        )
      ) {
        return res
          .status(400)
          .json({
            ok:
              false,

            error:
              "Crônica selecionada inválida.",
          });
      }


      requestedHouse =
        await House.findOne({
          _id:
            cleanRequestedHouseId,

          isActive:
            true,
        }).select(
          "name"
        );


      if (!requestedHouse) {
        return res
          .status(404)
          .json({
            ok:
              false,

            error:
              "A Crônica selecionada não foi encontrada ou está inativa.",
          });
      }
    }


    // ==============================
    // Create character
    // ==============================

    const character =
      await Character.create({
        name:
          cleanName,

        type:
          "PC",

        concept:
          "",

        sect:
          cleanSect,

        clan:
          cleanClan,

        ownerUser:
          req.user.sub,

        motherHouse:
          null,

        pendingMotherHouse:
          requestedHouse?._id ||
          null,
      });


    return res
      .status(201)
      .json({
        ok:
          true,

        character: {
          id:
            character._id,

          name:
            character.name,

          concept:
            character.concept,

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
            null,

          pendingMotherHouse:
            serializeHouse(
              requestedHouse
            ),

          createdAt:
            character.createdAt,
        },
      });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao criar personagem:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

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
          "name concept type sect clan motherHouse pendingMotherHouse createdAt updatedAt"
        )

        .populate({
          path:
            "motherHouse",

          select:
            "name",
        })

        .populate({
          path:
            "pendingMotherHouse",

          select:
            "name",
        })

        .sort({
          createdAt:
            -1,
        })

        .lean();


    return res.json({
      ok:
        true,

      characters:
        characters.map(
          (character) => ({
            id:
              character._id,

            name:
              character.name,

            concept:
              character.concept ||
              "",

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
              serializeHouse(
                character.motherHouse
              ),

            pendingMotherHouse:
              serializeHouse(
                character.pendingMotherHouse
              ),

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


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Erro interno ao buscar personagens.",
      });
  }
}


// ==============================
// Update Concept
// ==============================

async function updateCharacterConcept(
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


    // ==============================
    // Authentication
    // ==============================

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


    // ==============================
    // Character ID
    // ==============================

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


    // ==============================
    // Concept
    // ==============================

    if (
      typeof req.body?.concept !==
      "string"
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Conceito inválido.",
        });
    }


    const concept =
      req.body.concept.trim();


    if (
      concept.length >
      CHARACTER_CONCEPT_MAX_LENGTH
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `O conceito pode possuir no máximo ${CHARACTER_CONCEPT_MAX_LENGTH} caracteres.`,
        });
    }


    // ==============================
    // Character ownership/state
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
        "_id concept motherHouse pendingMotherHouse"
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


    // ==============================
    // Chronicle protection
    //
    // Sem Crônica:
    // pode alterar diretamente.
    //
    // Solicitação pendente:
    // pode alterar diretamente.
    //
    // Crônica aprovada:
    // alteração deverá passar
    // por aprovação da Crônica.
    // ==============================

    if (
      character.motherHouse
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já pertence a uma Crônica. Alterações deverão ser aprovadas pela Crônica.",
        });
    }


    // ==============================
    // No change
    // ==============================

    if (
      String(
        character.concept ||
        ""
      ) ===
      concept
    ) {
      return res.json({
        ok:
          true,

        character: {
          id:
            character._id,

          concept:
            concept,
        },
      });
    }


    // ==============================
    // Update only Concept
    //
    // Não usamos character.save().
    //
    // Isso evita validar novamente
    // todos os campos de personagens
    // antigos.
    //
    // O motherHouse:null também
    // protege contra uma aprovação
    // da Crônica acontecendo entre
    // a leitura e a gravação.
    // ==============================

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
            concept,
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
            "O personagem foi vinculado a uma Crônica antes da alteração ser concluída. A mudança deverá ser aprovada pela Crônica.",
        });
    }


    return res.json({
      ok:
        true,

      character: {
        id:
          character._id,

        concept:
          concept,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao atualizar conceito:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível atualizar o conceito.",
      });
  }
}


// ==============================
// Request mother Chronicle
// ==============================

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


    // ==============================
    // Authentication
    // ==============================

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


    // ==============================
    // Character
    // ==============================

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


    // ==============================
    // Chronicle
    // ==============================

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


    // ==============================
    // Ownership
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


    // ==============================
    // Already approved
    // ==============================

    if (
      character.motherHouse
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já pertence a uma Crônica.",
        });
    }


    // ==============================
    // Already pending
    // ==============================

    if (
      character.pendingMotherHouse
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Este personagem já possui uma solicitação de Crônica aguardando aprovação.",
        });
    }


    // ==============================
    // Create request
    // ==============================

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

          pendingMotherHouse:
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
      result.modifiedCount !==
      1
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Não foi possível registrar a solicitação. O estado do personagem pode ter sido alterado.",
        });
    }


    return res.json({
      ok:
        true,

      message:
        "Solicitação enviada para a Crônica.",

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
      return res
        .status(401)
        .json({
          ok:
            false,

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
      return res
        .status(400)
        .json({
          ok:
            false,

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
      return res
        .status(400)
        .json({
          ok:
            false,

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
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    // ==============================
    // Chronicle protection
    // ==============================

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


    // ==============================
    // User
    // ==============================

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


    // ==============================
    // Verify password
    // ==============================

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


    // ==============================
    // Delete
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


// ==============================
// Exports
// ==============================

module.exports = {
  getCharacterOptions,
  createCharacter,
  listCharacters,
  updateCharacterConcept,
  requestMotherHouse,
  deleteCharacter,
};