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
  getCoreAbilities,
} = require(
  "../../data/vampire/abilities"
);

const {
  getCoreMoralityPaths,
} = require(
  "../../data/vampire/moralityPaths"
);

const {
  CHARACTER_TITLE_MAX_LENGTH,
} = require(
  "../../data/characterLimits"
);

const {
  getCoreArchetypes,
} = require(
  "../../data/vampire/archetypes"
);

const {
  CORE_DISCIPLINES,
  CORE_BACKGROUNDS,
} = require(
  "../../rules/vampire/lotnr/catalogs"
);

const {
  getAllClanRules,
} = require(
  "../../rules/vampire/lotnr/clanRules"
);

const {
  RULESET_REFERENCE,
  CHARACTER_CREATION_RULES,
} = require(
  "../../rules/vampire/lotnr/ruleset"
);

const {
  getCharacterSheetDraftMap,
} = require(
  "../../services/characterSheetDraftService"
);

const {
  serializeCharacterRecord,
} = require(
  "./characterSerializer"
);


function humanizeRuleKey(
  value
) {
  return String(
    value ||
    ""
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}


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
          (
            sect
          ) => ({
            value:
              sect.value,

            label:
              sect.label,
          })
        ),

      clans:
        CLAN_OPTIONS.map(
          (
            clan
          ) => ({
            value:
              clan.value,

            label:
              clan.label,
          })
        ),

      clanRules:
        getAllClanRules(),

      moralityPaths:
        getCoreMoralityPaths()
          .map(
            (
              moralityPath
            ) => ({
              value:
                moralityPath.ref,

              label:
                moralityPath.label,

              requiresNarratorApproval:
                moralityPath
                  .requiresNarratorApproval ===
                true,
            })
          ),

      abilities:
        getCoreAbilities(),

      abilityRules: {
        total:
          CHARACTER_CREATION_RULES
            .abilities
            .total,

        freeTraitCost:
          CHARACTER_CREATION_RULES
            .freeTraits
            .costs
            .ability,

        specializationFreeTraitCost:
          CHARACTER_CREATION_RULES
            .freeTraits
            .costs
            .specialization,
      },


      disciplines:
        CORE_DISCIPLINES.map(
          (
            discipline
          ) => ({
            value:
              discipline,

            label:
              humanizeRuleKey(
                discipline
              ),
          })
        ),

      backgrounds:
        CORE_BACKGROUNDS.map(
          (
            background
          ) => ({
            value:
              background,

            label:
              humanizeRuleKey(
                background
              ),
          })
        ),

      ruleset: {
        ...RULESET_REFERENCE,
      },

      limits: {
        titleMaxLength:
          CHARACTER_TITLE_MAX_LENGTH,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar opções:",
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
          "Erro interno ao carregar opções do personagem.",
      });
  }
}


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
          "name title sheetLifecycle concept nature demeanor moralityPath moralityRating virtues creation type sect clan motherHouse pendingMotherHouse createdAt updatedAt"
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


    const draftMap =
      await getCharacterSheetDraftMap(
        characters
      );


    return res.json({
      ok:
        true,

      characters:
        characters.map(
          (
            character
          ) =>
            serializeCharacterRecord(
              character,
              draftMap.get(
                String(
                  character._id
                )
              ) ||
              null
            )
        ),
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao listar personagens:",
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
          "Erro interno ao buscar personagens.",
      });
  }
}


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


    if (
      !userId ||
      !characterId ||
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
          (
            archetype
          ) => ({
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
      .status(
        500
      )
      .json({
        ok:
          false,

        error:
          "Não foi possível carregar as opções de Natureza e Comportamento.",
      });
  }
}


module.exports = {
  getCharacterOptions,
  listCharacters,
  getCharacterArchetypes,
};
