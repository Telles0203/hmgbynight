const ATTRIBUTE_TRAIT_CATALOG = {
  physical: {
    positive: [
      {
        value: "Brawny",
        type: "Força",
      },
      {
        value: "Brutal",
        type: "Força",
      },
      {
        value: "Ferocious",
        type: "Força",
      },
      {
        value: "Stalwart",
        type: "Força",
      },
      {
        value: "Tough",
        type: "Força",
      },
      {
        value: "Wiry",
        type: "Força",
      },

      {
        value: "Dexterous",
        type: "Destreza",
      },
      {
        value: "Graceful",
        type: "Destreza",
      },
      {
        value: "Lithe",
        type: "Destreza",
      },
      {
        value: "Nimble",
        type: "Destreza",
      },
      {
        value: "Quick",
        type: "Destreza",
      },

      {
        value: "Enduring",
        type: "Vigor",
      },
      {
        value: "Resilient",
        type: "Vigor",
      },
      {
        value: "Robust",
        type: "Vigor",
      },
      {
        value: "Rugged",
        type: "Vigor",
      },
      {
        value: "Tireless",
        type: "Vigor",
      },

      {
        value: "Agile",
        type: "Diversos",
      },
      {
        value: "Energetic",
        type: "Diversos",
      },
      {
        value: "Steady",
        type: "Diversos",
      },
      {
        value: "Tenacious",
        type: "Diversos",
      },
      {
        value: "Vigorous",
        type: "Diversos",
      },
    ],

    negative: [
      "Clumsy",
      "Cowardly",
      "Decrepit",
      "Delicate",
      "Docile",
      "Flabby",
      "Lame",
      "Lethargic",
      "Puny",
      "Sickly",
    ],
  },

  social: {
    positive: [
      {
        value: "Charismatic",
        type: "Carisma",
      },
      {
        value: "Charming",
        type: "Carisma",
      },
      {
        value: "Dignified",
        type: "Carisma",
      },
      {
        value: "Eloquent",
        type: "Carisma",
      },
      {
        value: "Expressive",
        type: "Carisma",
      },
      {
        value: "Genial",
        type: "Carisma",
      },

      {
        value: "Beguiling",
        type: "Manipulação",
      },
      {
        value: "Commanding",
        type: "Manipulação",
      },
      {
        value: "Ingratiating",
        type: "Manipulação",
      },
      {
        value: "Persuasive",
        type: "Manipulação",
      },

      {
        value: "Alluring",
        type: "Aparência",
      },
      {
        value: "Elegant",
        type: "Aparência",
      },
      {
        value: "Gorgeous",
        type: "Aparência",
      },
      {
        value: "Magnetic",
        type: "Aparência",
      },
      {
        value: "Seductive",
        type: "Aparência",
      },

      {
        value: "Diplomatic",
        type: "Diversos",
      },
      {
        value: "Empathetic",
        type: "Diversos",
      },
      {
        value: "Intimidating",
        type: "Diversos",
      },
      {
        value: "Friendly",
        type: "Diversos",
      },
      {
        value: "Witty",
        type: "Diversos",
      },
    ],

    negative: [
      "Bestial",
      "Callous",
      "Condescending",
      "Dull",
      "Feral",
      "Naive",
      "Obnoxious",
      "Repugnant",
      "Shy",
      "Tactless",
      "Untrustworthy",
    ],
  },

  mental: {
    positive: [
      {
        value: "Attentive",
        type: "Percepção",
      },
      {
        value: "Discerning",
        type: "Percepção",
      },
      {
        value: "Insightful",
        type: "Percepção",
      },
      {
        value: "Observant",
        type: "Percepção",
      },
      {
        value: "Vigilant",
        type: "Percepção",
      },

      {
        value: "Cunning",
        type: "Inteligência",
      },
      {
        value: "Disciplined",
        type: "Inteligência",
      },
      {
        value: "Knowledgeable",
        type: "Inteligência",
      },
      {
        value: "Rational",
        type: "Inteligência",
      },
      {
        value: "Reflective",
        type: "Inteligência",
      },

      {
        value: "Alert",
        type: "Raciocínio",
      },
      {
        value: "Clever",
        type: "Raciocínio",
      },
      {
        value: "Intuitive",
        type: "Raciocínio",
      },
      {
        value: "Shrewd",
        type: "Raciocínio",
      },
      {
        value: "Wily",
        type: "Raciocínio",
      },

      {
        value: "Creative",
        type: "Diversos",
      },
      {
        value: "Dedicated",
        type: "Diversos",
      },
      {
        value: "Determined",
        type: "Diversos",
      },
      {
        value: "Patient",
        type: "Diversos",
      },
      {
        value: "Wise",
        type: "Diversos",
      },
    ],

    negative: [
      "Forgetful",
      "Gullible",
      "Ignorant",
      "Impatient",
      "Oblivious",
      "Predictable",
      "Shortsighted",
      "Submissive",
      "Violent",
      "Witless",
    ],
  },
};


export function getAttributeTraitCatalog(
  category
) {
  return (
    ATTRIBUTE_TRAIT_CATALOG[
      category
    ] ||
    {
      positive:
        [],

      negative:
        [],
    }
  );
}


export function getAttributeTraitLabel(
  category,
  value
) {
  const catalog =
    getAttributeTraitCatalog(
      category
    );


  const trait =
    catalog
      .positive
      .find(
        (
          item
        ) =>
          item.value ===
          value
      );


  if (
    !trait
  ) {
    return String(
      value ||
      ""
    );
  }


  return `${trait.value} (${trait.type})`;
}


export {
  ATTRIBUTE_TRAIT_CATALOG,
};