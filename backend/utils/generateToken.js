const crypto = require('crypto');

function generateEmailToken(length = 16) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789' +
    '!@#$%&*()-_=+{}[];:<>/?';

  let token = '';
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % charset.length;
    token += charset[index];
  }

  return token;
}

module.exports = generateEmailToken;