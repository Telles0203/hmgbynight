const mongoose = require("mongoose");

const HouseMemberSchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
     * Papel principal do usuário dentro da House.
     */
    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "narrator",
        "member",
      ],
      default: "member",
    },

    /*
     * Permissões específicas.
     * Poderemos expandir depois.
     */
    permissions: {
      canManageHouse: {
        type: Boolean,
        default: false,
      },

      canManageMembers: {
        type: Boolean,
        default: false,
      },

      canManageCharacters: {
        type: Boolean,
        default: false,
      },

      canControlNpcs: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * O mesmo usuário não pode possuir
 * dois vínculos com a mesma House.
 */
HouseMemberSchema.index(
  {
    house: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "HouseMember",
  HouseMemberSchema
);