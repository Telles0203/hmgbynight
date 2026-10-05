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


const {
  getCoreArchetypes,
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../data/vampire/archetypes"
);


const CHARACTER_NAME_MIN_LENGTH =
  2;

const CHARACTER_NAME_MAX_LENGTH =
  60;

const CHARACTER_CONCEPT_MAX_LENGTH =
  120;


// =============================================
// Helpers
// =============================================

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


// =============================================
// Archetype serializer
// =============================================

function serializeArchetype(
  value
) {
  const ref =
    String(
      value || ""
    );


  if (!ref) {
    return {
      ref:
        "",

      label:
        "",
    };
  }


  // =============================================
  // Core
  // =============================================

  if (
    isCoreArchetypeRef(
      ref
    )
  ) {
    return {
      ref,

      label:
        getCoreArchetypeLabel(
          ref
        ),
    };
  }


  // =============================================
  // Chronicle
  //
  // Ainda não implementado.
  //
  // Mantemos a referência para não perder
  // dados quando esse suporte for adicionado.
  // =============================================

  return {
    ref,

    label:
      ref,
  };
}


// =============================================
// Character options
// =============================================

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


// =============================================
// Create PC
// =============================================

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


    // =============================================
    // Name
    // =============================================

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


    // =============================================
    // Sect
    // =============================================

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


    // =============================================
    // Clan
    // =============================================

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


    // =============================================
    // Optional mother Chronicle
    // =============================================

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


    // =============================================
    // Create character
    // =============================================

    const character =
      await Character.create({
        name:
          cleanName,

        type:
          "PC",

        concept:
          "",

        nature:
          "",

        demeanor:
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

          nature:
            "",

          natureLabel:
            "",

          demeanor:
            "",

          demeanorLabel:
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


// =============================================
// List user's PCs
// =============================================

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
          "name concept nature demeanor type sect clan motherHouse pendingMotherHouse createdAt updatedAt"
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
          (character) => {
            const nature =
              serializeArchetype(
                character.nature
              );


            const demeanor =
              serializeArchetype(
                character.demeanor
              );


            return {
              id:
                character._id,

              name:
                character.name,

              concept:
                character.concept ||
                "",

              nature:
                nature.ref,

              natureLabel:
                nature.label,

              demeanor:
                demeanor.ref,

              demeanorLabel:
                demeanor.label,

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
            };
          }
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


// =============================================
// Get available Archetypes
// =============================================

async function getCharacterArchetypes(
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
    // Resolution rules
    //
    // Sem Crônica:
    // catálogo padrão.
    //
    // Aguardando Crônica:
    // catálogo padrão.
    //
    // Crônica aprovada:
    // futuramente:
    // padrão + personalizados - desativados.
    //
    // Por enquanto o endpoint já fica
    // preparado para essa resolução.
    // =============================================

    const archetypes =
      getCoreArchetypes();


    return res.json({
      ok:
        true,

      source:
        character.motherHouse
          ? "chronicle"
          : "core",

      archetypes:
        archetypes.map(
          (archetype) => ({
            ref:
              archetype.ref,

            label:
              archetype.label,
          })
        ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar arquétipos:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível carregar as opções de Natureza e Comportamento.",
      });
  }
}


// =============================================
// Update Concept
// =============================================

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


    // =============================================
    // Chronicle protection
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
            "Este personagem já pertence a uma Crônica. Alterações deverão ser aprovadas pela Crônica.",
        });
    }


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


// =============================================
// Update Archetype helper
// =============================================

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


    // =============================================
    // Empty is allowed
    // =============================================

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


    // =============================================
    // Approved Chronicle
    //
    // No futuro esta alteração vira uma
    // solicitação para aprovação.
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
            "Este personagem já pertence a uma Crônica. Alterações deverão ser aprovadas pela Crônica.",
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


    // =============================================
    // Atomic update
    //
    // pendingMotherHouse NÃO bloqueia.
    //
    // Somente motherHouse aprovada bloqueia.
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
            "O personagem foi vinculado a uma Crônica antes da alteração ser concluída. A mudança deverá ser aprovada pela Crônica.",
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


// =============================================
// Update Nature
// =============================================

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


// =============================================
// Update Demeanor
// =============================================

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


// =============================================
// Request mother Chronicle
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
  getCharacterOptions,
  createCharacter,
  listCharacters,
  getCharacterArchetypes,
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
  requestMotherHouse,
  deleteCharacter,
};