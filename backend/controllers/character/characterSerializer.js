const {
  getClanDisplayName,
} = require(
  "../../data/vampire/clanDisplay"
);

const {
  serializeHouse,
  serializeArchetype,
  serializeMoralityPath,
  serializeVirtues,
} = require(
  "./characterHelpers"
);

const {
  serializeCharacterState,
} = require(
  "./characterState"
);

const {
  getCharacterCreationProgress,
} = require(
  "../../rules/characterCreation/characterCreationProgress"
);

const {
  serializeCharacterCreation,
} = require(
  "./characterCreationSerialization"
);

const {
  applyCharacterSheetDraft,
  getDraftChanges,
  isDraftApplicable,
  serializeCharacterSheetDraft,
} = require(
  "../../services/characterSheetDraftService"
);


function serializeDraftForCharacter(
  character,
  draft
) {
  const applicableDraft =
    isDraftApplicable(
      character,
      draft
    )
      ? draft
      : null;


  const serialized =
    serializeCharacterSheetDraft(
      applicableDraft
    );


  const changes =
    serialized.changes;


  const displayChanges =
    {};


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "title"
      )
  ) {
    displayChanges.title =
      String(
        changes.title ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "concept"
      )
  ) {
    displayChanges.concept =
      String(
        changes.concept ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "clan"
      )
  ) {
    displayChanges.clan =
      getClanDisplayName(
        character.sect,
        changes.clan
      ) ||
      String(
        changes.clan ||
        ""
      );
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "nature"
      )
  ) {
    const nature =
      serializeArchetype(
        changes.nature
      );


    displayChanges.nature =
      nature.label ||
      nature.ref ||
      "";
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "demeanor"
      )
  ) {
    const demeanor =
      serializeArchetype(
        changes.demeanor
      );


    displayChanges.demeanor =
      demeanor.label ||
      demeanor.ref ||
      "";
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        changes,
        "moralityPath"
      )
  ) {
    const moralityPath =
      serializeMoralityPath(
        changes.moralityPath
      );


    displayChanges.moralityPath =
      moralityPath.label ||
      moralityPath.ref ||
      "";
  }


  return {
    ...serialized,

    displayChanges,
  };
}


function hasCreationRelevantDraft(
  draft
) {
  const changes =
    getDraftChanges(
      draft
    );


  return [
    "creation",
    "virtues",
    "moralityPath",
    "clan",
  ].some(
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
}


function serializeCharacterRecord(
  character,
  draft = null
) {
  const nature =
    serializeArchetype(
      character.nature
    );


  const demeanor =
    serializeArchetype(
      character.demeanor
    );


  const moralityPath =
    serializeMoralityPath(
      character.moralityPath
    );


  const virtues =
    serializeVirtues(
      moralityPath.ref,
      character.virtues
    );


  const state =
    serializeCharacterState(
      character
    );


  const creation =
    serializeCharacterCreation(
      getCharacterCreationProgress(
        character
      )
    );


  let draftCreation =
    null;


  if (
    draft &&
    isDraftApplicable(
      character,
      draft
    ) &&
    hasCreationRelevantDraft(
      draft
    )
  ) {
    const effectiveCharacter =
      applyCharacterSheetDraft(
        character,
        draft
      );


    draftCreation =
      serializeCharacterCreation(
        getCharacterCreationProgress(
          effectiveCharacter
        )
      );
  }


  return {
    id:
      character._id,

    name:
      character.name,

    title:
      character.title ||
      "",

    concept:
      character.concept ||
      "",

    nature:
      nature.ref,

    natureLabel:
      nature.label,

    demeanor:
      demeanor.ref,

    demeanorLabel:
      demeanor.label,

    moralityPath:
      moralityPath.ref,

    moralityPathLabel:
      moralityPath.label,

    moralityRating:
      Number.isFinite(
        character.moralityRating
      )
        ? character.moralityRating
        : null,

    virtues:
      virtues.values,

    activeVirtues:
      virtues.active,

    virtuePoints:
      virtues.points,

    creation,

    draftCreation,

    type:
      character.type,

    sect:
      character.sect,

    clan:
      character.clan,

    clanDisplayName:
      getClanDisplayName(
        character.sect,
        character.clan
      ),

    motherHouse:
      serializeHouse(
        character.motherHouse
      ),

    pendingMotherHouse:
      serializeHouse(
        character.pendingMotherHouse
      ),

    sheetLifecycle:
      state.sheetLifecycle,

    sheetStatus:
      state.sheetStatus,

    chronicleStatus:
      state.chronicleStatus,

    status:
      state.status,

    editState:
      state.editState,

    sheetDraft:
      serializeDraftForCharacter(
        character,
        draft
      ),

    createdAt:
      character.createdAt,

    updatedAt:
      character.updatedAt,
  };
}


module.exports = {
  serializeDraftForCharacter,
  serializeCharacterRecord,
};