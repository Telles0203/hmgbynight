const SECTS = Object.freeze({
  ANARCH: "anarch",
  ASHIRRA: "ashirra",
  CAMARILLA: "camarilla",
  INCONNU: "inconnu",
  INDEPENDENT: "independent",
  JATI: "jati",
  LAIBON: "laibon",
  SABBAT: "sabbat",
});

const SECT_OPTIONS = Object.freeze([
  {
    value: SECTS.ANARCH,
    label: "Anarch",
  },
  {
    value: SECTS.ASHIRRA,
    label: "Ashirra",
  },
  {
    value: SECTS.CAMARILLA,
    label: "Camarilla",
  },
  {
    value: SECTS.INCONNU,
    label: "Inconnu",
  },
  {
    value: SECTS.INDEPENDENT,
    label: "Independent",
  },
  {
    value: SECTS.JATI,
    label: "Jati",
  },
  {
    value: SECTS.LAIBON,
    label: "Laibon",
  },
  {
    value: SECTS.SABBAT,
    label: "Sabbat",
  },
]);

function isValidSect(sect) {
  return SECT_OPTIONS.some(
    (option) =>
      option.value === sect
  );
}

module.exports = {
  SECTS,
  SECT_OPTIONS,
  isValidSect,
};