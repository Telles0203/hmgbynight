const mongoose =
  require("mongoose");


const HouseSchema =
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
          80,
      },


      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },


      plan: {
        type:
          String,

        enum: [
          "free",
        ],

        default:
          "free",
      },


      isActive: {
        type:
          Boolean,

        default:
          true,
      },
    },

    {
      timestamps:
        true,
    }
  );


// =============================================
// Indexes
// =============================================

// Ajuda na listagem e ordenação
// das Houses ativas.

HouseSchema.index({
  isActive:
    1,

  name:
    1,
});


module.exports =
  mongoose.model(
    "House",
    HouseSchema
  );