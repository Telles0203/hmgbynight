const {
  getFixedClanAbilityGrants,
  getClanAbilityChoiceGrants,
  getClanAbilityGrantStatus,
} = require(
  "./clanAbilityGrants"
);

const {
  getFixedClanNegativeTraitGrants,
} = require(
  "./clanNegativeTraitGrants"
);

const {
  getFixedClanResourceGrants,
  getClanResourceChoiceGrants,
  getClanResourceGrantStatus,
} = require(
  "./clanBackgroundInfluenceGrants"
);


function freezeResourceChoice(
  group
) {
  return Object.freeze({
    ...group,

    options:
      Object.freeze(
        group.options.map(
          (
            option
          ) =>
            Object.freeze({
              ...option,
            })
        )
      ),
  });
}


function freezeNegativeTraitEntries(
  entries
) {
  return Object.freeze(
    entries.map(
      (
        entry
      ) =>
        Object.freeze({
          ...entry,
        })
    )
  );
}


function createClanGrants(
  clan
) {
  const abilities =
    getFixedClanAbilityGrants(
      clan
    );


  const abilityChoices =
    getClanAbilityChoiceGrants(
      clan
    );


  const negativeTraits =
    getFixedClanNegativeTraitGrants(
      clan
    );


  const resources =
    getFixedClanResourceGrants(
      clan
    );


  const resourceChoices =
    getClanResourceChoiceGrants(
      clan
    );


  return Object.freeze({
    abilities:
      Object.freeze({
        ...abilities,
      }),

    abilityChoices:
      Object.freeze(
        abilityChoices.map(
          (
            group
          ) =>
            Object.freeze({
              ...group,

              options:
                Object.freeze([
                  ...group.options,
                ]),
            })
        )
      ),

    backgrounds:
      Object.freeze({
        ...resources
          .backgrounds,
      }),

    influences:
      Object.freeze({
        ...resources
          .influences,
      }),

    backgroundInfluenceChoices:
      Object.freeze(
        resourceChoices.map(
          freezeResourceChoice
        )
      ),

    negativeTraits:
      Object.freeze({
        physical:
          freezeNegativeTraitEntries(
            negativeTraits
              .physical
          ),

        social:
          freezeNegativeTraitEntries(
            negativeTraits
              .social
          ),

        mental:
          freezeNegativeTraitEntries(
            negativeTraits
              .mental
          ),
      }),
  });
}


function cloneResourceChoice(
  group
) {
  return {
    ...group,

    options:
      group.options.map(
        (
          option
        ) => ({
          ...option,
        })
      ),
  };
}


function cloneNegativeTraitEntries(
  entries
) {
  return entries.map(
    (
      entry
    ) => ({
      ...entry,
    })
  );
}


function cloneClanGrants(
  grants
) {
  return {
    abilities: {
      ...grants
        .abilities,
    },

    abilityChoices:
      grants
        .abilityChoices
        .map(
          (
            group
          ) => ({
            ...group,

            options: [
              ...group.options,
            ],
          })
        ),

    backgrounds: {
      ...grants
        .backgrounds,
    },

    influences: {
      ...grants
        .influences,
    },

    backgroundInfluenceChoices:
      grants
        .backgroundInfluenceChoices
        .map(
          cloneResourceChoice
        ),

    negativeTraits: {
      physical:
        cloneNegativeTraitEntries(
          grants
            .negativeTraits
            .physical
        ),

      social:
        cloneNegativeTraitEntries(
          grants
            .negativeTraits
            .social
        ),

      mental:
        cloneNegativeTraitEntries(
          grants
            .negativeTraits
            .mental
        ),
    },
  };
}


function getClanGrantImplementation(
  clan
) {
  const resourceStatus =
    getClanResourceGrantStatus(
      clan
    );


  return {
    grants:
      resourceStatus !==
      "pending",

    backgroundInfluenceGrants:
      resourceStatus !==
      "pending",

    abilityGrants:
      getClanAbilityGrantStatus(
        clan
      ) !==
      "pending",
  };
}


module.exports = {
  createClanGrants,
  cloneClanGrants,
  getClanGrantImplementation,
};
