const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { connectDB, disconnectDB } = require("../utils/db");

function gerarToken() {
  return Math.random().toString(36).substring(2, 12);
}

// REGISTRO
router.post("/register", async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;

  if (!name || !email || !password || password !== repeatPassword) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nome: name,
      email,
      senha: hashedPassword,
      criadoEm: new Date(),
      statusEmail: "pendente",
      businessPlan: "Free",
      tokenValidacao: gerarToken(),
      isStoryteller: false,
      isPlayer: false,
      houses: [],
      characters: [],
      warning: true,
      warningList: {
        emailCheck: false,
        introTip: false,
      }
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso" });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ error: "Erro no servidor" });
  } finally {
    await disconnectDB();
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "E-mail não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.status(200).json({ message: "Login bem-sucedido!" });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no servidor" });
  } finally {
    await disconnectDB();
  }
});





router.get("/check-token", (req, res) => {
    const token = req.cookies?.token;
  
    if (!token) {
      console.log("🔒 check-token: sem token");
      return res.json({ loggedIn: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ check-token: token válido para ID:", decoded.id);
      return res.json({ loggedIn: true, userId: decoded.id });
    } catch (err) {
      console.log("❌ check-token: token inválido:", err.message);
      return res.json({ loggedIn: false });
    }
  });
  
  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout realizado com sucesso" });
  });
  
module.exports = router;