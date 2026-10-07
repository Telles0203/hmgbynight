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
  INFLUENCE_AREAS,
  getCoreBackground,
} = require(
  "../../../../data/vampire/backgrounds"
);

const {
  resolveClanResourceGrants,
} = require(
  "../clanBackgroundInfluenceGrants"
);

const {
  normalizeInteger,
  normalizeLevelMap,
  createPointProgress,
} = require(
  "./allocationHelpers"
);


function addLevelMaps(
  first,
  second
) {
  const result = {
    ...first,
  };


  Object.entries(
    second
  ).forEach(
    ([
      key,
      level,
    ]) => {
      result[
        key
      ] =
        (
          result[
            key
          ] ||
          0
        ) +
        Math.max(
          0,
          Number(
            level
          ) ||
          0
        );
    }
  );


  return result;
}


function sumLevels(
  values
) {
  return Object.values(
    values
  ).reduce(
    (
      total,
      level
    ) =>
      total +
      Math.max(
        0,
        Number(
          level
        ) ||
        0
      ),
    0
  );
}


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


  const influences =
    normalizeLevelMap(
      creation?.influences
    );


  const clanGrants =
    resolveClanResourceGrants(
      character?.clan,
      creation
        ?.clanGrantChoices
        ?.backgroundInfluence
    );


  const grantedBackgrounds =
    normalizeLevelMap(
      clanGrants.backgrounds
    );


  const grantedInfluences =
    normalizeLevelMap(
      clanGrants.influences
    );


  const effectiveBackgrounds =
    addLevelMaps(
      grantedBackgrounds,
      backgrounds
    );


  const effectiveInfluences =
    addLevelMaps(
      grantedInfluences,
      influences
    );


  const errors =
    [];


  const requiresApproval =
    [];


  Object.entries(
    backgrounds
  ).forEach(
    ([
      background,
      level,
    ]) => {
      if (
        level <
          0
      ) {
        errors.push(
          `${background} possui nível inválido.`
        );
      }


      if (
        level <=
        0
      ) {
        return;
      }


      const option =
        getCoreBackground(
          background
        );


      if (
        !isCoreBackground(
          background
        ) ||
        option
          ?.requiresNarratorApproval ===
          true
      ) {
        requiresApproval.push(
          background
        );
      }
    }
  );


  Object.entries(
    influences
  ).forEach(
    ([
      influence,
      level,
    ]) => {
      if (
        !INFLUENCE_AREAS.includes(
          influence
        )
      ) {
        errors.push(
          `${influence} não é uma área válida de Influência.`
        );
      }


      if (
        level <
          0
      ) {
        errors.push(
          `${influence} possui nível de Influência inválido.`
        );
      }
    }
  );


  Object.entries(
    effectiveBackgrounds
  ).forEach(
    ([
      background,
      level,
    ]) => {
      if (
        level >
          CHARACTER_CREATION_RULES
            .backgrounds
            .maximumPerBackground
      ) {
        errors.push(
          `${background} deve possuir no máximo ${CHARACTER_CREATION_RULES.backgrounds.maximumPerBackground} níveis após aplicar os bônus do clã.`
        );
      }
    }
  );


  Object.entries(
    effectiveInfluences
  ).forEach(
    ([
      influence,
      level,
    ]) => {
      if (
        !INFLUENCE_AREAS.includes(
          influence
        )
      ) {
        errors.push(
          `${influence} concedida pelo clã não é uma área válida de Influência.`
        );


        return;
      }


      if (
        level >
          CHARACTER_CREATION_RULES
            .backgrounds
            .maximumPerBackground
      ) {
        errors.push(
          `${influence} deve possuir no máximo ${CHARACTER_CREATION_RULES.backgrounds.maximumPerBackground} níveis de Influência após aplicar os bônus do clã.`
        );
      }
    }
  );


  const backgroundLevels =
    sumLevels(
      backgrounds
    );


  const influenceLevels =
    sumLevels(
      influences
    );


  const totalLevels =
    backgroundLevels +
    influenceLevels;


  const effectiveBackgroundLevels =
    sumLevels(
      effectiveBackgrounds
    );


  const effectiveInfluenceLevels =
    sumLevels(
      effectiveInfluences
    );


  const effectiveTotalLevels =
    effectiveBackgroundLevels +
    effectiveInfluenceLevels;


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
      "Antecedentes / Influências",

    backgrounds,

    influences,

    grantedBackgrounds,

    grantedInfluences,

    effectiveBackgrounds,

    effectiveInfluences,

    clanGrantSelections:
      clanGrants.selections,

    pendingClanGrantChoices:
      clanGrants.pendingChoices,

    backgroundLevels,

    influenceLevels,

    totalLevels,

    effectiveBackgroundLevels,

    effectiveInfluenceLevels,

    effectiveTotalLevels,

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
          effectiveBackgrounds
            .generation
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
        0 &&
      clanGrants
        .pendingChoices
        .length ===
        0,
  };
}


module.exports = {
  validateDisciplines,
  validateBackgrounds,
};
