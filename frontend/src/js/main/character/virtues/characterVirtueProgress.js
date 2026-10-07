export function calculateVirtueProgress(
  character,
  values
) {
  const total =
    Number.isFinite(
      character
        ?.virtuePoints
        ?.total
    )
      ? character
          .virtuePoints
          .total
      : 7;


  const freeTraitCostPerPoint =
    Number.isFinite(
      character
        ?.virtuePoints
        ?.freeTraitCostPerPoint
    )
      ? character
          .virtuePoints
          .freeTraitCostPerPoint
      : 2;


  let spent =
    0;


  getActiveVirtues(
    character
  ).forEach(
    (
      virtue
    ) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const value =
        Number.isFinite(
          values?.[
            virtue.key
          ]
        )
          ? values[
              virtue.key
            ]
          : minimum;


      spent +=
        Math.max(
          0,
          value -
            minimum
        );
    }
  );


  const extra =
    Math.max(
      0,
      spent -
        total
    );


  return {
    total,

    spent,

    remaining:
      Math.max(
        0,
        total -
          spent
      ),

    complete:
      spent >=
      total,

    extra,

    freeTraitCostPerPoint,

    freeTraitCost:
      extra *
      freeTraitCostPerPoint,
  };
}


export function isValidVirtueDraft(
  character,
  values
) {
  if (
    !values ||
    typeof values !==
      "object"
  ) {
    return false;
  }


  const virtues =
    getActiveVirtues(
      character
    );


  for (
    const virtue
    of virtues
  ) {
    const minimum =
      Number.isFinite(
        virtue.minimum
      )
        ? virtue.minimum
        : 0;


    const maximum =
      Number.isFinite(
        virtue.maximum
      )
        ? virtue.maximum
        : 5;


    const value =
      values[
        virtue.key
      ];


    if (
      !Number.isInteger(
        value
      ) ||
      value <
        minimum ||
      value >
        maximum
    ) {
      return false;
    }
  }


  return true;
}


export function hasVirtueDraftChanges(
  character,
  values
) {
  const baseline =
    getEditableActiveVirtueValues(
      character
    );


  return getActiveVirtues(
    character
  ).some(
    (
      virtue
    ) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      const saved =
        Number.isFinite(
          baseline[
            virtue.key
          ]
        )
          ? baseline[
              virtue.key
            ]
          : minimum;


      const draft =
        Number.isFinite(
          values?.[
            virtue.key
          ]
        )
          ? values[
              virtue.key
            ]
          : saved;


      return (
        saved !==
        draft
      );
    }
  );
}


export function getSavedActiveVirtueValues(
  character
) {
  const values = {};


  getActiveVirtues(
    character
  ).forEach(
    (
      virtue
    ) => {
      const minimum =
        Number.isFinite(
          virtue.minimum
        )
          ? virtue.minimum
          : 0;


      values[
        virtue.key
      ] =
        Number.isFinite(
          virtue.value
        )
          ? virtue.value
          : minimum;
    }
  );


  return values;
}


export function getEditableActiveVirtueValues(
  character
) {
  const values =
    getSavedActiveVirtueValues(
      character
    );


  const draftVirtues =
    character
      ?.sheetDraft
      ?.changes
      ?.virtues;


  if (
    !draftVirtues ||
    typeof draftVirtues !==
      "object" ||
    Array.isArray(
      draftVirtues
    )
  ) {
    return values;
  }


  getActiveVirtues(
    character
  ).forEach(
    (
      virtue
    ) => {
      const key =
        String(
          virtue.key
        );


      const proposed =
        draftVirtues[
          key
        ];


      if (
        Number.isInteger(
          proposed
        )
      ) {
        values[
          key
        ] =
          proposed;
      }
    }
  );


  return values;
}


export function updateCharacterVirtueLocalState(
  character,
  updated
) {
  if (
    updated.virtues &&
    typeof updated.virtues ===
      "object"
  ) {
    character.virtues =
      updated.virtues;
  }


  if (
    Array.isArray(
      updated.activeVirtues
    )
  ) {
    character.activeVirtues =
      updated.activeVirtues;
  }


  if (
    updated.virtuePoints &&
    typeof updated.virtuePoints ===
      "object"
  ) {
    character.virtuePoints =
      updated.virtuePoints;
  }
}


export function getActiveVirtues(
  character
) {
  return Array.isArray(
    character
      ?.activeVirtues
  )
    ? character
        .activeVirtues
    : [];
}


export function getActiveVirtue(
  character,
  virtueKey
) {
  return (
    getActiveVirtues(
      character
    ).find(
      (
        virtue
      ) =>
        String(
          virtue.key
        ) ===
        String(
          virtueKey
        )
    ) ||
    null
  );
}
