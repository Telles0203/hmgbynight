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

const {
  VIRTUE_MIN,
  VIRTUE_MAX,
} = require(
  "../data/vampire/virtues"
);

const {
  CHARACTER_NAME_MIN_LENGTH,
  CHARACTER_NAME_MAX_LENGTH,
  CHARACTER_TITLE_MAX_LENGTH,
  CHARACTER_CONCEPT_MAX_LENGTH,
} = require(
  "../data/characterLimits"
);

const {
  CHARACTER_SHEET_LIFECYCLE_VALUES,
  DEFAULT_CHARACTER_SHEET_LIFECYCLE,
} = require(
  "../data/characterSheetLifecycle"
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
          CHARACTER_NAME_MIN_LENGTH,

        maxlength:
          CHARACTER_NAME_MAX_LENGTH,
      },

      title: {
        type:
          String,

        trim:
          true,

        maxlength:
          CHARACTER_TITLE_MAX_LENGTH,

        default:
          "",
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

      sheetLifecycle: {
        type:
          String,

        enum:
          CHARACTER_SHEET_LIFECYCLE_VALUES,

        default:
          DEFAULT_CHARACTER_SHEET_LIFECYCLE,

        index:
          true,
      },

      concept: {
        type:
          String,

        trim:
          true,

        maxlength:
          CHARACTER_CONCEPT_MAX_LENGTH,

        default:
          "",
      },

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

      virtues: {
        conscience: {
          type:
            Number,

          min:
            VIRTUE_MIN,

          max:
            VIRTUE_MAX,

          default:
            null,
        },

        conviction: {
          type:
            Number,

          min:
            VIRTUE_MIN,

          max:
            VIRTUE_MAX,

          default:
            null,
        },

        selfControl: {
          type:
            Number,

          min:
            VIRTUE_MIN,

          max:
            VIRTUE_MAX,

          default:
            null,
        },

        instinct: {
          type:
            Number,

          min:
            VIRTUE_MIN,

          max:
            VIRTUE_MAX,

          default:
            null,
        },

        courage: {
          type:
            Number,

          min:
            VIRTUE_MIN,

          max:
            VIRTUE_MAX,

          default:
            null,
        },
      },

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


CharacterSchema.pre(
  "validate",
  function () {
    if (
      this.type ===
        "PC" &&
      !this.ownerUser
    ) {
      throw new Error(
        "Um PC precisa possuir um jogador responsável."
      );
    }


    if (
      this.type ===
        "NPC" &&
      !this.motherHouse
    ) {
      throw new Error(
        "Um NPC precisa estar vinculado a uma Crônica."
      );
    }


    if (
      this.type ===
        "NPC" &&
      this.ownerUser
    ) {
      throw new Error(
        "Um NPC não pode possuir um jogador proprietário."
      );
    }


    if (
      this.type ===
        "NPC" &&
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


    const conscience =
      this.virtues
        ?.conscience;


    const conviction =
      this.virtues
        ?.conviction;


    const selfControl =
      this.virtues
        ?.selfControl;


    const instinct =
      this.virtues
        ?.instinct;


    if (
      Number.isFinite(
        conscience
      ) &&
      Number.isFinite(
        conviction
      )
    ) {
      throw new Error(
        "Um personagem não pode possuir Consciência e Convicção ao mesmo tempo."
      );
    }


    if (
      Number.isFinite(
        selfControl
      ) &&
      Number.isFinite(
        instinct
      )
    ) {
      throw new Error(
        "Um personagem não pode possuir Autocontrole e Instinto ao mesmo tempo."
      );
    }
  }
);


module.exports =
  mongoose.model(
    "Character",
    CharacterSchema
  );