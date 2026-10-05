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
  CHARACTER_CONCEPT_MAX_LENGTH,
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


    // =============================================
    // Empty value is allowed
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
    // Futuramente isso criará uma solicitação
    // de alteração para a Crônica.
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


    // =============================================
    // Nothing changed
    // =============================================

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
    // Somente uma Crônica já aprovada bloqueia.
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
// Exports
// =============================================

module.exports = {
  updateCharacterConcept,
  updateCharacterNature,
  updateCharacterDemeanor,
};