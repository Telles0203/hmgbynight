const House =
  require(
    "../models/House"
  );

const HouseMember =
  require(
    "../models/HouseMember"
  );


const HOUSE_NAME_MIN_LENGTH =
  2;

const HOUSE_NAME_MAX_LENGTH =
  80;

const HOUSE_SEARCH_DEFAULT_LIMIT =
  20;

const HOUSE_SEARCH_MAX_LIMIT =
  20;


// =============================================
// Helpers
// =============================================

function escapeRegex(
  value
) {
  return String(
    value || ""
  ).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


// =============================================
// Create House
// =============================================

async function createHouse(
  req,
  res
) {
  let createdHouse =
    null;


  try {
    const userId =
      req.user?.sub;


    const name =
      String(
        req.body?.name ||
        ""
      ).trim();


    if (!userId) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    if (!name) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            "Informe o nome da House.",
        });
    }


    if (
      name.length <
        HOUSE_NAME_MIN_LENGTH ||
      name.length >
        HOUSE_NAME_MAX_LENGTH
    ) {
      return res
        .status(400)
        .json({
          ok:
            false,

          error:
            `O nome da House deve possuir entre ${HOUSE_NAME_MIN_LENGTH} e ${HOUSE_NAME_MAX_LENGTH} caracteres.`,
        });
    }


    // =============================================
    // Create House
    // =============================================

    createdHouse =
      await House.create({
        name,

        createdBy:
          userId,

        plan:
          "free",

        isActive:
          true,
      });


    // =============================================
    // Creator becomes owner
    // =============================================

    await HouseMember.create({
      house:
        createdHouse._id,

      user:
        userId,

      role:
        "owner",

      permissions: {
        canManageHouse:
          true,

        canManageMembers:
          true,

        canManageCharacters:
          true,

        canControlNpcs:
          true,
      },

      isActive:
        true,
    });


    return res
      .status(201)
      .json({
        ok:
          true,

        house: {
          id:
            createdHouse._id,

          name:
            createdHouse.name,

          role:
            "owner",

          plan:
            createdHouse.plan,

          isActive:
            createdHouse.isActive,

          createdAt:
            createdHouse.createdAt,
        },
      });

  } catch (error) {
    console.error(
      "[HOUSE] Erro ao criar House:",
      error
    );


    // =============================================
    // Prevent orphan House
    // =============================================

    if (
      createdHouse?._id
    ) {
      try {
        await House.deleteOne({
          _id:
            createdHouse._id,
        });

      } catch (
        cleanupError
      ) {
        console.error(
          "[HOUSE] Erro ao limpar House incompleta:",
          cleanupError
        );
      }
    }


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível criar a House.",
      });
  }
}


// =============================================
// List user's Houses
//
// Usado no painel "Minhas Houses".
// =============================================

async function listHouses(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    if (!userId) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    const memberships =
      await HouseMember.find({
        user:
          userId,

        isActive:
          true,
      })

        .populate({
          path:
            "house",

          match: {
            isActive:
              true,
          },

          select:
            "name createdBy plan isActive createdAt updatedAt",
        })

        .sort({
          createdAt:
            -1,
        })

        .lean();


    const houses =
      memberships

        .filter(
          (membership) =>
            membership.house
        )

        .map(
          (membership) => ({
            id:
              membership
                .house
                ._id,

            name:
              membership
                .house
                .name,

            plan:
              membership
                .house
                .plan,

            role:
              membership.role,

            permissions:
              membership.permissions,

            createdBy:
              membership
                .house
                .createdBy,

            createdAt:
              membership
                .house
                .createdAt,

            updatedAt:
              membership
                .house
                .updatedAt,
          })
        );


    return res.json({
      ok:
        true,

      houses,
    });

  } catch (error) {
    console.error(
      "[HOUSE] Erro ao listar Houses:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível carregar suas Houses.",
      });
  }
}


// =============================================
// Search active Houses
//
// Usado ao escolher House mãe.
// =============================================

async function searchHouses(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;


    if (!userId) {
      return res
        .status(401)
        .json({
          ok:
            false,

          error:
            "Não autenticado.",
        });
    }


    const query =
      String(
        req.query?.q ||
        ""
      ).trim();


    const requestedLimit =
      Number.parseInt(
        req.query?.limit,
        10
      );


    const limit =
      Number.isFinite(
        requestedLimit
      )
        ? Math.min(
            Math.max(
              requestedLimit,
              1
            ),
            HOUSE_SEARCH_MAX_LIMIT
          )
        : HOUSE_SEARCH_DEFAULT_LIMIT;


    const filter = {
      isActive:
        true,
    };


    // =============================================
    // Search by name
    // =============================================

    if (query) {
      filter.name = {
        $regex:
          escapeRegex(
            query
          ),

        $options:
          "i",
      };
    }


    const houses =
      await House.find(
        filter
      )

        .select(
          "_id name"
        )

        .sort({
          name:
            1,

          _id:
            1,
        })

        .limit(
          limit
        )

        .lean();


    return res.json({
      ok:
        true,

      query,

      houses:
        houses.map(
          (house) => ({
            id:
              house._id,

            name:
              house.name,
          })
        ),
    });

  } catch (error) {
    console.error(
      "[HOUSE] Erro ao pesquisar Houses:",
      error
    );


    return res
      .status(500)
      .json({
        ok:
          false,

        error:
          "Não foi possível pesquisar as Houses.",
      });
  }
}


// =============================================
// Exports
// =============================================

module.exports = {
  createHouse,
  listHouses,
  searchHouses,
};