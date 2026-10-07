import {
  getFixedClanDisciplines,
} from "../../data/clanRuleCatalog.js";


export function getDisciplineCreationRules(
  character
) {
  const options =
    window.ByNightMain
      ?.character
      ?.options
      ?.disciplineRules ||
    {};


  const defaultTotal =
    Number(
      options.defaultTotal
    );


  const sabbatTotal =
    Number(
      options.sabbatTotal
    );


  const total =
    character?.sect ===
    "sabbat"
      ? (
          Number.isInteger(
            sabbatTotal
          )
            ? sabbatTotal
            : 4
        )
      : (
          Number.isInteger(
            defaultTotal
          )
            ? defaultTotal
            : 3
        );


  const maximum =
    Number(
      options
        .maximumLevelDuringCreation
    );


  const freeTraitCost =
    Number(
      options.freeTraitCost
    );


  return {
    total,

    maximum:
      Number.isInteger(
        maximum
      )
        ? maximum
        : 2,

    freeTraitCost:
      Number.isInteger(
        freeTraitCost
      )
        ? freeTraitCost
        : 3,
  };
}


export function getDisciplineEntries(
  character,
  state
) {
  const clanDisciplines =
    getFixedClanDisciplines(
      character
    );


  const current =
    state?.disciplines &&
    typeof state.disciplines ===
      "object"
      ? state.disciplines
      : {};


  const extras =
    Object.keys(
      current
    ).filter(
      (
        discipline
      ) =>
        !clanDisciplines
          .includes(
            discipline
          )
    );


  return [
    ...clanDisciplines.map(
      (
        discipline
      ) => ({
        discipline,

        level:
          Number(
            current[
              discipline
            ] ||
            0
          ),

        clan:
          true,
      })
    ),

    ...extras.map(
      (
        discipline
      ) => ({
        discipline,

        level:
          Number(
            current[
              discipline
            ] ||
            0
          ),

        clan:
          false,
      })
    ),
  ];
}
