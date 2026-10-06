const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  getCharacterLifecycleStatus,
  canDirectlyEditCharacter,
  serializeCharacterState,
} = require(
  "../../backend/controllers/character/characterState"
);


test(
  "character without Chronicle is in initial construction",
  () => {
    const character = {
      motherHouse:
        null,

      pendingMotherHouse:
        null,
    };


    const status =
      getCharacterLifecycleStatus(
        character
      );


    assert.equal(
      status.key,
      "building"
    );


    assert.equal(
      status.label,
      "EM CONSTRUÇÃO INICIAL"
    );
  }
);


test(
  "character with pending Chronicle remains directly editable",
  () => {
    const character = {
      motherHouse:
        null,

      pendingMotherHouse:
        "pending-house",
    };


    const status =
      getCharacterLifecycleStatus(
        character
      );


    assert.equal(
      status.key,
      "pending"
    );


    assert.equal(
      status.label,
      "VÍNCULO PENDENTE"
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
  "approved character cannot be directly edited",
  () => {
    const character = {
      motherHouse:
        "approved-house",

      pendingMotherHouse:
        null,
    };


    const status =
      getCharacterLifecycleStatus(
        character
      );


    assert.equal(
      status.key,
      "approved"
    );


    assert.equal(
      status.label,
      "APROVADO"
    );


    assert.equal(
      canDirectlyEditCharacter(
        character
      ),
      false
    );
  }
);


test(
  "building character exposes editable creation fields",
  () => {
    const state =
      serializeCharacterState({
        motherHouse:
          null,

        pendingMotherHouse:
          null,
      });


    assert.equal(
      state.editState.directEdit,
      true
    );


    assert.equal(
      state.editState.fields.title,
      true
    );


    assert.equal(
      state.editState.fields.clan,
      true
    );


    assert.equal(
      state.editState.fields.concept,
      true
    );


    assert.equal(
      state.editState.fields.nature,
      true
    );


    assert.equal(
      state.editState.fields.demeanor,
      true
    );


    assert.equal(
      state.editState.fields.virtues,
      true
    );
  }
);


test(
  "approved character exposes protected creation fields",
  () => {
    const state =
      serializeCharacterState({
        motherHouse:
          "approved-house",

        pendingMotherHouse:
          null,
      });


    assert.equal(
      state.editState.directEdit,
      false
    );


    assert.equal(
      state.editState.requiresChronicleApproval,
      true
    );


    assert.equal(
      state.editState.fields.title,
      false
    );


    assert.equal(
      state.editState.fields.clan,
      false
    );


    assert.equal(
      state.editState.fields.concept,
      false
    );


    assert.equal(
      state.editState.fields.virtues,
      false
    );
  }
);