const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  RULESET_ID,
  CHARACTER_CREATION_RULES,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
  getGenerationRules,
  createEmptyCharacterCreationState,
} = require(
  "../../backend/rules/vampire/lotnr/ruleset"
);

const {
  DEFAULT_MORALITY_PATH,
  calculateStartingMorality,
} = require(
  "../../backend/data/vampire/moralityPaths"
);

const {
  getStartingVirtueValues,
} = require(
  "../../backend/data/vampire/virtues"
);

const {
  validateAttributes,
  validateAbilities,
  validateDisciplines,
  validateBackgrounds,
  validateVirtues,
} = require(
  "../../backend/rules/vampire/lotnr/allocationRules"
);

const {
  deriveGeneration,
  deriveMorality,
  deriveWillpower,
  deriveBlood,
} = require(
  "../../backend/rules/vampire/lotnr/derivedRules"
);

const {
  calculateFreeTraitBudget,
} = require(
  "../../backend/rules/vampire/lotnr/freeTraits"
);

const {
  validateCharacterCreation,
} = require(
  "../../backend/rules/vampire/lotnr/validation"
);


function createCharacter(
  overrides = {}
) {
  return {
    sect:
      "camarilla",

    clan:
      "brujah",

    moralityPath:
      DEFAULT_MORALITY_PATH,

    virtues: {
      conscience:
        3,

      selfControl:
        3,

      courage:
        4,

      conviction:
        null,

      instinct:
        null,
    },

    creation: {
      ...createEmptyCharacterCreationState(),

      attributePriorities: {
        primary:
          "physical",

        secondary:
          "mental",

        tertiary:
          "social",
      },

      attributes: {
        physical: [
          "Brawny",
          "Quick",
          "Quick",
          "Enduring",
          "Athletic",
          "Steady",
          "Wiry",
        ],

        mental: [
          "Alert",
          "Observant",
          "Disciplined",
          "Determined",
          "Clever",
        ],

        social: [
          "Intimidating",
          "Persuasive",
          "Magnetic",
        ],
      },

      abilities: {
        brawl:
          1,

        firearms:
          1,

        dodge:
          1,

        empathy:
          1,

        streetwise:
          1,
      },

      disciplines: {
        celerity:
          1,

        potence:
          1,

        presence:
          1,
      },

      backgrounds: {
        generation:
          0,

        allies:
          1,

        contacts:
          1,

        resources:
          1,

        mentor:
          1,

        herd:
          1,
      },

      meritPoints:
        5,
    },

    ...overrides,
  };
}


test(
  "ruleset defines Laws of the Night Revised core pools",
  () => {
    assert.equal(
      RULESET_ID,
      "laws_of_the_night_revised"
    );


    assert.deepEqual(
      CHARACTER_CREATION_RULES
        .attributes,
      {
        primary:
          7,

        secondary:
          5,

        tertiary:
          3,

        total:
          15,
      }
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .abilities
        .total,
      5
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .virtues
        .total,
      7
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .morality
        .maximum,
      10
    );


    assert.equal(
      CHARACTER_CREATION_RULES
        .freeTraits
        .base,
      5
    );
  }
);


test(
  "Sabbat receives four Discipline Traits and no free Background Traits",
  () => {
    assert.equal(
      getInitialDisciplineTotal(
        "sabbat"
      ),
      4
    );


    assert.equal(
      getInitialBackgroundTotal(
        "sabbat"
      ),
      0
    );


    assert.equal(
      getInitialDisciplineTotal(
        "camarilla"
      ),
      3
    );


    assert.equal(
      getInitialBackgroundTotal(
        "camarilla"
      ),
      5
    );
  }
);


test(
  "generation table returns blood Willpower and limits",
  () => {
    assert.deepEqual(
      getGenerationRules(
        13
      ),
      {
        generation:
          13,

        maximumAttributeTraits:
          10,

        maximumAbilityLevel:
          5,

        bloodMaximum:
          10,

        bloodPerTurn:
          1,

        willpowerStart:
          2,

        willpowerMaximum:
          6,
      }
    );


    assert.equal(
      getGenerationRules(
        8
      ).bloodMaximum,
      15
    );


    assert.equal(
      getGenerationRules(
        8
      ).bloodPerTurn,
      3
    );
  }
);


test(
  "Generation Background lowers generation from thirteen",
  () => {
    assert.equal(
      deriveGeneration(
        0
      ).generation,
      13
    );


    assert.equal(
      deriveGeneration(
        3
      ).generation,
      10
    );


    assert.equal(
      deriveGeneration(
        5
      ).generation,
      8
    );
  }
);


test(
  "attribute priorities validate seven five three distribution",
  () => {
    const character =
      createCharacter();


    const generation =
      deriveGeneration(
        0
      );


    const attributes =
      validateAttributes(
        character.creation,
        generation.rules
      );


    assert.equal(
      attributes.points.total,
      15
    );


    assert.equal(
      attributes.points.spent,
      15
    );


    assert.equal(
      attributes.complete,
      true
    );


    assert.equal(
      attributes.extraTraits,
      0
    );
  }
);


test(
  "additional Attributes are tracked as Free Trait spending",
  () => {
    const character =
      createCharacter();


    character.creation
      .attributes
      .social
      .push(
        "Commanding"
      );


    const generation =
      deriveGeneration(
        0
      );


    const attributes =
      validateAttributes(
        character.creation,
        generation.rules
      );


    assert.equal(
      attributes.complete,
      true
    );


    assert.equal(
      attributes.extraTraits,
      1
    );
  }
);


test(
  "Ability level cannot exceed generation maximum",
  () => {
    const character =
      createCharacter();


    character.creation
      .abilities
      .brawl =
        6;


    const generation =
      deriveGeneration(
        0
      );


    const abilities =
      validateAbilities(
        character,
        character.creation,
        generation.rules
      );


    assert.equal(
      abilities.errors.length >
        0,
      true
    );
  }
);


test(
  "Ability specializations require the Ability",
  () => {
    const character =
      createCharacter();


    character.creation
      .specializations = {
        occult:
          "Vampires",
      };


    const generation =
      deriveGeneration(
        0
      );


    const abilities =
      validateAbilities(
        character,
        character.creation,
        generation.rules
      );


    assert.equal(
      abilities.errors.length,
      1
    );
  }
);


test(
  "out of clan Discipline is marked for approval",
  () => {
    const character =
      createCharacter();


    character.creation
      .disciplines = {
        celerity:
          1,

        potence:
          1,

        thaumaturgy:
          1,
      };


    const disciplines =
      validateDisciplines(
        character,
        character.creation
      );


    assert.deepEqual(
      disciplines
        .requiresApproval,
      [
        "thaumaturgy",
      ]
    );


    assert.equal(
      disciplines.complete,
      true
    );
  }
);


test(
  "Background Generation obeys five Trait maximum",
  () => {
    const character =
      createCharacter();


    character.creation
      .backgrounds
      .generation =
        6;


    const backgrounds =
      validateBackgrounds(
        character,
        character.creation
      );


    assert.equal(
      backgrounds.errors.length >
        0,
      true
    );
  }
);


test(
  "Humanity is the sum of Conscience and Self Control",
  () => {
    assert.equal(
      calculateStartingMorality(
        DEFAULT_MORALITY_PATH,
        {
          conscience:
            2,

          selfControl:
            3,
        }
      ),
      5
    );


    assert.equal(
      calculateStartingMorality(
        DEFAULT_MORALITY_PATH,
        {
          conscience:
            4,

          selfControl:
            2,
        }
      ),
      6
    );


    assert.equal(
      calculateStartingMorality(
        DEFAULT_MORALITY_PATH,
        {
          conscience:
            5,

          selfControl:
            5,
        }
      ),
      10
    );
  }
);


test(
  "Virtue allocation supports seven base Traits and Free Trait extras",
  () => {
    const character =
      createCharacter();


    const virtues =
      validateVirtues(
        character
      );


    assert.equal(
      virtues.distributed,
      7
    );


    assert.equal(
      virtues.extraTraits,
      0
    );


    assert.equal(
      virtues.complete,
      true
    );


    character.virtues.courage =
      5;


    const withExtra =
      validateVirtues(
        character
      );


    assert.equal(
      withExtra.extraTraits,
      1
    );
  }
);


test(
  "Willpower begins and caps according to generation",
  () => {
    const generation =
      deriveGeneration(
        3
      );


    const base =
      deriveWillpower(
        generation.rules,
        {
          willpowerBonus:
            0,
        }
      );


    assert.equal(
      base.start,
      4
    );


    assert.equal(
      base.maximum,
      10
    );


    const invalid =
      deriveWillpower(
        generation.rules,
        {
          willpowerBonus:
            7,
        }
      );


    assert.equal(
      invalid.valid,
      false
    );
  }
);


test(
  "Blood Pool and Blood per turn come from generation",
  () => {
    const generation =
      deriveGeneration(
        4
      );


    const blood =
      deriveBlood(
        generation.rules,
        {
          bloodCurrent:
            14,
        }
      );


    assert.equal(
      generation.generation,
      9
    );


    assert.equal(
      blood.maximum,
      14
    );


    assert.equal(
      blood.perTurn,
      2
    );


    assert.equal(
      blood.valid,
      true
    );
  }
);


test(
  "Free Trait engine calculates sources costs and remainder",
  () => {
    const character =
      createCharacter();


    const generation =
      deriveGeneration(
        0
      );


    const attributes =
      validateAttributes(
        character.creation,
        generation.rules
      );


    const abilities =
      validateAbilities(
        character,
        character.creation,
        generation.rules
      );


    const disciplines =
      validateDisciplines(
        character,
        character.creation
      );


    const backgrounds =
      validateBackgrounds(
        character,
        character.creation
      );


    const virtues =
      validateVirtues(
        character
      );


    const morality =
      deriveMorality(
        character,
        character.creation
      );


    const willpower =
      deriveWillpower(
        generation.rules,
        character.creation
      );


    const freeTraits =
      calculateFreeTraitBudget({
        creation:
          character.creation,

        attributes,
        abilities,
        disciplines,
        backgrounds,
        virtues,
        morality,
        willpower,
      });


    assert.equal(
      freeTraits.available,
      5
    );


    assert.equal(
      freeTraits.spent,
      5
    );


    assert.equal(
      freeTraits.remaining,
      0
    );


    assert.equal(
      freeTraits.complete,
      true
    );
  }
);


test(
  "selling one Morality Trait adds two Free Traits",
  () => {
    const character =
      createCharacter();


    character.creation
      .moralityAdjustment =
        -1;


    const result =
      validateCharacterCreation(
        character
      );


    assert.equal(
      result
        .sections
        .morality
        .sacrificedTraits,
      1
    );


    assert.equal(
      result
        .freeTraits
        .sources
        .moralitySacrifice,
      2
    );
  }
);


test(
  "complete character creation passes central validation",
  () => {
    const result =
      validateCharacterCreation(
        createCharacter()
      );


    assert.equal(
      result
        .validation
        .valid,
      true
    );


    assert.equal(
      result
        .validation
        .complete,
      true
    );


    assert.deepEqual(
      result
        .validation
        .incompleteSections,
      []
    );
  }
);


test(
  "incomplete character reports exact sections",
  () => {
    const character =
      createCharacter();


    character.creation
      .attributes
      .physical =
        [];


    character.creation
      .abilities =
        {};


    const result =
      validateCharacterCreation(
        character
      );


    assert.equal(
      result
        .validation
        .complete,
      false
    );


    assert.equal(
      result
        .validation
        .incompleteSections
        .includes(
          "attributes"
        ),
      true
    );


    assert.equal(
      result
        .validation
        .incompleteSections
        .includes(
          "abilities"
        ),
      true
    );
  }
);
