const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);


const {
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../../data/vampire/archetypes"
);


const {
  DEFAULT_MORALITY_PATH,
} = require(
  "../../data/vampire/moralityPaths"
);


const {
  VIRTUE_MAX,
  isActiveVirtueKey,
  getVirtueMinimumValue,
  getVirtueCreationProgress,
} = require(
  "../../data/vampire/virtues"
);


const {
  CHARACTER_CONCEPT_MAX_LENGTH,
  serializeVirtues,
} = require(
  "./characterHelpers"
);


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
    // Approved Chronicle protection
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


    // =============================================
    // Nothing changed
    // =============================================

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


    // =============================================
    // Atomic update
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
// Update Virtue
// =============================================

async function updateCharacterVirtue(
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


    const virtueKey =
      String(
        req.params?.virtueKey ||
          ""
      ).trim();


    const value =
      Number(
        req.body?.value
      );


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
    // Character
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
    // Value
    // =============================================

    if (
      !Number.isInteger(
        value
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "O valor da Virtude deve ser um número inteiro.",
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
        "_id moralityPath moralityRating virtues motherHouse pendingMotherHouse"
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


    // =============================================
    // Morality Path
    // =============================================

    const moralityPath =
      String(
        character.moralityPath ||
          DEFAULT_MORALITY_PATH
      );


    // =============================================
    // Active Virtue
    // =============================================

    if (
      !isActiveVirtueKey(
        moralityPath,
        virtueKey
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Esta Virtude não está ativa para a Trilha de Moralidade do personagem.",
        });
    }


    // =============================================
    // Minimum
    // =============================================

    const minimum =
      getVirtueMinimumValue(
        moralityPath,
        virtueKey
      );


    if (
      value <
      minimum
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `Esta Virtude não pode ficar abaixo de ${minimum}.`,
        });
    }


    // =============================================
    // Maximum
    // =============================================

    if (
      value >
      VIRTUE_MAX
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `Uma Virtude não pode ultrapassar ${VIRTUE_MAX}.`,
        });
    }


    // =============================================
    // Current values
    // =============================================

    const currentVirtues = {
      conscience:
        Number.isFinite(
          character.virtues
            ?.conscience
        )
          ? character.virtues
              .conscience
          : null,

      conviction:
        Number.isFinite(
          character.virtues
            ?.conviction
        )
          ? character.virtues
              .conviction
          : null,

      selfControl:
        Number.isFinite(
          character.virtues
            ?.selfControl
        )
          ? character.virtues
              .selfControl
          : null,

      instinct:
        Number.isFinite(
          character.virtues
            ?.instinct
        )
          ? character.virtues
              .instinct
          : null,

      courage:
        Number.isFinite(
          character.virtues
            ?.courage
        )
          ? character.virtues
              .courage
          : null,
    };


    const currentValue =
      currentVirtues[
        virtueKey
      ];


    // =============================================
    // Proposed values
    // =============================================

    const proposedVirtues = {
      ...currentVirtues,

      [
        virtueKey
      ]:
        value,
    };


    // =============================================
    // Creation budget
    // =============================================

    const virtuePoints =
      getVirtueCreationProgress(
        moralityPath,
        proposedVirtues
      );


    if (
      virtuePoints.spent >
      virtuePoints.total
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Você já distribuiu todos os 7 pontos disponíveis de Virtudes.",
        });
    }


    // =============================================
    // Nothing changed
    // =============================================

    if (
      currentValue ===
      value
    ) {
      const serializedVirtues =
        serializeVirtues(
          moralityPath,
          proposedVirtues
        );


      return res.json({
        ok:
          true,

        character: {
          id:
            character._id,

          virtues:
            serializedVirtues.values,

          activeVirtues:
            serializedVirtues.active,

          virtuePoints,
        },
      });
    }


    // =============================================
    // Atomic update
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
              `virtues.${virtueKey}`
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


    // =============================================
    // Response
    // =============================================

    const serializedVirtues =
      serializeVirtues(
        moralityPath,
        proposedVirtues
      );


    return res.json({
      ok:
        true,

      character: {
        id:
          character._id,

        virtues:
          serializedVirtues.values,

        activeVirtues:
          serializedVirtues.active,

        virtuePoints,
      },
    });

  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao atualizar Virtude:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível atualizar a Virtude.",
      });
  }
}


// =============================================
// Exports
// =============================================

module.exports = {
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
  updateCharacterVirtue,
};