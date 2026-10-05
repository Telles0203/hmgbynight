const bcrypt = require(
  "bcryptjs"
);

const crypto = require(
  "crypto"
);


const User = require(
  "../models/User"
);


const generatePasswordResetToken =
  require(
    "../utils/generatePasswordResetToken"
  );


const {
  sendEmailVerificationTokenMail,
  sendPasswordResetMail,
} = require(
  "../utils/zohoMail"
);


const {
  EMAIL_TOKEN_RESEND_SECONDS,
  generateEmailVerificationToken,
  hashEmailVerificationToken,
  createEmailVerificationExpiration,
} = require(
  "../utils/emailVerificationToken"
);


const {
  signAuthToken,
  setAuthCookie,
  clearAuthCookie,
} = require(
  "../utils/authSession"
);


const PASSWORD_RESET_EXPIRATION_MINUTES =
  15;

const PASSWORD_MIN_LENGTH =
  6;

const PASSWORD_RECOVERY_MIN_RESPONSE_MS =
  700;

const PASSWORD_RECOVERY_JITTER_MS =
  300;

const PRIVACY_POLICY_VERSION =
  "2026-10-01";


const DUMMY_PASSWORD_HASH =
  bcrypt.hashSync(
    "bynight-invalid-account-placeholder",
    10
  );


// ==============================
// Helpers
// ==============================

function normalizeEmail(
  email
) {
  return String(
    email || ""
  )
    .trim()
    .toLowerCase();
}


function isValidEmail(
  email
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
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


function getApplicationUrl() {
  const applicationUrl =
    String(
      process.env.APP_URL || ""
    )
      .trim()
      .replace(
        /\/+$/,
        ""
      );


  if (!applicationUrl) {
    throw new Error(
      "APP_URL não configurado."
    );
  }


  return applicationUrl;
}


function wait(
  milliseconds
) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


async function waitForPasswordRecoveryResponse(
  startedAt
) {
  const jitter =
    crypto.randomInt(
      0,
      PASSWORD_RECOVERY_JITTER_MS + 1
    );


  const targetDuration =
    PASSWORD_RECOVERY_MIN_RESPONSE_MS +
    jitter;


  const elapsed =
    Date.now() -
    startedAt;


  const remaining =
    targetDuration -
    elapsed;


  if (remaining > 0) {
    await wait(
      remaining
    );
  }
}


async function sendPasswordResetInBackground(
  user,
  token,
  tokenHash,
  applicationUrl
) {
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


    try {
      await User.updateOne(
        {
          _id: user._id,

          resetPasswordTokenHash:
            tokenHash,
        },
        {
          $set: {
            resetPasswordTokenHash:
              null,

            resetPasswordExpires:
              null,
          },
        }
      );

    } catch (databaseError) {
      console.error(
        "[PASSWORD RESET] Erro ao invalidar token após falha de e-mail:",
        databaseError
      );
    }
  }
}


// ==============================
// Register
// ==============================

async function register(
  req,
  res
) {
  try {
    const {
      name,
      email,
      password,
      privacyPolicyAccepted,
    } = req.body || {};


    const cleanName =
      String(
        name || ""
      ).trim();


    const cleanEmail =
      normalizeEmail(
        email
      );


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
      privacyPolicyAccepted !== true
    ) {
      return res.status(400).json({
        ok: false,

        error:
          "É necessário aceitar a Política de Privacidade para criar a conta.",
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


    if (
      !isValidEmail(
        cleanEmail
      )
    ) {
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
      }).select(
        "_id"
      );


    if (existingUser) {
      return res.status(409).json({
        ok: false,

        error:
          "E-mail já cadastrado.",
      });
    }


    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    const emailVerificationToken =
      generateEmailVerificationToken();


    const emailVerificationTokenHash =
      hashEmailVerificationToken(
        emailVerificationToken
      );


    const emailVerificationExpires =
      createEmailVerificationExpiration();


    const user =
      await User.create({
        name: cleanName,
        email: cleanEmail,
        passwordHash,

        isEmailValid: false,
        authVersion: 0,

        emailVerificationToken:
          emailVerificationTokenHash,

        emailVerificationExpires,

        privacyPolicyAccepted:
          true,

        privacyPolicyAcceptedAt:
          new Date(),

        privacyPolicyVersion:
          PRIVACY_POLICY_VERSION,
      });


    let emailSent = false;


    try {
      await sendEmailVerificationTokenMail(
        user.email,
        emailVerificationToken
      );


      emailSent = true;

      user.emailVerificationLastSentAt =
        new Date();


      await user.save();

    } catch (error) {
      console.error(
        "[REGISTER] Falha ao enviar e-mail de verificação:",
        error.message
      );
    }


    const authToken =
      signAuthToken(
        user
      );


    setAuthCookie(
      res,
      authToken
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

        retryAfter:
          emailSent
            ? EMAIL_TOKEN_RESEND_SECONDS
            : 0,
      },
    });

  } catch (error) {
    if (
      error?.code === 11000
    ) {
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

async function login(
  req,
  res
) {
  try {
    const {
      email,
      password,
    } = req.body || {};


    const cleanEmail =
      normalizeEmail(
        email
      );


    if (
      !cleanEmail ||
      typeof password !== "string" ||
      !password
    ) {
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


    const passwordHash =
      user?.passwordHash ||
      DUMMY_PASSWORD_HASH;


    const passwordMatches =
      await bcrypt.compare(
        password,
        passwordHash
      );


    if (
      !user ||
      !passwordMatches
    ) {
      return res.status(401).json({
        ok: false,

        error:
          "Credenciais inválidas.",
      });
    }


    const authToken =
      signAuthToken(
        user
      );


    setAuthCookie(
      res,
      authToken
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
  const startedAt =
    Date.now();


  const genericResponse = {
    ok: true,

    message:
      "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
  };


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


    if (
      !isValidEmail(
        cleanEmail
      )
    ) {
      return res.status(400).json({
        ok: false,
        error: "E-mail inválido.",
      });
    }


    const {
      token,
      tokenHash,
    } =
      generatePasswordResetToken();


    const user =
      await User.findOne({
        email: cleanEmail,
      });


    if (user) {
      user.resetPasswordTokenHash =
        tokenHash;


      user.resetPasswordExpires =
        createPasswordResetExpiration();


      await user.save();


      const applicationUrl =
        getApplicationUrl();


      void sendPasswordResetInBackground(
        user,
        token,
        tokenHash,
        applicationUrl
      );
    }


    await waitForPasswordRecoveryResponse(
      startedAt
    );


    return res.json(
      genericResponse
    );

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
    } = req.body || {};


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


    clearAuthCookie(
      res
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

async function me(
  req,
  res
) {
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

function logout(
  req,
  res
) {
  clearAuthCookie(
    res
  );


  return res.json({
    ok: true,
  });
}


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  logout,
};