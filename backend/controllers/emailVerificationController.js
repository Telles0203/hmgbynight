const crypto = require(
  "crypto"
);

const User = require(
  "../models/User"
);

const {
  sendEmailVerificationTokenMail,
} = require(
  "../utils/zohoMail"
);

const {
  EMAIL_TOKEN_RESEND_SECONDS,
  generateEmailVerificationToken,
  hashEmailVerificationToken,
  isEmailVerificationTokenHash,
  createEmailVerificationExpiration,
} = require(
  "../utils/emailVerificationToken"
);


// ==============================
// Helpers
// ==============================

function tokenHashesMatch(
  storedHash,
  submittedHash
) {
  if (
    !isEmailVerificationTokenHash(
      storedHash
    ) ||
    !isEmailVerificationTokenHash(
      submittedHash
    )
  ) {
    return false;
  }


  const storedBuffer =
    Buffer.from(
      storedHash,
      "hex"
    );

  const submittedBuffer =
    Buffer.from(
      submittedHash,
      "hex"
    );


  if (
    storedBuffer.length !==
    submittedBuffer.length
  ) {
    return false;
  }


  return crypto.timingSafeEqual(
    storedBuffer,
    submittedBuffer
  );
}


async function clearEmailVerificationToken(
  user
) {
  user.emailVerificationToken =
    null;

  user.emailVerificationExpires =
    null;


  await user.save();
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
      ).select(
        "+emailVerificationToken +emailVerificationExpires +emailVerificationLastSentAt"
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


    if (
      user.emailVerificationLastSentAt
    ) {
      const elapsedSeconds =
        Math.floor(
          (
            Date.now() -
            user
              .emailVerificationLastSentAt
              .getTime()
          ) / 1000
        );


      if (
        elapsedSeconds <
        EMAIL_TOKEN_RESEND_SECONDS
      ) {
        const retryAfter =
          EMAIL_TOKEN_RESEND_SECONDS -
          elapsedSeconds;


        return res
          .status(429)
          .json({
            ok: false,

            error:
              `Aguarde ${retryAfter} segundos antes de solicitar um novo código.`,

            retryAfter,
          });
      }
    }


    const emailVerificationToken =
      generateEmailVerificationToken();


    const emailVerificationTokenHash =
      hashEmailVerificationToken(
        emailVerificationToken
      );


    const emailVerificationExpires =
      createEmailVerificationExpiration();


    /*
     * Somente o hash é persistido.
     * O token original existe apenas
     * em memória até o envio do e-mail.
     */
    user.emailVerificationToken =
      emailVerificationTokenHash;

    user.emailVerificationExpires =
      emailVerificationExpires;


    /*
     * Reservamos o intervalo antes
     * do envio para impedir cliques
     * repetidos rapidamente.
     */
    user.emailVerificationLastSentAt =
      new Date();


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


      /*
       * Se o envio falhar, invalidamos
       * o hash criado e liberamos uma
       * nova tentativa imediatamente.
       */
      user.emailVerificationToken =
        null;

      user.emailVerificationExpires =
        null;

      user.emailVerificationLastSentAt =
        null;


      await user.save();


      return res
        .status(500)
        .json({
          ok: false,

          error:
            "Não foi possível enviar o e-mail de verificação.",
        });
    }


    return res.json({
      ok: true,

      message:
        "Código de verificação enviado por e-mail.",

      retryAfter:
        EMAIL_TOKEN_RESEND_SECONDS,
    });

  } catch (error) {
    console.error(
      "[EMAIL VERIFICATION] Erro interno:",
      error
    );


    return res
      .status(500)
      .json({
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
    const {
      token,
    } = req.body || {};


    if (
      !token ||
      typeof token !==
        "string"
    ) {
      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Código de verificação obrigatório.",
        });
    }


    const cleanToken =
      token.trim();


    if (!cleanToken) {
      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Código de verificação obrigatório.",
        });
    }


    const user =
      await User.findById(
        req.user.sub
      ).select(
        "+emailVerificationToken +emailVerificationExpires"
      );


    if (!user) {
      return res
        .status(404)
        .json({
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
      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Nenhum código de verificação ativo.",
        });
    }


    /*
     * Tokens antigos eram armazenados
     * em texto puro e possuíam 10
     * caracteres.
     *
     * Após esta atualização somente
     * hashes SHA-256 de 64 caracteres
     * hexadecimais são aceitos.
     *
     * Se encontrarmos um token legado,
     * ele é imediatamente invalidado.
     */
    if (
      !isEmailVerificationTokenHash(
        user.emailVerificationToken
      )
    ) {
      await clearEmailVerificationToken(
        user
      );


      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Código anterior invalidado por atualização de segurança. Solicite um novo código.",
        });
    }


    if (
      user
        .emailVerificationExpires
        .getTime() <=
      Date.now()
    ) {
      await clearEmailVerificationToken(
        user
      );


      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Código expirado.",
        });
    }


    const submittedTokenHash =
      hashEmailVerificationToken(
        cleanToken
      );


    if (
      !tokenHashesMatch(
        user.emailVerificationToken,
        submittedTokenHash
      )
    ) {
      return res
        .status(400)
        .json({
          ok: false,

          error:
            "Código inválido.",
        });
    }


    user.isEmailValid =
      true;

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


    return res
      .status(500)
      .json({
        ok: false,

        error:
          "Erro interno ao validar código de verificação.",
      });
  }
}


module.exports = {
  sendEmailVerificationToken,
  verifyEmailToken,
};