const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const {
  getRolePermissions,
  hasChroniclePermission,
  normalizeMembershipPermissions,
} = require(
  "../../backend/controllers/chronicle/chronicleAccess"
);


test(
  "owner has every Chronicle management permission",
  () => {
    const permissions =
      getRolePermissions(
        "owner"
      );


    assert.equal(
      permissions.canManageHouse,
      true
    );


    assert.equal(
      permissions.canManageMembers,
      true
    );


    assert.equal(
      permissions.canManageCharacters,
      true
    );


    assert.equal(
      permissions.canControlNpcs,
      true
    );
  }
);


test(
  "admin has management permissions",
  () => {
    const permissions =
      getRolePermissions(
        "admin"
      );


    assert.equal(
      permissions.canManageHouse,
      true
    );


    assert.equal(
      permissions.canManageMembers,
      true
    );


    assert.equal(
      permissions.canManageCharacters,
      true
    );
  }
);


test(
  "narrator can manage characters but not Chronicle settings",
  () => {
    const permissions =
      getRolePermissions(
        "narrator"
      );


    assert.equal(
      permissions.canManageHouse,
      false
    );


    assert.equal(
      permissions.canManageMembers,
      false
    );


    assert.equal(
      permissions.canManageCharacters,
      true
    );


    assert.equal(
      permissions.canControlNpcs,
      true
    );
  }
);


test(
  "player has no Chronicle management permissions",
  () => {
    const permissions =
      getRolePermissions(
        "member"
      );


    assert.equal(
      permissions.canManageHouse,
      false
    );


    assert.equal(
      permissions.canManageMembers,
      false
    );


    assert.equal(
      permissions.canManageCharacters,
      false
    );


    assert.equal(
      permissions.canControlNpcs,
      false
    );
  }
);


test(
  "owner role always resolves management permissions",
  () => {
    const membership = {
      role:
        "owner",

      permissions: {
        canManageHouse:
          false,

        canManageMembers:
          false,

        canManageCharacters:
          false,

        canControlNpcs:
          false,
      },
    };


    const permissions =
      normalizeMembershipPermissions(
        membership
      );


    assert.equal(
      permissions.canManageHouse,
      true
    );


    assert.equal(
      permissions.canManageMembers,
      true
    );


    assert.equal(
      permissions.canManageCharacters,
      true
    );
  }
);


test(
  "hasChroniclePermission evaluates normalized permissions",
  () => {
    const membership = {
      role:
        "narrator",

      permissions: {},
    };


    assert.equal(
      hasChroniclePermission(
        membership,
        "canManageCharacters"
      ),
      true
    );


    assert.equal(
      hasChroniclePermission(
        membership,
        "canManageMembers"
      ),
      false
    );
  }
);