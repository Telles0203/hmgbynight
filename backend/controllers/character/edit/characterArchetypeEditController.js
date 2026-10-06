const mongoose = require(
  "mongoose"
);

const {
  getCoreArchetypeLabel,
  isCoreArchetypeRef,
} = require(
  "../../../data/vampire/archetypes"
);

const {
  findOwnedCharacterForEdit,
  persistCharacterChanges,
  respondCharacterEditFailure,
} = require(
  "./characterEditPersistence"
);


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


    if (
      !userId
    ) {
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
      await findOwnedCharacterForEdit(
        characterId,
        userId,
        [
          field,
        ]
      );


    if (
      !character
    ) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Personagem não encontrado.",
        });
    }


    const persisted =
      await persistCharacterChanges({
        character,

        userId,

        changes: {
          [
            field
          ]:
            value,
        },
      });


    if (
      !persisted.ok
    ) {
      return respondCharacterEditFailure(
        res,
        persisted
      );
    }


    return res.json({
      ok:
        true,

      savedAsDraft:
        persisted.mode ===
        "approval_draft",

      sheetDraft:
        persisted.sheetDraft,

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


module.exports = {
  updateCharacterNature,
  updateCharacterDemeanor,
};