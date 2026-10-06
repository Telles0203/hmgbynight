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
  CHARACTER_TITLE_MAX_LENGTH,
} = require(
  "../../data/characterLimits"
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
  serializeMoralityPath,
  serializeVirtues,
} = require(
  "./characterHelpers"
);

const {
  serializeCharacterState,
} = require(
  "./characterState"
);

const {
  isDraftApplicable,
  serializeCharacterSheetDraft,
  getCharacterSheetDraftMap,
} = require(
  "../../services/characterSheetDraftService"
);

const {
  getCharacterCreationProgress,
} = require(
  "../../rules/characterCreation/characterCreationProgress"
);


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


function serializeDraftForCharacter(
  character,
  draft
) {
  const applicableDraft =
    isDraftApplicable(
      character,
      draft
    )
      ? draft
      : null;


  const serialized =
    serializeCharacterSheetDraft(
      applicableDraft
    );


  const changes =
    serialized.changes;


  const displayChanges =
    {};


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "title"
      )
  ) {
    displayChanges.title =
      String(
        changes.title ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "concept"
      )
  ) {
    displayChanges.concept =
      String(
        changes.concept ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "clan"
      )
  ) {
    displayChanges.clan =
      getClanDisplayName(
        character.sect,
        changes.clan
      ) ||
      String(
        changes.clan ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "nature"
      )
  ) {
    const nature =
      serializeArchetype(
        changes.nature
      );


    displayChanges.nature =
      nature.label ||
      nature.ref ||
      "";
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "demeanor"
      )
  ) {
    const demeanor =
      serializeArchetype(
        changes.demeanor
      );


    displayChanges.demeanor =
      demeanor.label ||
      demeanor.ref ||
      "";
  }


  return {
    ...serialized,

    displayChanges,
  };
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
          "name title sheetLifecycle concept nature demeanor moralityPath moralityRating virtues type sect clan motherHouse pendingMotherHouse createdAt updatedAt"
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
          ) => {
            const nature =
              serializeArchetype(
                character.nature
              );


            const demeanor =
              serializeArchetype(
                character.demeanor
              );


            const moralityPath =
              serializeMoralityPath(
                character.moralityPath
              );


            const virtues =
              serializeVirtues(
                moralityPath.ref,
                character.virtues
              );


            const state =
              serializeCharacterState(
                character
              );


            const creation =
              getCharacterCreationProgress(
                character
              );


            const draft =
              draftMap.get(
                String(
                  character._id
                )
              ) ||
              null;


            return {
              id:
                character._id,

              name:
                character.name,

              title:
                character.title ||
                "",

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

              moralityPath:
                moralityPath.ref,

              moralityPathLabel:
                moralityPath.label,

              moralityRating:
                Number.isFinite(
                  character.moralityRating
                )
                  ? character.moralityRating
                  : null,

              virtues:
                virtues.values,

              activeVirtues:
                virtues.active,

              virtuePoints:
                virtues.points,

              creation,

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
                  character
                    .pendingMotherHouse
                ),

              sheetLifecycle:
                state.sheetLifecycle,

              sheetStatus:
                state.sheetStatus,

              chronicleStatus:
                state.chronicleStatus,

              status:
                state.status,

              editState:
                state.editState,

              sheetDraft:
                serializeDraftForCharacter(
                  character,
                  draft
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