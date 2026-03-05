const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateEmailToken = require("../utils/generateToken");
const { sendEmailVerificationTokenMail } = require("../utils/zohoMail");
const { withMongo } = require("../utils/mongo");
const { ObjectId } = require("mongodb");

function cookieName() {
  return process.env.COOKIE_NAME || "hmg_auth";
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // em produção: true (https)
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}


async function register(req, res) {
  console.log("[REGISTER] START");

  try {
    const { name, email, password } = req.body;

    console.log("[REGISTER] BODY:", { name, email, passLen: password?.length });

    if (!name || !email || !password) {
      console.log("[REGISTER] Missing fields");
      return res.status(400).json({ ok: false, error: "name, email e password são obrigatórios" });
    }

    if (password.length < 6) {
      console.log("[REGISTER] Password too short");
      return res.status(400).json({ ok: false, error: "password deve ter pelo menos 6 caracteres" });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      console.log("[REGISTER] Email already exists:", cleanEmail);
      return res.status(409).json({ ok: false, error: "E-mail já cadastrado" });
    }

    console.log("[REGISTER] Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("[REGISTER] Creating user...");
    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash,
      isEmailValid: false, // se você já adicionou no schema
    });

    console.log("✅ [REGISTER] USER CREATED:", user._id.toString(), user.email);

    // 1) gerar token
    console.log("[REGISTER] Generating email token...");
    const emailToken = generateEmailToken(10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    console.log("✅ [REGISTER] TOKEN GENERATED:", emailToken, "EXPIRES:", expires.toISOString());

    // 2) salvar token no Mongo (ABRE > USA > FECHA)
    console.log("[REGISTER] Saving token in Mongo...");
    await withMongo(async (db) => {
      const users = db.collection("users");
      await users.updateOne(
        { _id: new ObjectId(user._id.toString()) },
        { $set: { emailVerificationToken: emailToken, emailVerificationExpires: expires } }
      );
    });
    console.log("✅ [REGISTER] TOKEN SAVED IN DB");

    // 3) enviar e-mail
    console.log("[REGISTER] Sending email...");
    try {
      await sendEmailVerificationTokenMail(user.email, emailToken);
      console.log("✅ [REGISTER] EMAIL SENT to:", user.email);
    } catch (mailErr) {
      console.error("❌ [REGISTER] EMAIL FAILED:", mailErr?.message || mailErr);
      // opcional: você pode decidir se quer bloquear o registro quando email falhar
      // return res.status(500).json({ ok: false, error: "Falha ao enviar e-mail de verificação." });
    }

    // 4) logar com JWT como já faz
    const token = signToken(user);
    res.cookie(cookieName(), token, cookieOptions());

    console.log("✅ [REGISTER] REGISTER OK - sending response");
    return res.json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email },
      emailVerification: { sent: true }, // só pra debug
    });
  } catch (err) {
    console.error("❌ [REGISTER] ERROR:", err?.message || err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email e password são obrigatórios" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ ok: false, error: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Credenciais inválidas" });
    }

    const token = signToken(user);
    res.cookie(cookieName(), token, cookieOptions());

    return res.json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


async function me(req, res) {
  try {

    const user = await User.findById(req.user.sub).select("name email isEmailValid createdAt updatedAt");
    if (!user) return res.status(404).json({ ok: false, error: "Usuário não encontrado" });

    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


function logout(req, res) {
  res.clearCookie(cookieName(), { path: "/" });
  return res.json({ ok: true });
}

async function sendEmailVerificationToken(req, res) {
  try {
    const userId = req.user.sub;

    const token = generateEmailToken(10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await withMongo(async (db) => {
      const users = db.collection("users");

      const found = await users.findOne({ _id: new ObjectId(userId) });
      if (!found) return null;

      await users.updateOne(
        { _id: found._id },
        { $set: { emailVerificationToken: token, emailVerificationExpires: expires } }
      );

      return { email: found.email };
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: "Usuário não encontrado." });
    }

    await sendEmailVerificationTokenMail(user.email, token);

    return res.json({
      ok: true,
      message: "Token de verificação gerado e enviado por e-mail.",
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erro ao enviar token." });
  }
}

async function verifyEmailToken(req, res) {
  try {
    const userId = req.user.sub;
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ ok: false, error: "Token é obrigatório." });
    }

    const cleanToken = token.trim();
    const now = new Date();

    const result = await withMongo(async (db) => {
      const users = db.collection("users");

      // 1) pega o usuário pelo ID
      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) return { ok: false, reason: "user_not_found" };

      // 2) compara token
      if (user.emailVerificationToken !== cleanToken) {
        return { ok: false, reason: "token_mismatch" };
      }

      // 3) valida expiração (NOME CERTO DO CAMPO)
      if (!user.emailVerificationExpires || new Date(user.emailVerificationExpires) <= now) {
        return { ok: false, reason: "token_expired" };
      }

      // 4) atualiza (NOME CERTO DO CAMPO)
      await users.updateOne(
        { _id: user._id },
        {
          $set: { isEmailValid: true },
          $unset: { emailVerificationToken: "", emailVerificationExpires: "" },
        }
      );

      return { ok: true };
    });

    if (!result.ok) {
      return res.status(400).json({
        ok: false,
        error: "Token inválido ou expirado.",
        debug: result.reason,
      });
    }

    return res.json({ ok: true, message: "E-mail verificado com sucesso." });
  } catch (err) {
    console.error("verifyEmailToken error:", err);
    return res.status(500).json({ ok: false, error: "Erro ao validar token de e-mail." });
  }
}


module.exports = { register, login, me, logout, sendEmailVerificationToken, verifyEmailToken };