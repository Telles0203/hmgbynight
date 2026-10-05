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

const {
  DEFAULT_MORALITY_PATH,
  MORALITY_MIN,
  MORALITY_MAX,
} = require(
  "../data/vampire/moralityPaths"
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


      /*
       * Natureza.
       *
       * Guarda referência ao catálogo.
       */

      nature: {
        type:
          String,

        trim:
          true,

        maxlength:
          120,

        default:
          "",
      },


      /*
       * Comportamento.
       *
       * Guarda referência ao mesmo
       * catálogo de Arquétipos.
       */

      demeanor: {
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
      // Morality
      // ==============================

      /*
       * Trilha de Moralidade.
       *
       * Por padrão:
       *
       * core:humanidade
       *
       * Futuramente poderão existir
       * referências próprias da Crônica.
       */

      moralityPath: {
        type:
          String,

        trim:
          true,

        maxlength:
          120,

        default:
          DEFAULT_MORALITY_PATH,
      },


      /*
       * Pontuação atual de Moralidade.
       *
       * Escala OWBN:
       *
       * 0 a 10.
       *
       * Durante a criação fica null até
       * que as Virtudes necessárias
       * tenham sido definidas.
       *
       * Nesse momento o valor inicial
       * será calculado pela soma das
       * Virtudes correspondentes.
       *
       * Após a criação, Moralidade possui
       * progressão própria e deixa de ser
       * um simples valor derivado.
       */

      moralityRating: {
        type:
          Number,

        min:
          MORALITY_MIN,

        max:
          MORALITY_MAX,

        default:
          null,
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
      // Approved mother Chronicle
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
      // Pending mother Chronicle
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
        "Um NPC precisa estar vinculado a uma Crônica."
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


    if (
      this.type === "NPC" &&
      this.pendingMotherHouse
    ) {
      throw new Error(
        "Um NPC não pode possuir solicitação pendente de Crônica."
      );
    }


    if (
      this.motherHouse &&
      this.pendingMotherHouse
    ) {
      throw new Error(
        "Um personagem não pode possuir Crônica aprovada e solicitação pendente ao mesmo tempo."
      );
    }
  }
);


module.exports =
  mongoose.model(
    "Character",
    CharacterSchema
  );