const Character = require(
  "../models/Character"
);

const CHARACTER_NAME_MIN_LENGTH = 2;
const CHARACTER_NAME_MAX_LENGTH = 60;

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
    } = req.body || {};

    const cleanName =
      String(name || "").trim();

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

    const character =
      await Character.create({
        name: cleanName,
        type: "PC",
        ownerUser: req.user.sub,
        motherHouse: null,
      });

    return res.status(201).json({
      ok: true,

      character: {
        id: character._id,
        name: character.name,
        type: character.type,
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
          "name type motherHouse createdAt updatedAt"
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
  createCharacter,
  listCharacters,
};