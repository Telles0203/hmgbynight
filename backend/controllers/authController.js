const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: "name, email e password são obrigatórios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "password deve ter pelo menos 6 caracteres" });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ ok: false, error: "E-mail já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
    });

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

    const user = await User.findById(req.user.sub).select("name email createdAt updatedAt");
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

module.exports = { register, login, me, logout };