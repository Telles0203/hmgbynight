const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);


const {
  SECT_OPTIONS,
} = require(
  "../../data/vampire/sects"
);


const {
  CLAN_OPTIONS,
} = require(
  "../../data/vampire/clans"
);


const {
  getClanDisplayName,
} = require(
  "../../data/vampire/clanDisplay"
);


const {
  getCoreArchetypes,
} = require(
  "../../data/vampire/archetypes"
);


const {
  serializeHouse,
  serializeArchetype,
} = require(
  "./characterHelpers"
);


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
    //
    // padrão
    // + personalizados
    // - desativados
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
// Exports
// =============================================

module.exports = {
  getCharacterOptions,
  listCharacters,
  getCharacterArchetypes,
};