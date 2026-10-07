function normalizePositiveLevel(
  value
) {
  const level =
    Number(
      value
    );


  return Number.isInteger(
    level
  ) &&
  level >
    0
    ? level
    : 0;
}


export function getAbilityGrantLevel(
  grants,
  entryKey
) {
  return normalizePositiveLevel(
    grants?.[
      entryKey
    ]
  );
}


export function getPurchasedAbilityLevel(
  effectiveLevel,
  grantedLevel
) {
  return Math.max(
    0,
    normalizePositiveLevel(
      effectiveLevel
    ) -
    normalizePositiveLevel(
      grantedLevel
    )
  );
}


export function createEffectiveAbilityRows(
  values,
  specializations,
  grants
) {
  const purchased =
    values &&
    typeof values ===
      "object"
      ? values
      : {};


  const granted =
    grants &&
    typeof grants ===
      "object"
      ? grants
      : {};


  const keys =
    new Set([
      ...Object.keys(
        granted
      ),

      ...Object.keys(
        purchased
      ),
    ]);


  return Array.from(
    keys
  ).map(
    (
      entryKey
    ) => {
      const purchasedLevel =
        normalizePositiveLevel(
          purchased[
            entryKey
          ]
        );


      const grantedLevel =
        getAbilityGrantLevel(
          granted,
          entryKey
        );


      return {
        entryKey,

        purchasedLevel,

        grantedLevel,

        effectiveLevel:
          purchasedLevel +
          grantedLevel,

        specialization:
          String(
            specializations?.[
              entryKey
            ] ||
            ""
          ),
      };
    }
  );
}
