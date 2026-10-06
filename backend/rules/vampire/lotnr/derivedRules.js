const {
  CHARACTER_CREATION_RULES,
  getGenerationRules,
} = require(
  "./ruleset"
);

const {
  getCoreMoralityPathByRef,
} = require(
  "../../../data/vampire/moralityPaths"
);


function deriveGeneration(
  generationBackground
) {
  const level =
    Number(
      generationBackground
    );


  const normalizedLevel =
    Number.isInteger(
      level
    )
      ? Math.max(
          0,
          Math.min(
            CHARACTER_CREATION_RULES
              .generation
              .generationBackgroundMaximum,
            level
          )
        )
      : 0;


  const generation =
    CHARACTER_CREATION_RULES
      .generation
      .initial -
    normalizedLevel;


  return {
    generation,

    backgroundLevel:
      normalizedLevel,

    rules:
      getGenerationRules(
        generation
      ),
  };
}


function calculateBaseMorality(
  moralityPathRef,
  virtues
) {
  const moralityPath =
    getCoreMoralityPathByRef(
      moralityPathRef
    );


  if (
    !moralityPath
  ) {
    return null;
  }


  const [
    firstVirtue,
    secondVirtue,
  ] =
    moralityPath
      .moralityVirtues;


  const firstValue =
    Number(
      virtues?.[
        firstVirtue
      ]
    );


  const secondValue =
    Number(
      virtues?.[
        secondVirtue
      ]
    );


  if (
    !Number.isFinite(
      firstValue
    ) ||
    !Number.isFinite(
      secondValue
    )
  ) {
    return null;
  }


  return (
    firstValue +
    secondValue
  );
}


function deriveMorality(
  character,
  creation
) {
  const base =
    calculateBaseMorality(
      character?.moralityPath,
      character?.virtues
    );


  const adjustmentRaw =
    Number(
      creation
        ?.moralityAdjustment
    );


  const adjustment =
    Number.isInteger(
      adjustmentRaw
    )
      ? adjustmentRaw
      : 0;


  if (
    base ===
    null
  ) {
    return {
      base:
        null,

      adjustment,

      value:
        null,

      valid:
        false,

      error:
        "Não foi possível calcular a Moralidade a partir das Virtudes.",
    };
  }


  const value =
    base +
    adjustment;


  const minimum =
    CHARACTER_CREATION_RULES
      .morality
      .minimum;


  const maximum =
    CHARACTER_CREATION_RULES
      .morality
      .maximum;


  const valid =
    value >=
      minimum &&
    value <=
      maximum;


  return {
    base,

    adjustment,

    value,

    minimum,

    maximum,

    purchasedTraits:
      Math.max(
        0,
        adjustment
      ),

    sacrificedTraits:
      Math.max(
        0,
        -adjustment
      ),

    valid,

    error:
      valid
        ? null
        : `A Moralidade deve permanecer entre ${minimum} e ${maximum}.`,
  };
}


function deriveWillpower(
  generationRules,
  creation
) {
  if (
    !generationRules
  ) {
    return {
      value:
        null,

      start:
        null,

      maximum:
        null,

      bonusTraits:
        0,

      valid:
        false,

      error:
        "Não foi possível determinar a Força de Vontade para esta Geração.",
    };
  }


  const bonusRaw =
    Number(
      creation
        ?.willpowerBonus
    );


  const bonusTraits =
    Number.isInteger(
      bonusRaw
    )
      ? Math.max(
          0,
          bonusRaw
        )
      : 0;


  const value =
    generationRules
      .willpowerStart +
    bonusTraits;


  const valid =
    value <=
    generationRules
      .willpowerMaximum;


  return {
    value,

    start:
      generationRules
        .willpowerStart,

    maximum:
      generationRules
        .willpowerMaximum,

    bonusTraits,

    valid,

    error:
      valid
        ? null
        : `A Força de Vontade não pode ultrapassar ${generationRules.willpowerMaximum} nesta Geração.`,
  };
}


function deriveBlood(
  generationRules,
  creation
) {
  if (
    !generationRules
  ) {
    return {
      current:
        null,

      maximum:
        null,

      perTurn:
        null,

      valid:
        false,

      error:
        "Não foi possível determinar os limites de Sangue.",
    };
  }


  const rawCurrent =
    creation
      ?.bloodCurrent;


  const current =
    rawCurrent ===
      null ||
    rawCurrent ===
      undefined ||
    rawCurrent ===
      ""
      ? null
      : Number(
          rawCurrent
        );


  const validCurrent =
    current ===
      null ||
    (
      Number.isInteger(
        current
      ) &&
      current >=
        0 &&
      current <=
        generationRules
          .bloodMaximum
    );


  return {
    current,

    maximum:
      generationRules
        .bloodMaximum,

    perTurn:
      generationRules
        .bloodPerTurn,

    valid:
      validCurrent,

    error:
      validCurrent
        ? null
        : `O Sangue atual deve ficar entre 0 e ${generationRules.bloodMaximum}.`,
  };
}


module.exports = {
  deriveGeneration,
  calculateBaseMorality,
  deriveMorality,
  deriveWillpower,
  deriveBlood,
};