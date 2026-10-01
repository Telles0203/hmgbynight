const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");

const PASSWORD_MIN_LENGTH = 6;

// ==============================
// Helpers
// ==============================

function getCookieName() {
  return (
    process.env.COOKIE_NAME ||
    "bn_session"
  );
}

function getCookieClearOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };
}

// ==============================
// Update name
// ==============================

async function updateAccountName(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;

    const name = String(
      req.body?.name || ""
    ).trim();

    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: "Não autenticado.",
      });
    }

    if (
      name.length < 2 ||
      name.length > 40
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "O nome deve possuir entre 2 e 40 caracteres.",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        ok: false,
        error:
          "Usuário não encontrado.",
      });
    }

    return res.json({
      ok: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailValid:
          user.isEmailValid,
      },
    });
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao alterar nome:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Não foi possível alterar o nome.",
    });
  }
}

// ==============================
// Update password
// ==============================

async function updateAccountPassword(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;

    const {
      currentPassword,
      newPassword,
    } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: "Não autenticado.",
      });
    }

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Senha atual e nova senha são obrigatórias.",
      });
    }

    if (
      typeof newPassword !==
        "string" ||
      newPassword.length <
        PASSWORD_MIN_LENGTH
    ) {
      return res.status(400).json({
        ok: false,
        error:
          `A nova senha deve possuir pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const user =
      await User.findById(
        userId
      ).select(
        "+passwordHash +resetPasswordTokenHash +resetPasswordExpires authVersion"
      );

    if (!user) {
      return res.status(404).json({
        ok: false,
        error:
          "Usuário não encontrado.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        error:
          "A senha atual está incorreta.",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.passwordHash
      );

    if (samePassword) {
      return res.status(400).json({
        ok: false,
        error:
          "A nova senha deve ser diferente da senha atual.",
      });
    }

    user.passwordHash =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.authVersion =
      Number(
        user.authVersion ?? 0
      ) + 1;

    user.resetPasswordTokenHash =
      null;

    user.resetPasswordExpires =
      null;

    await user.save();

    res.clearCookie(
      getCookieName(),
      getCookieClearOptions()
    );

    return res.json({
      ok: true,
      message:
        "Senha alterada com sucesso. Entre novamente.",
    });
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao alterar senha:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Não foi possível alterar a senha.",
    });
  }
}

// ==============================
// Anonymize account
// ==============================

async function anonymizeAccount(
  req,
  res
) {
  try {
    const userId =
      req.user?.sub;

    const {
      currentPassword,
    } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: "Não autenticado.",
      });
    }

    if (
      !currentPassword ||
      typeof currentPassword !==
        "string"
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Informe sua senha atual.",
      });
    }

    const user =
      await User.findById(
        userId
      ).select(
        "+passwordHash +emailVerificationToken +emailVerificationExpires +resetPasswordTokenHash +resetPasswordExpires authVersion isAnonymized"
      );

    if (!user) {
      return res.status(404).json({
        ok: false,
        error:
          "Usuário não encontrado.",
      });
    }

    if (user.isAnonymized) {
      return res.status(400).json({
        ok: false,
        error:
          "Esta conta já foi anonimizada.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        error:
          "A senha atual está incorreta.",
      });
    }

    const randomPassword =
      crypto
        .randomBytes(64)
        .toString("hex");

    const anonymousEmail =
      `deleted-${user._id}@bynight.invalid`;

    user.name =
      "Usuário excluído";

    user.email =
      anonymousEmail;

    user.passwordHash =
      await bcrypt.hash(
        randomPassword,
        10
      );

    user.isEmailValid =
      false;

    user.emailVerificationToken =
      null;

    user.emailVerificationExpires =
      null;

    user.resetPasswordTokenHash =
      null;

    user.resetPasswordExpires =
      null;

    user.authVersion =
      Number(
        user.authVersion ?? 0
      ) + 1;

    user.isAnonymized =
      true;

    user.anonymizedAt =
      new Date();

    await user.save();

    res.clearCookie(
      getCookieName(),
      getCookieClearOptions()
    );

    return res.json({
      ok: true,
      message:
        "Conta anonimizada com sucesso.",
    });
  } catch (error) {
    console.error(
      "[ACCOUNT] Erro ao anonimizar conta:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Não foi possível excluir a conta.",
    });
  }
}

module.exports = {
  updateAccountName,
  updateAccountPassword,
  anonymizeAccount,
};