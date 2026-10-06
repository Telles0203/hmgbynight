const {
  isDeepStrictEqual,
} = require(
  "node:util"
);

const CharacterSheetDraft =
  require(
    "../models/CharacterSheetDraft"
  );

const {
  CHARACTER_SHEET_DRAFT_STATUSES,
  CHARACTER_SHEET_DRAFT_FIELDS,
} = require(
  "../data/characterSheetDraft"
);


function normalizeValue(
  value
) {
  if (
    value ===
      undefined ||
    value ===
      null
  ) {
    return value;
  }


  if (
    typeof value !==
    "object"
  ) {
    return value;
  }


  if (
    typeof value.toObject ===
    "function"
  ) {
    return normalizeValue(
      value.toObject({
        depopulate:
          true,
      })
    );
  }


  return JSON.parse(
    JSON.stringify(
      value
    )
  );
}


function getDraftChanges(
  draft
) {
  const changes =
    draft?.changes;


  if (
    !changes ||
    typeof changes !==
      "object" ||
    Array.isArray(
      changes
    )
  ) {
    return {};
  }


  return normalizeValue(
    changes
  );
}


function buildNextDraftChanges(
  existingChanges,
  officialCharacter,
  submittedChanges
) {
  const nextChanges = {
    ...normalizeValue(
      existingChanges ||
      {}
    ),
  };


  const official =
    normalizeValue(
      officialCharacter
    ) ||
    {};


  Object.entries(
    submittedChanges ||
    {}
  ).forEach(
    ([
      field,
      value,
    ]) => {
      if (
        !CHARACTER_SHEET_DRAFT_FIELDS
          .includes(
            field
          )
      ) {
        return;
      }


      const normalizedValue =
        normalizeValue(
          value
        );


      const officialValue =
        normalizeValue(
          official[
            field
          ]
        );


      if (
        isDeepStrictEqual(
          normalizedValue,
          officialValue
        )
      ) {
        delete nextChanges[
          field
        ];


        return;
      }


      nextChanges[
        field
      ] =
        normalizedValue;
    }
  );


  return nextChanges;
}


function isDraftApplicable(
  character,
  draft
) {
  if (
    !character ||
    !draft ||
    !character.motherHouse
  ) {
    return false;
  }


  const characterHouse =
    character.motherHouse
      ?._id ||
    character.motherHouse;


  return (
    String(
      character._id ||
      character.id
    ) ===
      String(
        draft.character
      ) &&
    String(
      characterHouse
    ) ===
      String(
        draft.house
      ) &&
    draft.status ===
      CHARACTER_SHEET_DRAFT_STATUSES
        .DRAFT
  );
}


function applyCharacterSheetDraft(
  character,
  draft
) {
  const result =
    normalizeValue(
      character
    ) ||
    {};


  if (
    !isDraftApplicable(
      result,
      draft
    )
  ) {
    return result;
  }


  const changes =
    getDraftChanges(
      draft
    );


  CHARACTER_SHEET_DRAFT_FIELDS
    .forEach(
      (
        field
      ) => {
        if (
          Object.prototype
            .hasOwnProperty
            .call(
              changes,
              field
            )
        ) {
          result[
            field
          ] =
            normalizeValue(
              changes[
                field
              ]
            );
        }
      }
    );


  return result;
}


function serializeCharacterSheetDraft(
  draft
) {
  const changes =
    getDraftChanges(
      draft
    );


  const fields =
    CHARACTER_SHEET_DRAFT_FIELDS
      .filter(
        (
          field
        ) =>
          Object.prototype
            .hasOwnProperty
            .call(
              changes,
              field
            )
      );


  return {
    hasChanges:
      fields.length >
      0,

    status:
      draft?.status ||
      null,

    fields,

    changes,

    displayChanges:
      {},

    updatedAt:
      draft?.updatedAt ||
      null,

    submittedAt:
      draft?.submittedAt ||
      null,
  };
}


async function getCharacterSheetDraft(
  character
) {
  if (
    !character?._id ||
    !character?.motherHouse
  ) {
    return null;
  }


  return CharacterSheetDraft
    .findOne({
      character:
        character._id,

      house:
        character.motherHouse,

      status:
        CHARACTER_SHEET_DRAFT_STATUSES
          .DRAFT,
    });
}


async function getEffectiveCharacterForEditing(
  character
) {
  const draft =
    await getCharacterSheetDraft(
      character
    );


  return {
    draft,

    character:
      applyCharacterSheetDraft(
        character,
        draft
      ),
  };
}


async function saveCharacterSheetDraftChanges({
  character,
  ownerUser,
  changes,
}) {
  if (
    !character?._id ||
    !character?.motherHouse
  ) {
    throw new Error(
      "A ficha precisa estar vinculada a uma Crônica para gerar um rascunho."
    );
  }


  let draft =
    await CharacterSheetDraft
      .findOne({
        character:
          character._id,

        status:
          CHARACTER_SHEET_DRAFT_STATUSES
            .DRAFT,
      });


  const currentChanges =
    getDraftChanges(
      draft
    );


  const nextChanges =
    buildNextDraftChanges(
      currentChanges,
      character,
      changes
    );


  if (
    Object.keys(
      nextChanges
    ).length ===
    0
  ) {
    if (
      draft
    ) {
      await draft.deleteOne();
    }


    return null;
  }


  if (
    !draft
  ) {
    draft =
      new CharacterSheetDraft({
        character:
          character._id,

        house:
          character.motherHouse,

        ownerUser,

        status:
          CHARACTER_SHEET_DRAFT_STATUSES
            .DRAFT,

        changes:
          nextChanges,

        submittedAt:
          null,
      });

  } else {
    draft.house =
      character.motherHouse;

    draft.ownerUser =
      ownerUser;

    draft.status =
      CHARACTER_SHEET_DRAFT_STATUSES
        .DRAFT;

    draft.submittedAt =
      null;

    draft.changes =
      nextChanges;

    draft.markModified(
      "changes"
    );
  }


  await draft.save();


  return draft;
}


async function getCharacterSheetDraftMap(
  characters
) {
  const characterIds =
    characters
      .filter(
        (
          character
        ) =>
          Boolean(
            character.motherHouse
          )
      )
      .map(
        (
          character
        ) =>
          character._id
      );


  if (
    characterIds.length ===
    0
  ) {
    return new Map();
  }


  const drafts =
    await CharacterSheetDraft
      .find({
        character: {
          $in:
            characterIds,
        },

        status:
          CHARACTER_SHEET_DRAFT_STATUSES
            .DRAFT,
      })
      .lean();


  return new Map(
    drafts.map(
      (
        draft
      ) => [
        String(
          draft.character
        ),

        draft,
      ]
    )
  );
}


module.exports = {
  normalizeValue,
  getDraftChanges,
  buildNextDraftChanges,
  isDraftApplicable,
  applyCharacterSheetDraft,
  serializeCharacterSheetDraft,
  getCharacterSheetDraft,
  getEffectiveCharacterForEditing,
  saveCharacterSheetDraftChanges,
  getCharacterSheetDraftMap,
};