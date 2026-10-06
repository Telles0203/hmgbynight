
const Character = require(
  "../../../models/Character"
);

const {
  CHARACTER_SHEET_LIFECYCLES,
} = require(
  "../../../data/characterSheetLifecycle"
);

const {
  canDirectlyEditCharacter,
  requiresChronicleApproval,
} = require(
  "../characterState"
);

const {
  normalizeValue,
  serializeCharacterSheetDraft,
  saveCharacterSheetDraftChanges,
} = require(
  "../../../services/characterSheetDraftService"
);


async function findOwnedCharacterForEdit(
  characterId,
  userId,
  fields = []
) {
  const selectedFields = [
    "_id",
    "ownerUser",
    "type",
    "sheetLifecycle",
    "motherHouse",
    "pendingMotherHouse",
    ...fields,
  ];


  return Character
    .findOne({
      _id:
        characterId,

      ownerUser:
        userId,

      type:
        "PC",
    })
    .select(
      selectedFields.join(
        " "
      )
    );
}


async function persistCharacterChanges({
  character,
  userId,
  changes,
}) {
  if (
    canDirectlyEditCharacter(
      character
    )
  ) {
    const result =
      await Character.updateOne(
        {
          _id:
            character._id,

          ownerUser:
            userId,

          type:
            "PC",

          motherHouse:
            null,

          $or: [
            {
              sheetLifecycle:
                CHARACTER_SHEET_LIFECYCLES
                  .INITIAL_DISTRIBUTION_PENDING,
            },

            {
              sheetLifecycle: {
                $exists:
                  false,
              },
            },
          ],
        },

        {
          $set:
            normalizeValue(
              changes
            ),
        },

        {
          runValidators:
            true,
        }
      );


    if (
      result.matchedCount !==
      1
    ) {
      return {
        ok:
          false,

        status:
          409,

        error:
          "O estado da ficha mudou antes da alteração ser concluída.",
      };
    }


    return {
      ok:
        true,

      mode:
        "direct",

      sheetDraft:
        serializeCharacterSheetDraft(
          null
        ),
    };
  }


  if (
    requiresChronicleApproval(
      character
    )
  ) {
    const draft =
      await saveCharacterSheetDraftChanges({
        character,

        ownerUser:
          userId,

        changes,
      });


    return {
      ok:
        true,

      mode:
        "approval_draft",

      sheetDraft:
        serializeCharacterSheetDraft(
          draft
        ),
    };
  }


  return {
    ok:
      false,

    status:
      409,

    error:
      "Esta ficha não está disponível para edição neste estado.",
  };
}


function respondCharacterEditFailure(
  res,
  result
) {
  return res
    .status(
      result?.status ||
      409
    )
    .json({
      ok:
        false,

      error:
        result?.error ||
        "A alteração não pôde ser realizada.",
    });
}


module.exports = {
  findOwnedCharacterForEdit,
  persistCharacterChanges,
  respondCharacterEditFailure,
};