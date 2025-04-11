const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { connectDB, disconnectDB } = require("../utils/db");

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
    const newUser = new User({ nome: name, email, senha: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });

  } catch (err) {
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

    res.status(200).json({ message: "Login bem-sucedido!" });

  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });

  } finally {
    await disconnectDB();
  }
});

module.exports = router;
