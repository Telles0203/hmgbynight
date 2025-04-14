const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@bynight.com.br", // seu e-mail real no Zoho
    pass: "Alexandre#1988"           // sua senha de e-mail (ou app password)
  }
});

async function enviarEmail(to, subject, html) {
  return transporter.sendMail({
    from: '"By Night" <no-reply@bynight.com.br>',
    to,
    subject,
    html
  });
}

module.exports = enviarEmail;
