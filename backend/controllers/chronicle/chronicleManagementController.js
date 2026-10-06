const mongoose = require(
  "mongoose"
);

const Character = require(
  "../../models/Character"
);

const House = require(
  "../../models/House"
);

const HouseMember = require(
  "../../models/HouseMember"
);


const {
  getClanDisplayName,
} = require(
  "../../data/vampire/clanDisplay"
);


const {
  getChronicleAccess,
  getRolePermissions,
  hasChroniclePermission,
  normalizeMembershipPermissions,
} = require(
  "./chronicleAccess"
);


const CHRONICLE_NAME_MIN_LENGTH =
  2;

const CHRONICLE_NAME_MAX_LENGTH =
  80;

const EDITABLE_MEMBER_ROLES =
  new Set([
    "admin",
    "narrator",
    "member",
  ]);


function serializeUser(
  user
) {
  if (!user) {
    return null;
  }


  return {
    id:
      user._id,

    name:
      user.name ||
      "Usuário",

    email:
      user.email ||
      "",
  };
}


function serializeMember(
  membership
) {
  return {
    id:
      membership._id,

    user:
      serializeUser(
        membership.user
      ),

    role:
      membership.role,

    permissions:
      normalizeMembershipPermissions(
        membership
      ),

    createdAt:
      membership.createdAt,

    updatedAt:
      membership.updatedAt,
  };
}


function serializeCharacter(
  character
) {
  return {
    id:
      character._id,

    name:
      character.name,

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

    owner:
      serializeUser(
        character.ownerUser
      ),

    createdAt:
      character.createdAt,

    updatedAt:
      character.updatedAt,
  };
}


async function getChronicleManagement(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const houseId =
      String(
        req.params?.houseId ||
        ""
      ).trim();


    const access =
      await getChronicleAccess({
        houseId,
        userId,
      });


    if (!access.ok) {
      return res
        .status(
          access.status
        )
        .json({
          ok:
            false,

          error:
            access.error,
        });
    }


    const [
      members,
      characters,
      pendingCharacters,
    ] =
      await Promise.all([
        HouseMember.find({
          house:
            houseId,

          isActive:
            true,
        })

          .populate({
            path:
              "user",

            match: {
              isAnonymized: {
                $ne:
                  true,
              },
            },

            select:
              "name email",
          })

          .sort({
            createdAt:
              1,
          })

          .lean(),

        Character.find({
          motherHouse:
            houseId,
        })

          .select(
            "name type sect clan ownerUser createdAt updatedAt"
          )

          .populate({
            path:
              "ownerUser",

            select:
              "name email",
          })

          .sort({
            name:
              1,
          })

          .lean(),

        Character.find({
          pendingMotherHouse:
            houseId,

          motherHouse:
            null,

          type:
            "PC",
        })

          .select(
            "name type sect clan ownerUser createdAt updatedAt"
          )

          .populate({
            path:
              "ownerUser",

            select:
              "name email",
          })

          .sort({
            createdAt:
              1,
          })

          .lean(),
      ]);


    return res.json({
      ok:
        true,

      chronicle: {
        id:
          access.house._id,

        name:
          access.house.name,

        plan:
          access.house.plan,

        createdAt:
          access.house.createdAt,

        updatedAt:
          access.house.updatedAt,
      },

      membership: {
        role:
          access.membership.role,

        permissions:
          access.membership
            .permissions,
      },

      members:
        members
          .filter(
            (membership) =>
              membership.user
          )
          .map(
            serializeMember
          ),

      characters:
        characters.map(
          serializeCharacter
        ),

      pendingCharacters:
        pendingCharacters.map(
          serializeCharacter
        ),
    });

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao carregar gerenciamento:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível carregar o gerenciamento da Crônica.",
      });
  }
}


async function updateChronicleSettings(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const houseId =
      String(
        req.params?.houseId ||
        ""
      ).trim();


    const name =
      String(
        req.body?.name ||
        ""
      ).trim();


    const access =
      await getChronicleAccess({
        houseId,
        userId,
      });


    if (!access.ok) {
      return res
        .status(
          access.status
        )
        .json({
          ok:
            false,

          error:
            access.error,
        });
    }


    if (
      !hasChroniclePermission(
        access.membership,
        "canManageHouse"
      )
    ) {
      return res
        .status(403)
        .json({
          ok:
            false,

          error:
            "Você não possui permissão para alterar as configurações desta Crônica.",
        });
    }


    if (
      name.length <
        CHRONICLE_NAME_MIN_LENGTH ||
      name.length >
        CHRONICLE_NAME_MAX_LENGTH
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `O nome da Crônica deve possuir entre ${CHRONICLE_NAME_MIN_LENGTH} e ${CHRONICLE_NAME_MAX_LENGTH} caracteres.`,
        });
    }


    const chronicle =
      await House.findOneAndUpdate(
        {
          _id:
            houseId,

          isActive:
            true,
        },

        {
          $set: {
            name,
          },
        },

        {
          returnDocument:
            "after",

          runValidators:
            true,
        }
      );


    if (!chronicle) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Crônica não encontrada.",
        });
    }


    return res.json({
      ok:
        true,

      chronicle: {
        id:
          chronicle._id,

        name:
          chronicle.name,
      },
    });

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao atualizar configurações:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível alterar as configurações da Crônica.",
      });
  }
}


async function approveChronicleCharacter(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const houseId =
      String(
        req.params?.houseId ||
        ""
      ).trim();


    const characterId =
      String(
        req.params?.characterId ||
        ""
      ).trim();


    const access =
      await getChronicleAccess({
        houseId,
        userId,
      });


    if (!access.ok) {
      return res
        .status(
          access.status
        )
        .json({
          ok:
            false,

          error:
            access.error,
        });
    }


    if (
      !hasChroniclePermission(
        access.membership,
        "canManageCharacters"
      )
    ) {
      return res
        .status(403)
        .json({
          ok:
            false,

          error:
            "Você não possui permissão para aprovar personagens nesta Crônica.",
        });
    }


    if (
      !mongoose.isValidObjectId(
        characterId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Personagem inválido.",
        });
    }


    const character =
      await Character.findOneAndUpdate(
        {
          _id:
            characterId,

          type:
            "PC",

          motherHouse:
            null,

          pendingMotherHouse:
            houseId,
        },

        {
          $set: {
            motherHouse:
              houseId,

            pendingMotherHouse:
              null,
          },
        },

        {
          returnDocument:
            "after",

          runValidators:
            true,
        }
      );


    if (!character) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Esta solicitação não está mais disponível para aprovação.",
        });
    }


    if (
      character.ownerUser
    ) {
      await HouseMember.findOneAndUpdate(
        {
          house:
            houseId,

          user:
            character.ownerUser,
        },

        {
          $set: {
            isActive:
              true,
          },

          $setOnInsert: {
            role:
              "member",

            permissions:
              getRolePermissions(
                "member"
              ),
          },
        },

        {
          upsert:
            true,

          returnDocument:
            "after",

          setDefaultsOnInsert:
            true,
        }
      );
    }


    return res.json({
      ok:
        true,

      message:
        "Personagem aprovado e vinculado à Crônica.",
    });

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao aprovar personagem:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível aprovar o personagem.",
      });
  }
}


async function rejectChronicleCharacter(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const houseId =
      String(
        req.params?.houseId ||
        ""
      ).trim();


    const characterId =
      String(
        req.params?.characterId ||
        ""
      ).trim();


    const access =
      await getChronicleAccess({
        houseId,
        userId,
      });


    if (!access.ok) {
      return res
        .status(
          access.status
        )
        .json({
          ok:
            false,

          error:
            access.error,
        });
    }


    if (
      !hasChroniclePermission(
        access.membership,
        "canManageCharacters"
      )
    ) {
      return res
        .status(403)
        .json({
          ok:
            false,

          error:
            "Você não possui permissão para rejeitar solicitações nesta Crônica.",
        });
    }


    if (
      !mongoose.isValidObjectId(
        characterId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Personagem inválido.",
        });
    }


    const character =
      await Character.findOneAndUpdate(
        {
          _id:
            characterId,

          type:
            "PC",

          motherHouse:
            null,

          pendingMotherHouse:
            houseId,
        },

        {
          $set: {
            pendingMotherHouse:
              null,
          },
        },

        {
          returnDocument:
            "after",

          runValidators:
            true,
        }
      );


    if (!character) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "Esta solicitação não está mais disponível.",
        });
    }


    return res.json({
      ok:
        true,

      message:
        "Solicitação rejeitada.",
    });

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao rejeitar personagem:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível rejeitar a solicitação.",
      });
  }
}


async function updateChronicleMemberRole(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    const houseId =
      String(
        req.params?.houseId ||
        ""
      ).trim();


    const memberId =
      String(
        req.params?.memberId ||
        ""
      ).trim();


    const role =
      String(
        req.body?.role ||
        ""
      )
        .trim()
        .toLowerCase();


    const access =
      await getChronicleAccess({
        houseId,
        userId,
      });


    if (!access.ok) {
      return res
        .status(
          access.status
        )
        .json({
          ok:
            false,

          error:
            access.error,
        });
    }


    if (
      !hasChroniclePermission(
        access.membership,
        "canManageMembers"
      )
    ) {
      return res
        .status(403)
        .json({
          ok:
            false,

          error:
            "Você não possui permissão para gerenciar membros desta Crônica.",
        });
    }


    if (
      !mongoose.isValidObjectId(
        memberId
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Membro inválido.",
        });
    }


    if (
      !EDITABLE_MEMBER_ROLES.has(
        role
      )
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Papel de membro inválido.",
        });
    }


    const targetMembership =
      await HouseMember.findOne({
        _id:
          memberId,

        house:
          houseId,

        isActive:
          true,
      });


    if (!targetMembership) {
      return res
        .status(404)
        .json({
          ok:
            false,

          error:
            "Membro não encontrado.",
        });
    }


    if (
      targetMembership.role ===
      "owner"
    ) {
      return res
        .status(409)
        .json({
          ok:
            false,

          error:
            "O proprietário da Crônica não pode ter seu papel alterado.",
        });
    }


    targetMembership.role =
      role;


    targetMembership.permissions =
      getRolePermissions(
        role
      );


    await targetMembership.save();


    return res.json({
      ok:
        true,

      member: {
        id:
          targetMembership._id,

        role:
          targetMembership.role,

        permissions:
          normalizeMembershipPermissions(
            targetMembership
          ),
      },
    });

  } catch (error) {
    console.error(
      "[CHRONICLE] Erro ao alterar papel do membro:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível alterar o papel do membro.",
      });
  }
}


module.exports = {
  getChronicleManagement,
  updateChronicleSettings,
  approveChronicleCharacter,
  rejectChronicleCharacter,
  updateChronicleMemberRole,
};