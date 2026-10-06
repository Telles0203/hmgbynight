const {
  CHARACTER_CREATION_RULES,
  getInitialDisciplineTotal,
  getInitialBackgroundTotal,
} = require(
  "../ruleset"
);

const {
  isCoreDiscipline,
  isCoreBackground,
  isClanDiscipline,
} = require(
  "../catalogs"
);

const {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
} = require(
  "./allocationHelpers"
);


function validateDisciplines(
  character,
  creation
) {
  const disciplines =
    normalizeLevelMap(
      creation?.disciplines
    );


  const errors =
    [];


  const requiresApproval =
    [];


  let totalLevels =
    0;


  Object.entries(
    disciplines
  ).forEach(
    ([
      discipline,
      level,
    ]) => {
      if (
        level <
          0 ||
        level >
          CHARACTER_CREATION_RULES
            .disciplines
            .maximumLevelDuringCreation
      ) {
        errors.push(
          `${discipline} deve possuir entre 0 e ${CHARACTER_CREATION_RULES.disciplines.maximumLevelDuringCreation} níveis durante a criação.`
        );
      }


      if (
        level >
        0
      ) {
        if (
          !isCoreDiscipline(
            discipline
          ) ||
          !isClanDiscipline(
            character?.clan,
            discipline
          )
        ) {
          requiresApproval.push(
            discipline
          );
        }
      }


      totalLevels +=
        Math.max(
          0,
          level
        );
    }
  );


  const initialTotal =
    getInitialDisciplineTotal(
      character?.sect
    );


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        totalLevels,
        initialTotal
      )
    );


  return {
    key:
      "disciplines",

    label:
      "Disciplinas",

    disciplines,

    totalLevels,

    initialTotal,

    extraTraits:
      Math.max(
        0,
        totalLevels -
          initialTotal
      ),

    requiresApproval: [
      ...new Set(
        requiresApproval
      ),
    ],

    points,

    errors,

    complete:
      points.complete &&
      errors.length ===
        0,
  };
}


function validateBackgrounds(
  character,
  creation
) {
  const backgrounds =
    normalizeLevelMap(
      creation?.backgrounds
    );


  const errors =
    [];


  const requiresApproval =
    [];


  let totalLevels =
    0;


  Object.entries(
    backgrounds
  ).forEach(
    ([
      background,
      level,
    ]) => {
      if (
        level <
          0 ||
        level >
          CHARACTER_CREATION_RULES
            .backgrounds
            .maximumPerBackground
      ) {
        errors.push(
          `${background} deve possuir entre 0 e ${CHARACTER_CREATION_RULES.backgrounds.maximumPerBackground} níveis.`
        );
      }


      if (
        level >
          0 &&
        !isCoreBackground(
          background
        )
      ) {
        requiresApproval.push(
          background
        );
      }


      totalLevels +=
        Math.max(
          0,
          level
        );
    }
  );


  const initialTotal =
    getInitialBackgroundTotal(
      character?.sect
    );


  const points =
    createPointProgress(
      initialTotal,
      Math.min(
        totalLevels,
        initialTotal
      )
    );


  return {
    key:
      "backgrounds",

    label:
      "Antecedentes",

    backgrounds,

    totalLevels,

    initialTotal,

    extraTraits:
      Math.max(
        0,
        totalLevels -
          initialTotal
      ),

    generationBackground:
      Math.max(
        0,
        normalizeInteger(
          backgrounds.generation
        )
      ),

    requiresApproval: [
      ...new Set(
        requiresApproval
      ),
    ],

    points,

    errors,

    complete:
      points.complete &&
      errors.length ===
        0,
  };
}


module.exports = {
  validateDisciplines,
  validateBackgrounds,
};