const Character = require(
  "../models/Character"
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
      String(name || "").trim();

    const cleanSect =
      String(sect || "")
        .trim()
        .toLowerCase();

    const cleanClan =
      String(clan || "")
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

    if (!isValidSect(cleanSect)) {
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

    if (!isValidClan(cleanClan)) {
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

        ownerUser: req.user.sub,
        motherHouse: null,
      });

    return res.status(201).json({
      ok: true,

      character: {
        id: character._id,
        name: character.name,
        type: character.type,

        sect: character.sect,
        clan: character.clan,

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
        ownerUser: req.user.sub,
        type: "PC",
      })
        .select(
          "name type sect clan motherHouse createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json({
      ok: true,

      characters:
        characters.map(
          (character) => ({
            id: character._id,
            name: character.name,
            type: character.type,

            sect: character.sect,
            clan: character.clan,

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

module.exports = {
  getCharacterOptions,
  createCharacter,
  listCharacters,
};