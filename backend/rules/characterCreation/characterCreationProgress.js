const {
  getVirtueCreationProgress,
} = require(
  "../../data/vampire/virtues"
);

const {
  getCharacterCreationRuleSummary,
} = require(
  "../vampire/lawsOfTheNightRevised"
);

const {
  createPointProgress,
  createUntrackedPointProgress,
} = require(
  "./pointTracker"
);


function createPendingSection(
  key,
  label,
  total,
  extra = {}
) {
  return {
    key,

    label,

    implemented:
      false,

    status:
      "not_implemented",

    points:
      createUntrackedPointProgress(
        total
      ),

    ...extra,
  };
}


function createTrackedSection(
  key,
  label,
  points
) {
  return {
    key,

    label,

    implemented:
      true,

    status:
      points.complete
        ? "complete"
        : "incomplete",

    points,
  };
}


function getCharacterCreationProgress(
  character = {}
) {
  const rules =
    getCharacterCreationRuleSummary(
      character.sect
    );


  const virtueProgress =
    getVirtueCreationProgress(
      character.moralityPath,
      character.virtues
    );


  const sections = {
    attributes:
      createPendingSection(
        "attributes",
        "Atributos",
        rules.attributes.total,
        {
          priorities: {
            primary:
              rules.attributes
                .primary,

            secondary:
              rules.attributes
                .secondary,

            tertiary:
              rules.attributes
                .tertiary,
          },
        }
      ),

    abilities:
      createPendingSection(
        "abilities",
        "Habilidades",
        rules.abilities.total
      ),

    disciplines:
      createPendingSection(
        "disciplines",
        "Disciplinas",
        rules.disciplines.total
      ),

    backgrounds:
      createPendingSection(
        "backgrounds",
        "Antecedentes",
        rules.backgrounds.total
      ),

    virtues:
      createTrackedSection(
        "virtues",
        "Virtudes",
        createPointProgress({
          total:
            virtueProgress.total,

          spent:
            virtueProgress.spent,
        })
      ),

    freeTraits:
      createPendingSection(
        "freeTraits",
        "Free Traits",
        rules.freeTraits.base
      ),
  };


  const sectionValues =
    Object.values(
      sections
    );


  const trackedSections =
    sectionValues.filter(
      (
        section
      ) =>
        section.implemented
    );


  const completeTrackedSections =
    trackedSections.filter(
      (
        section
      ) =>
        section.points.complete
    );


  const incompleteTrackedSections =
    trackedSections.filter(
      (
        section
      ) =>
        !section.points.complete
    );


  return {
    ruleset:
      rules.ruleset,

    sections,

    summary: {
      totalSections:
        sectionValues.length,

      implementedSections:
        trackedSections.length,

      pendingImplementationSections:
        sectionValues.length -
        trackedSections.length,

      completeImplementedSections:
        completeTrackedSections.length,

      incompleteImplementedSections:
        incompleteTrackedSections.length,

      implementedSectionsComplete:
        trackedSections.length >
          0 &&
        incompleteTrackedSections
          .length ===
          0,
    },
  };
}


module.exports = {
  getCharacterCreationProgress,
};