const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 40,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Nunca retorna automaticamente
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    isEmailValid: {
      type: Boolean,
      default: false,
    },

    // Nunca retorna automaticamente
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    // Nunca retorna automaticamente
    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
        delete returnedObject.emailVerificationToken;
        delete returnedObject.emailVerificationExpires;

        return returnedObject;
      },
    },

    toObject: {
      transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
        delete returnedObject.emailVerificationToken;
        delete returnedObject.emailVerificationExpires;

        return returnedObject;
      },
    },
  }
);

module.exports = mongoose.model(
  "User",
  UserSchema
);