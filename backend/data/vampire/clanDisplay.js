const {
  SECTS,
} = require("./sects");

const {
  getClanOption,
} = require("./clans");

// ==============================
// Clan display rules
// ==============================

function shouldUseAt(
  sect,
  clan
) {
  /*
   * Por enquanto estamos registrando
   * apenas as regras já definidas.
   *
   * Depois podemos ampliar esta função
   * para os demais clãs e linhagens.
   */

  if (
    clan === "ventrue" &&
    sect === SECTS.SABBAT
  ) {
    return true;
  }

  if (
    clan === "lasombra" &&
    sect !== SECTS.SABBAT
  ) {
    return true;
  }

  return false;
}

// ==============================
// Display name
// ==============================

function getClanDisplayName(
  sect,
  clan
) {
  const clanOption =
    getClanOption(clan);

  if (!clanOption) {
    return "";
  }

  if (
    shouldUseAt(
      sect,
      clan
    )
  ) {
    return `${clanOption.label} AT`;
  }

  return clanOption.label;
}

module.exports = {
  getClanDisplayName,
  shouldUseAt,
};