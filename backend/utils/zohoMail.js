const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_MAIL_PASS,
  },
});

async function sendEmailVerificationTokenMail(to, token) {
  return transporter.sendMail({
    from: `"No-Reply" <${process.env.ZOHO_SMTP_USER}>`,
    to,
    subject: "Seu código de verificação - ByNight",
    html: `
      <h2>Verificação de E-mail</h2>
      <p>Olá! Aqui está seu código para confirmar o e-mail:</p>

      <h1 style="letter-spacing: 3px; margin: 15px 0; text-align: center;">
        ${token}
      </h1>

      <p>Este código expira em <strong>10 minutos</strong>.</p>

      <p style="font-size: 12px; color: #555;">
        Se você não solicitou este código, ignore este e-mail.
      </p>
    `,
  });
}

module.exports = { sendEmailVerificationTokenMail };