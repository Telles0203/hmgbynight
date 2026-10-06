const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  CHARACTER_SHEET_LIFECYCLES,
} = require(
  "../../backend/data/characterSheetLifecycle"
);

const {
  getChronicleLinkStatus,
  getCharacterSheetStatus,
  getCharacterLifecycleStatus,
  canEditCharacterSheet,
  canDirectlyEditCharacter,
  requiresChronicleApproval,
  serializeCharacterState,
} = require(
  "../../backend/controllers/character/characterState"
);


test(
  "legacy character defaults to initial distribution pending",
  () => {
    const status =
      getCharacterSheetStatus({
        motherHouse:
          null,
      });


    assert.equal(
      status.key,
      CHARACTER_SHEET_LIFECYCLES
        .INITIAL_DISTRIBUTION_PENDING
    );


    assert.equal(
      status.label,
      "PONTOS DE ATENÇÃO"
    );


    assert.equal(
      status.description.includes(
        "Ficha aguardando distribuição inicial de pontos"
      ),
      true
    );
  }
);


test(
  "character without Chronicle can edit initial sheet directly",
  () => {
    const character = {
      sheetLifecycle:
        CHARACTER_SHEET_LIFECYCLES
          .INITIAL_DISTRIBUTION_PENDING,

      motherHouse:
        null,

      pendingMotherHouse:
        null,
    };


    const state =
      serializeCharacterState(
        character
      );


    assert.equal(
      state.chronicleStatus.key,
      "none"
    );


    assert.equal(
      state.editState.canEdit,
      true
    );


    assert.equal(
      state.editState.directEdit,
      true
    );


    assert.equal(
      state.editState.requiresChronicleApproval,
      false
    );


    assert.equal(
      state.editState.mode,
      "direct"
    );
  }
);


test(
  "pending Chronicle link does not block initial distribution",
  () => {
    const character = {
      sheetLifecycle:
        CHARACTER_SHEET_LIFECYCLES
          .INITIAL_DISTRIBUTION_PENDING,

      motherHouse:
        null,

      pendingMotherHouse:
        "pending-house",
    };


    assert.equal(
      getChronicleLinkStatus(
        character
      ).key,
      "pending"
    );


    assert.equal(
      canEditCharacterSheet(
        character
      ),
      true
    );


    assert.equal(
      canDirectlyEditCharacter(
        character
      ),
      true
    );
  }
);


test(
  "linked Chronicle requires approval draft during initial distribution",
  () => {
    const character = {
      sheetLifecycle:
        CHARACTER_SHEET_LIFECYCLES
          .INITIAL_DISTRIBUTION_PENDING,

      motherHouse:
        "approved-house",

      pendingMotherHouse:
        null,
    };


    const state =
      serializeCharacterState(
        character
      );


    assert.equal(
      state.chronicleStatus.key,
      "linked"
    );


    assert.equal(
      state.sheetStatus.key,
      CHARACTER_SHEET_LIFECYCLES
        .INITIAL_DISTRIBUTION_PENDING
    );


    assert.equal(
      state.sheetStatus.label,
      "PONTOS DE ATENÇÃO"
    );


    assert.equal(
      state.editState.canEdit,
      true
    );


    assert.equal(
      state.editState.directEdit,
      false
    );


    assert.equal(
      state.editState.requiresChronicleApproval,
      true
    );


    assert.equal(
      state.editState.mode,
      "approval_draft"
    );


    assert.equal(
      state.editState.fields.title,
      true
    );


    assert.equal(
      state.editState.fields.virtues,
      true
    );
  }
);


test(
  "initial review pending locks direct creation editing",
  () => {
    const character = {
      sheetLifecycle:
        CHARACTER_SHEET_LIFECYCLES
          .INITIAL_REVIEW_PENDING,

      motherHouse:
        "approved-house",
    };


    const state =
      serializeCharacterState(
        character
      );


    assert.equal(
      state.sheetStatus.key,
      CHARACTER_SHEET_LIFECYCLES
        .INITIAL_REVIEW_PENDING
    );


    assert.equal(
      state.editState.canEdit,
      false
    );


    assert.equal(
      state.editState.directEdit,
      false
    );


    assert.equal(
      state.editState.mode,
      "locked"
    );
  }
);


test(
  "active sheet is no longer in initial creation editing mode",
  () => {
    const character = {
      sheetLifecycle:
        CHARACTER_SHEET_LIFECYCLES
          .ACTIVE,

      motherHouse:
        null,
    };


    const state =
      serializeCharacterState(
        character
      );


    assert.equal(
      state.sheetStatus.key,
      CHARACTER_SHEET_LIFECYCLES
        .ACTIVE
    );


    assert.equal(
      state.editState.canEdit,
      false
    );


    assert.equal(
      state.editState.directEdit,
      false
    );


    assert.equal(
      state.editState.reason,
      "sheet_active"
    );
  }
);


test(
  "legacy lifecycle status remains Chronicle status during migration",
  () => {
    const character = {
      motherHouse:
        "approved-house",

      pendingMotherHouse:
        null,
    };


    const legacyStatus =
      getCharacterLifecycleStatus(
        character
      );


    assert.equal(
      legacyStatus.key,
      "linked"
    );


    assert.equal(
      requiresChronicleApproval({
        ...character,

        sheetLifecycle:
          CHARACTER_SHEET_LIFECYCLES
            .INITIAL_DISTRIBUTION_PENDING,
      }),
      true
    );
  }
);