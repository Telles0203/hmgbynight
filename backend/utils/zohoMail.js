const nodemailer = require("nodemailer");

const SMTP_HOST = "smtp.zoho.com";
const SMTP_PORT = 465;

function getMailConfig() {
  const user = process.env.ZOHO_SMTP_USER;
  const password = process.env.ZOHO_MAIL_PASS;

  if (!user || !password) {
    throw new Error(
      "ZOHO_SMTP_USER ou ZOHO_MAIL_PASS não configurado."
    );
  }

  return {
    user,
    password,
  };
}

function createTransporter() {
  const { user, password } = getMailConfig();

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,

    auth: {
      user,
      pass: password,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmailVerificationTokenMail(
  to,
  token
) {
  if (!to) {
    throw new Error(
      "Destinatário do e-mail não informado."
    );
  }

  if (!token) {
    throw new Error(
      "Token de verificação não informado."
    );
  }

  const { user } = getMailConfig();

  const transporter = createTransporter();

  const safeToken = escapeHtml(token);

  return transporter.sendMail({
    from: `"ByNight" <${user}>`,
    to,

    subject:
      "Seu código de verificação - ByNight",

    text: [
      "Verificação de e-mail",
      "",
      "Seu código de verificação é:",
      token,
      "",
      "Este código expira em 10 minutos.",
      "",
      "Se você não solicitou este código, ignore este e-mail.",
    ].join("\n"),

    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <body
          style="
            margin: 0;
            padding: 24px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #212529;
          "
        >
          <div
            style="
              max-width: 520px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 32px;
              border-radius: 8px;
            "
          >
            <h2
              style="
                margin-top: 0;
                text-align: center;
              "
            >
              Verificação de e-mail
            </h2>

            <p>
              Use o código abaixo para confirmar
              seu endereço de e-mail:
            </p>

            <div
              style="
                margin: 24px 0;
                text-align: center;
              "
            >
              <strong
                style="
                  display: inline-block;
                  font-size: 30px;
                  letter-spacing: 5px;
                "
              >
                ${safeToken}
              </strong>
            </div>

            <p>
              Este código expira em
              <strong>10 minutos</strong>.
            </p>

            <p
              style="
                margin-top: 32px;
                font-size: 12px;
                color: #666666;
              "
            >
              Se você não solicitou este código,
              ignore este e-mail.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

module.exports = {
  sendEmailVerificationTokenMail,
};