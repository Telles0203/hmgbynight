const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);

const House = require(
  "../../models/House"
);

const {
  isValidSect,
} = require(
  "../../data/vampire/sects"
);

const {
  isValidClan,
} = require(
  "../../data/vampire/clans"
);

const {
  getClanDisplayName,
} = require(
  "../../data/vampire/clanDisplay"
);

const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../data/vampire/moralityPaths"
);

const {
  getStartingVirtueValues,
} = require(
  "../../data/vampire/virtues"
);

const {
  CHARACTER_NAME_MIN_LENGTH,
  CHARACTER_NAME_MAX_LENGTH,
  serializeHouse,
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


    if (
      !cleanSect ||
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


    if (
      !cleanClan ||
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


    const character =
      await Character.create({
        name:
          cleanName,

        title:
          "",

        type:
          "PC",

        concept:
          "",

        nature:
          "",

        demeanor:
          "",

        moralityPath:
          DEFAULT_MORALITY_PATH,

        moralityRating:
          null,

        virtues:
          getStartingVirtueValues(
            DEFAULT_MORALITY_PATH
          ),

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

          title:
            character.title,

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

          moralityPath:
            moralityPath.ref,

          moralityPathLabel:
            moralityPath.label,

          moralityRating:
            null,

          virtues:
            virtues.values,

          activeVirtues:
            virtues.active,

          virtuePoints:
            virtues.points,

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

          status:
            state.status,

          editState:
            state.editState,

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


module.exports = {
  createCharacter,
};