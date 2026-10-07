const FIXED_CLAN_NEGATIVE_TRAIT_GRANTS =
  Object.freeze({
    nosferatu:
      Object.freeze({
        social:
          Object.freeze([
            Object.freeze({
              value:
                "Repugnant",

              count:
                3,

              locked:
                true,

              grantsFreeTraits:
                false,
            }),
          ]),
      }),
  });


function normalizeClan(
  clan
) {
  return String(
    clan ||
    ""
  )
    .trim()
    .toLowerCase();
}


function cloneEntry(
  entry
) {
  return {
    value:
      String(
        entry?.value ||
        ""
      ),

    count:
      Number.isInteger(
        Number(
          entry?.count
        )
      )
        ? Math.max(
            0,
            Number(
              entry.count
            )
          )
        : 0,

    locked:
      entry?.locked ===
      true,

    grantsFreeTraits:
      entry?.grantsFreeTraits ===
      true,
  };
}


function getFixedClanNegativeTraitGrants(
  clan
) {
  const source =
    FIXED_CLAN_NEGATIVE_TRAIT_GRANTS[
      normalizeClan(
        clan
      )
    ] ||
    {};


  return {
    physical:
      Array.isArray(
        source.physical
      )
        ? source
            .physical
            .map(
              cloneEntry
            )
        : [],

    social:
      Array.isArray(
        source.social
      )
        ? source
            .social
            .map(
              cloneEntry
            )
        : [],

    mental:
      Array.isArray(
        source.mental
      )
        ? source
            .mental
            .map(
              cloneEntry
            )
        : [],
  };
}


module.exports = {
  FIXED_CLAN_NEGATIVE_TRAIT_GRANTS,
  getFixedClanNegativeTraitGrants,
};
