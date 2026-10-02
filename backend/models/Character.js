const mongoose = require("mongoose");

const {
  SECT_OPTIONS,
} = require(
  "../data/vampire/sects"
);

const {
  CLAN_OPTIONS,
} = require(
  "../data/vampire/clans"
);

const validSects =
  SECT_OPTIONS.map(
    (option) => option.value
  );

const validClans =
  CLAN_OPTIONS.map(
    (option) => option.value
  );

const CharacterSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
      },

      type: {
        type: String,
        required: true,
        enum: ["PC", "NPC"],
      },

      // ==============================
      // Vampire
      // ==============================

      sect: {
        type: String,
        required: true,
        enum: validSects,
        index: true,
      },

      clan: {
        type: String,
        required: true,
        enum: validClans,
        index: true,
      },

      /*
       * PC:
       * usuário proprietário.
       *
       * NPC:
       * deve permanecer null.
       */
      ownerUser: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
      },

      /*
       * House mãe.
       *
       * PC:
       * opcional.
       *
       * NPC:
       * obrigatória.
       */
      motherHouse: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "House",
        default: null,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

// ==============================
// Character rules
// ==============================

CharacterSchema.pre(
  "validate",
  function () {
    if (
      this.type === "PC" &&
      !this.ownerUser
    ) {
      throw new Error(
        "Um PC precisa possuir um jogador responsável."
      );
    }

    if (
      this.type === "NPC" &&
      !this.motherHouse
    ) {
      throw new Error(
        "Um NPC precisa estar vinculado a uma House."
      );
    }

    if (
      this.type === "NPC" &&
      this.ownerUser
    ) {
      throw new Error(
        "Um NPC não pode possuir um jogador proprietário."
      );
    }
  }
);

module.exports = mongoose.model(
  "Character",
  CharacterSchema
);