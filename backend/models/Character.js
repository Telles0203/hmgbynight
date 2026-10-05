const mongoose = require(
  "mongoose"
);

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
    (option) =>
      option.value
  );


const validClans =
  CLAN_OPTIONS.map(
    (option) =>
      option.value
  );


const CharacterSchema =
  new mongoose.Schema(
    {
      name: {
        type:
          String,

        required:
          true,

        trim:
          true,

        minlength:
          2,

        maxlength:
          60,
      },


      type: {
        type:
          String,

        required:
          true,

        enum: [
          "PC",
          "NPC",
        ],
      },


      // ==============================
      // Inspiration
      // ==============================

      /*
       * Conceito.
       *
       * O personagem é criado inicialmente
       * com o campo vazio.
       *
       * O preenchimento ocorre posteriormente
       * dentro da ficha.
       */

      concept: {
        type:
          String,

        trim:
          true,

        maxlength:
          120,

        default:
          "",
      },


      // ==============================
      // Vampire
      // ==============================

      sect: {
        type:
          String,

        required:
          true,

        enum:
          validSects,

        index:
          true,
      },


      clan: {
        type:
          String,

        required:
          true,

        enum:
          validClans,

        index:
          true,
      },


      // ==============================
      // Owner
      // ==============================

      ownerUser: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        default:
          null,

        index:
          true,
      },


      // ==============================
      // Approved mother House
      // ==============================

      motherHouse: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "House",

        default:
          null,

        index:
          true,
      },


      // ==============================
      // Pending mother House
      // ==============================

      pendingMotherHouse: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "House",

        default:
          null,

        index:
          true,
      },
    },

    {
      timestamps:
        true,
    }
  );


// ==============================
// Character rules
// ==============================

CharacterSchema.pre(
  "validate",
  function () {

    // ==============================
    // PC must have owner
    // ==============================

    if (
      this.type === "PC" &&
      !this.ownerUser
    ) {
      throw new Error(
        "Um PC precisa possuir um jogador responsável."
      );
    }


    // ==============================
    // NPC must have mother House
    // ==============================

    if (
      this.type === "NPC" &&
      !this.motherHouse
    ) {
      throw new Error(
        "Um NPC precisa estar vinculado a uma House."
      );
    }


    // ==============================
    // NPC cannot have owner
    // ==============================

    if (
      this.type === "NPC" &&
      this.ownerUser
    ) {
      throw new Error(
        "Um NPC não pode possuir um jogador proprietário."
      );
    }


    // ==============================
    // NPC cannot have pending House
    // ==============================

    if (
      this.type === "NPC" &&
      this.pendingMotherHouse
    ) {
      throw new Error(
        "Um NPC não pode possuir solicitação pendente de House."
      );
    }


    // ==============================
    // Cannot have approved and pending
    // ==============================

    if (
      this.motherHouse &&
      this.pendingMotherHouse
    ) {
      throw new Error(
        "Um personagem não pode possuir House aprovada e solicitação pendente ao mesmo tempo."
      );
    }
  }
);


module.exports =
  mongoose.model(
    "Character",
    CharacterSchema
  );