const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

const generateEmailToken = require(
  "../utils/generateToken"
);

const generatePasswordResetToken = require(
  "../utils/generatePasswordResetToken"
);

const {
  sendEmailVerificationTokenMail,
  sendPasswordResetMail,
} = require("../utils/zohoMail");

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const PASSWORD_RESET_EXPIRATION_MINUTES = 15;
const PASSWORD_MIN_LENGTH = 6;

// ==============================
// Helpers
// ==============================

function getCookieName() {
  return process.env.COOKIE_NAME || "hmg_auth";
}

function getCookieOptions() {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET não configurado."
    );
  }

  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      name: user.name,

      authVersion: Number(
        user.authVersion ?? 0
      ),
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function createEmailTokenExpiration() {
  return new Date(
    Date.now() +
      EMAIL_TOKEN_EXPIRATION_MINUTES *
        60 *
        1000
  );
}

function createPasswordResetExpiration() {
  return new Date(
    Date.now() +
      PASSWORD_RESET_EXPIRATION_MINUTES *
        60 *
        1000
  );
}

function getApplicationUrl(req) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(
      /\/+$/,
      ""
    );
  }

  return `${req.protocol}://${req.get("host")}`;
}

// ==============================
// Register
// ==============================

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const cleanName =
      String(name || "").trim();

    const cleanEmail =
      normalizeEmail(email);

    if (
      !cleanName ||
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (
      cleanName.length < 2 ||
      cleanName.length > 40
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "O nome deve possuir entre 2 e 40 caracteres.",
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        ok: false,
        error: "E-mail inválido.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length <
        PASSWORD_MIN_LENGTH
    ) {
      return res.status(400).json({
        ok: false,
        error:
          `A senha deve possuir pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      }).select("_id");

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        error:
          "E-mail já cadastrado.",
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const emailVerificationToken =
      generateEmailToken(10);

    const emailVerificationExpires =
      createEmailTokenExpiration();

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      isEmailValid: false,
      authVersion: 0,
      emailVerificationToken,
      emailVerificationExpires,
    });

    let emailSent = false;

    try {
      await sendEmailVerificationTokenMail(
        user.email,
        emailVerificationToken
      );

      emailSent = true;
    } catch (error) {
      console.error(
        "[REGISTER] Falha ao enviar e-mail de verificação:",
        error.message
      );
    }

    const authToken =
      signToken(user);

    res.cookie(
      getCookieName(),
      authToken,
      getCookieOptions()
    );

    return res.status(201).json({
      ok: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailValid:
          user.isEmailValid,
      },

      emailVerification: {
        sent: emailSent,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        error:
          "E-mail já cadastrado.",
      });
    }

    console.error(
      "[REGISTER] Erro interno:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao realizar cadastro.",
    });
  }
}

// ==============================
// Login
// ==============================

async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    const cleanEmail =
      normalizeEmail(email);

    if (!cleanEmail || !password) {
      return res.status(400).json({
        ok: false,
        error:
          "E-mail e senha são obrigatórios.",
      });
    }

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select(
        "+passwordHash authVersion"
      );

    if (!user) {
      return res.status(401).json({
        ok: false,
        error:
          "Credenciais inválidas.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        error:
          "Credenciais inválidas.",
      });
    }

    const authToken =
      signToken(user);

    res.cookie(
      getCookieName(),
      authToken,
      getCookieOptions()
    );

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
      "[LOGIN] Erro interno:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao realizar login.",
    });
  }
}

// ==============================
// Forgot password
// ==============================

async function forgotPassword(
  req,
  res
) {
  try {
    const cleanEmail =
      normalizeEmail(
        req.body?.email
      );

    if (!cleanEmail) {
      return res.status(400).json({
        ok: false,
        error:
          "Informe o endereço de e-mail.",
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        ok: false,
        error:
          "E-mail inválido.",
      });
    }

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    if (!user) {
      return res.json({
        ok: true,
        message:
          "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
      });
    }

    const {
      token,
      tokenHash,
    } = generatePasswordResetToken();

    user.resetPasswordTokenHash =
      tokenHash;

    user.resetPasswordExpires =
      createPasswordResetExpiration();

    await user.save();

    const applicationUrl =
      getApplicationUrl(req);

    const resetUrl =
      `${applicationUrl}/reset-password?token=${encodeURIComponent(
        token
      )}`;

    try {
      await sendPasswordResetMail(
        user.email,
        resetUrl
      );
    } catch (error) {
      console.error(
        "[PASSWORD RESET] Falha ao enviar e-mail:",
        error.message
      );

      user.resetPasswordTokenHash =
        null;

      user.resetPasswordExpires =
        null;

      await user.save();

      return res.json({
        ok: true,
        message:
          "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
      });
    }

    return res.json({
      ok: true,
      message:
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
    });
  } catch (error) {
    console.error(
      "[PASSWORD RESET] Erro ao solicitar recuperação:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao processar recuperação de senha.",
    });
  }
}

// ==============================
// Reset password
// ==============================

async function resetPassword(
  req,
  res
) {
  try {
    const {
      token,
      password,
    } = req.body;

    if (
      !token ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Token de recuperação obrigatório.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length <
        PASSWORD_MIN_LENGTH
    ) {
      return res.status(400).json({
        ok: false,
        error:
          `A senha deve possuir pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const cleanToken =
      token.trim();

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(cleanToken)
        .digest("hex");

    const user =
      await User.findOne({
        resetPasswordTokenHash:
          tokenHash,

        resetPasswordExpires: {
          $gt: new Date(),
        },
      }).select(
        "+passwordHash +resetPasswordTokenHash +resetPasswordExpires authVersion"
      );

    if (!user) {
      return res.status(400).json({
        ok: false,
        error:
          "Link de recuperação inválido ou expirado.",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    user.passwordHash =
      passwordHash;

    user.resetPasswordTokenHash =
      null;

    user.resetPasswordExpires =
      null;

    user.authVersion =
      Number(
        user.authVersion ?? 0
      ) + 1;

    await user.save();

    const cookieOptions =
      getCookieOptions();

    res.clearCookie(
      getCookieName(),
      {
        httpOnly:
          cookieOptions.httpOnly,

        secure:
          cookieOptions.secure,

        sameSite:
          cookieOptions.sameSite,

        path:
          cookieOptions.path,
      }
    );

    return res.json({
      ok: true,
      message:
        "Senha alterada com sucesso.",
    });
  } catch (error) {
    console.error(
      "[PASSWORD RESET] Erro ao redefinir senha:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao redefinir senha.",
    });
  }
}

// ==============================
// Current user
// ==============================

async function me(req, res) {
  try {
    const user =
      await User.findById(
        req.user.sub
      ).select(
        "name email isEmailValid createdAt updatedAt"
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
      user,
    });
  } catch (error) {
    console.error(
      "[ME] Erro interno:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao buscar usuário.",
    });
  }
}

// ==============================
// Logout
// ==============================

function logout(req, res) {
  const cookieOptions =
    getCookieOptions();

  res.clearCookie(
    getCookieName(),
    {
      httpOnly:
        cookieOptions.httpOnly,

      secure:
        cookieOptions.secure,

      sameSite:
        cookieOptions.sameSite,

      path:
        cookieOptions.path,
    }
  );

  return res.json({
    ok: true,
  });
}

// ==============================
// Send verification token
// ==============================

async function sendEmailVerificationToken(
  req,
  res
) {
  try {
    const user =
      await User.findById(
        req.user.sub
      );

    if (!user) {
      return res.status(404).json({
        ok: false,
        error:
          "Usuário não encontrado.",
      });
    }

    if (user.isEmailValid) {
      return res.status(400).json({
        ok: false,
        error:
          "Este e-mail já foi verificado.",
      });
    }

    const emailVerificationToken =
      generateEmailToken(10);

    const emailVerificationExpires =
      createEmailTokenExpiration();

    user.emailVerificationToken =
      emailVerificationToken;

    user.emailVerificationExpires =
      emailVerificationExpires;

    await user.save();

    try {
      await sendEmailVerificationTokenMail(
        user.email,
        emailVerificationToken
      );
    } catch (error) {
      console.error(
        "[EMAIL VERIFICATION] Falha ao enviar e-mail:",
        error.message
      );

      return res.status(500).json({
        ok: false,
        error:
          "Não foi possível enviar o e-mail de verificação.",
      });
    }

    return res.json({
      ok: true,
      message:
        "Código de verificação enviado por e-mail.",
    });
  } catch (error) {
    console.error(
      "[EMAIL VERIFICATION] Erro interno:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao enviar código de verificação.",
    });
  }
}

// ==============================
// Verify email token
// ==============================

async function verifyEmailToken(
  req,
  res
) {
  try {
    const { token } = req.body;

    if (
      !token ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Código de verificação obrigatório.",
      });
    }

    const cleanToken =
      token.trim();

    const user =
      await User.findById(
        req.user.sub
      ).select(
        "+emailVerificationToken +emailVerificationExpires"
      );

    if (!user) {
      return res.status(404).json({
        ok: false,
        error:
          "Usuário não encontrado.",
      });
    }

    if (user.isEmailValid) {
      return res.json({
        ok: true,
        message:
          "E-mail já verificado.",
      });
    }

    if (
      !user.emailVerificationToken ||
      !user.emailVerificationExpires
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Nenhum código de verificação ativo.",
      });
    }

    if (
      user.emailVerificationExpires.getTime() <=
      Date.now()
    ) {
      user.emailVerificationToken =
        null;

      user.emailVerificationExpires =
        null;

      await user.save();

      return res.status(400).json({
        ok: false,
        error:
          "Código expirado.",
      });
    }

    if (
      user.emailVerificationToken !==
      cleanToken
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Código inválido.",
      });
    }

    user.isEmailValid = true;

    user.emailVerificationToken =
      null;

    user.emailVerificationExpires =
      null;

    await user.save();

    return res.json({
      ok: true,
      message:
        "E-mail verificado com sucesso.",
    });
  } catch (error) {
    console.error(
      "[EMAIL VERIFICATION] Erro ao validar código:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Erro interno ao validar código de verificação.",
    });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  logout,
  sendEmailVerificationToken,
  verifyEmailToken,
};