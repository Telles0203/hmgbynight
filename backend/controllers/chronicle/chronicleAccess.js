const mongoose = require(
  "mongoose"
);

const House = require(
  "../../models/House"
);

const HouseMember = require(
  "../../models/HouseMember"
);


const ROLE_PERMISSIONS = {
  owner: {
    canManageHouse:
      true,

    canManageMembers:
      true,

    canManageCharacters:
      true,

    canControlNpcs:
      true,
  },

  admin: {
    canManageHouse:
      true,

    canManageMembers:
      true,

    canManageCharacters:
      true,

    canControlNpcs:
      true,
  },

  narrator: {
    canManageHouse:
      false,

    canManageMembers:
      false,

    canManageCharacters:
      true,

    canControlNpcs:
      true,
  },

  member: {
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


function isValidObjectId(
  value
) {
  return mongoose.isValidObjectId(
    String(
      value || ""
    )
  );
}


function getRolePermissions(
  role
) {
  const permissions =
    ROLE_PERMISSIONS[
      role
    ] ||
    ROLE_PERMISSIONS.member;


  return {
    ...permissions,
  };
}


function normalizeMembershipPermissions(
  membership
) {
  const role =
    membership?.role ||
    "member";


  const rolePermissions =
    getRolePermissions(
      role
    );


  if (
    role ===
    "owner"
  ) {
    return rolePermissions;
  }


  return {
    canManageHouse:
      membership
        ?.permissions
        ?.canManageHouse ===
        true ||
      rolePermissions
        .canManageHouse,

    canManageMembers:
      membership
        ?.permissions
        ?.canManageMembers ===
        true ||
      rolePermissions
        .canManageMembers,

    canManageCharacters:
      membership
        ?.permissions
        ?.canManageCharacters ===
        true ||
      rolePermissions
        .canManageCharacters,

    canControlNpcs:
      membership
        ?.permissions
        ?.canControlNpcs ===
        true ||
      rolePermissions
        .canControlNpcs,
  };
}


function hasChroniclePermission(
  membership,
  permission
) {
  const permissions =
    normalizeMembershipPermissions(
      membership
    );


  return (
    permissions[
      permission
    ] ===
    true
  );
}


async function getChronicleAccess({
  houseId,
  userId,
}) {
  if (
    !isValidObjectId(
      houseId
    ) ||
    !isValidObjectId(
      userId
    )
  ) {
    return {
      ok:
        false,

      status:
        400,

      error:
        "Crônica inválida.",
    };
  }


  const [
    house,
    membership,
  ] =
    await Promise.all([
      House.findOne({
        _id:
          houseId,

        isActive:
          true,
      })
        .select(
          "name plan createdBy isActive createdAt updatedAt"
        )
        .lean(),

      HouseMember.findOne({
        house:
          houseId,

        user:
          userId,

        isActive:
          true,
      })
        .select(
          "role permissions isActive createdAt updatedAt"
        )
        .lean(),
    ]);


  if (!house) {
    return {
      ok:
        false,

      status:
        404,

      error:
        "Crônica não encontrada.",
    };
  }


  if (!membership) {
    return {
      ok:
        false,

      status:
        403,

      error:
        "Você não possui acesso ao gerenciamento desta Crônica.",
    };
  }


  return {
    ok:
      true,

    house,

    membership: {
      ...membership,

      permissions:
        normalizeMembershipPermissions(
          membership
        ),
    },
  };
}


module.exports = {
  getRolePermissions,
  normalizeMembershipPermissions,
  hasChroniclePermission,
  getChronicleAccess,
};