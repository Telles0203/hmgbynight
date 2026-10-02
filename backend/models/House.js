const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    /*
     * Usuário que criou a House.
     * Não significa necessariamente que será
     * o único administrador no futuro.
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
     * Podemos usar este campo futuramente
     * para planos Free / Premium.
     */
    plan: {
      type: String,
      enum: ["free"],
      default: "free",
    },

    /*
     * Mantemos a House ativa por padrão.
     * Isso ajuda futuramente se quisermos
     * desativar sem excluir.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "House",
  HouseSchema
);