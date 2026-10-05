const crypto = require(
  "crypto"
);


const EMAIL_TOKEN_LENGTH = 10;

const EMAIL_TOKEN_EXPIRATION_MINUTES =
  10;

const EMAIL_TOKEN_RESEND_SECONDS =
  60;


const TOKEN_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


function generateEmailVerificationToken(
  length = EMAIL_TOKEN_LENGTH
) {
  const safeLength =
    Number(length);


  if (
    !Number.isInteger(
      safeLength
    ) ||
    safeLength < 1 ||
    safeLength > 128
  ) {
    throw new Error(
      "Tamanho inválido para token de verificação."
    );
  }


  let token = "";


  for (
    let index = 0;
    index < safeLength;
    index += 1
  ) {
    const characterIndex =
      crypto.randomInt(
        0,
        TOKEN_CHARACTERS.length
      );


    token +=
      TOKEN_CHARACTERS[
        characterIndex
      ];
  }


  return token;
}


function hashEmailVerificationToken(
  token
) {
  const cleanToken =
    String(
      token || ""
    ).trim();


  if (!cleanToken) {
    throw new Error(
      "Token de verificação não informado."
    );
  }


  return crypto
    .createHash(
      "sha256"
    )
    .update(
      cleanToken,
      "utf8"
    )
    .digest(
      "hex"
    );
}


function isEmailVerificationTokenHash(
  value
) {
  return /^[a-f0-9]{64}$/.test(
    String(
      value || ""
    )
  );
}


function createEmailVerificationExpiration() {
  return new Date(
    Date.now() +
      EMAIL_TOKEN_EXPIRATION_MINUTES *
        60 *
        1000
  );
}


module.exports = {
  EMAIL_TOKEN_LENGTH,
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  EMAIL_TOKEN_RESEND_SECONDS,

  generateEmailVerificationToken,
  hashEmailVerificationToken,
  isEmailVerificationTokenHash,
  createEmailVerificationExpiration,
};