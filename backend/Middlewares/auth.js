const User = require(
  "../models/User"
);

const {
  isJwtConfigured,
  getCookieName,
  verifyAuthToken,
} = require(
  "../utils/authSession"
);


// ==============================
// Authentication
// ==============================

async function requireAuth(
  req,
  res,
  next
) {
  if (!isJwtConfigured()) {
    console.error(
      "[AUTH] JWT_SECRET não está configurado."
    );


    return res.status(500).json({
      ok: false,

      error:
        "Erro interno de autenticação.",
    });
  }


  const cookieName =
    getCookieName();


  const token =
    req.cookies?.[cookieName];


  if (!token) {
    return res.status(401).json({
      ok: false,
      error: "Não autenticado.",
    });
  }


  try {
    const payload =
      verifyAuthToken(
        token
      );


    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.sub
    ) {
      return res.status(401).json({
        ok: false,
        error: "Sessão inválida.",
      });
    }


    const user =
      await User.findById(
        payload.sub
      ).select(
        "email name authVersion isEmailValid isAnonymized"
      );


    if (
      !user ||
      user.isAnonymized === true
    ) {
      return res.status(401).json({
        ok: false,
        error: "Sessão inválida.",
      });
    }


    const tokenAuthVersion =
      Number(
        payload.authVersion ?? 0
      );


    const userAuthVersion =
      Number(
        user.authVersion ?? 0
      );


    if (
      tokenAuthVersion !==
      userAuthVersion
    ) {
      return res.status(401).json({
        ok: false,

        error:
          "Sessão invalidada. Entre novamente.",
      });
    }


    /*
     * Dados do usuário são obtidos
     * diretamente do banco.
     *
     * O JWT fornece somente:
     * - identificador
     * - versão de autenticação
     */
    req.user = {
      sub: String(user._id),

      email: user.email,

      name: user.name,

      authVersion:
        userAuthVersion,

      isEmailValid:
        user.isEmailValid === true,
    };


    return next();

  } catch (error) {
    if (
      error?.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        ok: false,
        error: "Sessão expirada.",
      });
    }


    return res.status(401).json({
      ok: false,
      error: "Sessão inválida.",
    });
  }
}


// ==============================
// Verified e-mail
// ==============================

function requireVerifiedEmail(
  req,
  res,
  next
) {
  if (
    req.user?.isEmailValid !==
    true
  ) {
    return res.status(403).json({
      ok: false,

      error:
        "Valide seu e-mail antes de utilizar esta funcionalidade.",
    });
  }


  return next();
}


module.exports = {
  requireAuth,
  requireVerifiedEmail,
};