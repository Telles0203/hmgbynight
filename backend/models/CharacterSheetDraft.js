const mongoose = require(
  "mongoose"
);

const {
  CHARACTER_SHEET_DRAFT_STATUSES,
  CHARACTER_SHEET_DRAFT_STATUS_VALUES,
  CHARACTER_SHEET_DRAFT_FIELDS,
} = require(
  "../data/characterSheetDraft"
);


const CharacterSheetDraftSchema =
  new mongoose.Schema(
    {
      character: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Character",

        required:
          true,

        unique:
          true,

        index:
          true,
      },

      house: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "House",

        required:
          true,

        index:
          true,
      },

      ownerUser: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },

      status: {
        type:
          String,

        enum:
          CHARACTER_SHEET_DRAFT_STATUS_VALUES,

        default:
          CHARACTER_SHEET_DRAFT_STATUSES
            .DRAFT,

        index:
          true,
      },

      changes: {
        type:
          mongoose.Schema.Types.Mixed,

        default:
          () => ({}),
      },

      submittedAt: {
        type:
          Date,

        default:
          null,
      },
    },

    {
      timestamps:
        true,
    }
  );


CharacterSheetDraftSchema.index({
  house:
    1,

  status:
    1,

  updatedAt:
    -1,
});


CharacterSheetDraftSchema.pre(
  "validate",
  function () {
    if (
      !this.changes ||
      typeof this.changes !==
        "object" ||
      Array.isArray(
        this.changes
      )
    ) {
      throw new Error(
        "As alterações da ficha são inválidas."
      );
    }


    const invalidField =
      Object.keys(
        this.changes
      ).find(
        (
          field
        ) =>
          !CHARACTER_SHEET_DRAFT_FIELDS
            .includes(
              field
            )
      );


    if (
      invalidField
    ) {
      throw new Error(
        `Campo de rascunho inválido: ${invalidField}.`
      );
    }
  }
);


module.exports =
  mongoose.model(
    "CharacterSheetDraft",
    CharacterSheetDraftSchema
  );