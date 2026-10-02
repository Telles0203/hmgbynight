const CLAN_OPTIONS = Object.freeze([
  // ==============================
  // Clans
  // ==============================

  {
    value: "assamite",
    label: "Assamite",
  },
  {
    value: "banu_haqim",
    label: "Banu Haqim",
  },
  {
    value: "brujah",
    label: "Brujah",
  },
  {
    value: "caitiff",
    label: "Caitiff",
  },
  {
    value: "followers_of_set",
    label: "Followers of Set",
  },
  {
    value: "gangrel",
    label: "Gangrel",
  },
  {
    value: "giovanni",
    label: "Giovanni",
  },
  {
    value: "lasombra",
    label: "Lasombra",
  },
  {
    value: "malkavian",
    label: "Malkavian",
  },
  {
    value: "nosferatu",
    label: "Nosferatu",
  },
  {
    value: "ravnos",
    label: "Ravnos",
  },
  {
    value: "salubri",
    label: "Salubri",
  },
  {
    value: "toreador",
    label: "Toreador",
  },
  {
    value: "tremere",
    label: "Tremere",
  },
  {
    value: "tzimisce",
    label: "Tzimisce",
  },
  {
    value: "ventrue",
    label: "Ventrue",
  },

  // ==============================
  // Bloodlines / variations
  // ==============================

  {
    value: "ahrimanes",
    label: "Ahrimanes",
  },
  {
    value: "al_amin",
    label: "Al-Amin",
  },
  {
    value: "anda",
    label: "Anda",
  },
  {
    value: "angellis_ater",
    label: "Angellis Ater / Azaneal",
  },
  {
    value: "baali",
    label: "Baali",
  },
  {
    value: "banshee",
    label: "Banshee",
  },
  {
    value: "bayt_mainoon",
    label: "Bay't Mainoon",
  },
  {
    value: "bayt_muirim",
    label: "Bay't Muirim",
  },
  {
    value: "bayt_mushakis",
    label: "Bay't Mushakis",
  },
  {
    value: "bayt_mutashard",
    label: "Bay't Mutashard",
  },
  {
    value: "blood_brothers",
    label: "Blood Brothers",
  },
  {
    value: "brahman_ravnos",
    label: "Brahman Ravnos",
  },
  {
    value: "bushi",
    label: "Bushi",
  },
  {
    value: "cappadocian",
    label: "Cappadocian",
  },
  {
    value: "children_of_osiris",
    label: "Children of Osiris",
  },
  {
    value: "city_gangrel",
    label: "City Gangrel",
  },
  {
    value: "country_gangrel",
    label: "Country Gangrel",
  },
  {
    value: "daitya",
    label: "Daitya",
  },
  {
    value: "danava",
    label: "Danava",
  },
  {
    value: "daughters_of_cacophony",
    label: "Daughters of Cacophony",
  },
  {
    value: "dispassionate",
    label: "Dispassionate",
  },
  {
    value: "drakaina",
    label: "Drakaina",
  },
  {
    value: "epicene",
    label: "Epicene",
  },
  {
    value: "gaki",
    label: "Gaki",
  },
  {
    value: "gargoyle",
    label: "Gargoyle",
  },
  {
    value: "greek_gangrel",
    label: "Greek Gangrel",
  },
  {
    value: "harbingers_of_skulls",
    label: "Harbingers of Skulls",
  },
  {
    value: "kairos",
    label: "Kairos",
  },
  {
    value: "kiasyd",
    label: "Kiasyd",
  },
  {
    value: "lamia",
    label: "Lamia",
  },
  {
    value: "lhiannan",
    label: "Lhiannan",
  },
  {
    value: "maeghar",
    label: "Maeghar",
  },
  {
    value: "mariner_gangrel",
    label: "Mariner Gangrel",
  },
  {
    value: "nagaraja",
    label: "Nagaraja",
  },
  {
    value: "nephilim",
    label: "Nephilim",
  },
  {
    value: "niktuku",
    label: "Niktuku",
  },
  {
    value: "noiad",
    label: "Noiad",
  },
  {
    value: "old_clan_tzimisce",
    label: "Old Clan Tzimisce",
  },
  {
    value: "pander",
    label: "Pander",
  },
  {
    value: "qabilat_al_khayal",
    label: "Qabilat Al-Khayal",
  },
  {
    value: "qabilat_al_mawt",
    label: "Qabilat Al-Mawt",
  },
  {
    value: "ravenous",
    label: "Ravenous",
  },
  {
    value: "rayeen_al_fen",
    label: "Ray'een Al-Fen",
  },
  {
    value: "renascut",
    label: "Renascut",
  },
  {
    value: "samedi",
    label: "Samedi",
  },
  {
    value: "santero_santos",
    label: "Santero / Santos",
  },
  {
    value: "serpents_of_the_light",
    label: "Serpents of the Light",
  },
  {
    value: "ogun",
    label: "Ogun",
  },
  {
    value: "telyavelic_tremere",
    label: "Telyavelic Tremere",
  },
  {
    value: "tlacique",
    label: "Tlacique",
  },
  {
    value: "trimira",
    label: "Trimira",
  },
  {
    value: "true_brujah",
    label: "True Brujah",
  },
  {
    value: "tryphosan",
    label: "Tryphosan",
  },
  {
    value: "wah_sheen",
    label: "Wah'Sheen",
  },
  {
    value: "walid_set",
    label: "Walid Set / Hajj",
  },
  {
    value: "wu_zao",
    label: "Wu Zao",
  },

  // ==============================
  // Laibon
  // ==============================

  {
    value: "akunanse",
    label: "Akunanse",
  },
  {
    value: "bonsam",
    label: "Bonsam",
  },
  {
    value: "guruhi",
    label: "Guruhi",
  },
  {
    value: "impundulu",
    label: "Impundulu",
  },
  {
    value: "ishtarri",
    label: "Ishtarri",
  },
  {
    value: "kinyonyi",
    label: "Kinyonyi",
  },
  {
    value: "mla_watu",
    label: "Mla Watu",
  },
  {
    value: "naglopers",
    label: "Naglopers",
  },
  {
    value: "nkulu_zao",
    label: "Nkulu Zao",
  },
  {
    value: "osebo",
    label: "Osebo",
  },
  {
    value: "ramanga",
    label: "Ramanga",
  },
  {
    value: "shango",
    label: "Shango",
  },
  {
    value: "xi_dundu",
    label: "Xi Dundu",
  },
]);

function isValidClan(clan) {
  return CLAN_OPTIONS.some(
    (option) =>
      option.value === clan
  );
}

function getClanOption(clan) {
  return (
    CLAN_OPTIONS.find(
      (option) =>
        option.value === clan
    ) || null
  );
}

module.exports = {
  CLAN_OPTIONS,
  isValidClan,
  getClanOption,
};