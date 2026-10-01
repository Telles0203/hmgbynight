const crypto = require("crypto");

function generateEmailToken(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let token = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, chars.length);
    token += chars[index];
  }

  return token;
}

module.exports = generateEmailToken;