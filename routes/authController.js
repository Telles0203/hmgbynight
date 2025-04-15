const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Avisos = require("../models/Avisos");
const { connectDB, disconnectDB } = require("../utils/db");
const enviarEmail = require("../utils/sendEmail");
const UserWarning = require("../models/UserWarnings");


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
        isEmailCheck: false,
        introTip: false,
      }
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso" });

    await enviarEmail(
        newUser.email,
        "Confirme seu cadastro no By Night",
        `<p>Olá ${newUser.nome},</p><p>Obrigado por se registrar!</p><p>Seu token de verificação: <strong>${newUser.tokenValidacao}</strong></p>`
      );

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
  

  router.get("/get-user-status", async (req, res) => {
    try {
      await connectDB();
  
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Não autenticado" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  
      console.log(`📧 Usuário: ${user.email} | | warningList: ${user.warningList} | warning: ${user.warning}`);
  
      res.json({
        email: user.email,
        warning: user.warning,
        warningList: user.warningList || {}
      });
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    } finally {
      await disconnectDB();
    }
  });
  


  router.post("/get-avisos", async (req, res) => {
    try {
      await connectDB();
  
      const avisoData = req.body;
      if (!Array.isArray(avisoData)) {
        return res.status(400).json({ error: "Dados inválidos" });
      }
  
      const avisosDocs = await Avisos.find({}, { _id: 0, __v: 0 });
      if (!avisosDocs || avisosDocs.length === 0) {
        return res.status(404).json({ error: "Nenhum aviso encontrado" });
      }
  
      const avisosCombinados = {};
      avisosDocs.forEach(doc => Object.assign(avisosCombinados, doc));
  
      const resultado = avisoData.map(aviso => ({
        key: aviso.key,
        htmlKey: aviso.htmlKey,
        html: avisosCombinados[aviso.htmlKey] || null
      }));
  
      res.json(resultado);
    } catch (err) {
      console.error("❌ Erro ao buscar avisos:", err);
      res.status(500).json({ error: "Erro ao buscar avisos" });
    } finally {
      await disconnectDB();
    }
  });
  
  
  router.post("/ocultar-aviso", async (req, res) => {
    try {
      await connectDB();
  
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Não autenticado" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  
      const { key } = req.body;
      if (!key || typeof key !== "string") {
        return res.status(400).json({ error: "Key inválida" });
      }
  
      user.warningList[key] = true;
      await user.save();
  
      res.json({ success: true });
    } catch (err) {
      console.error("❌ Erro ao ocultar aviso:", err);
      res.status(500).json({ error: "Erro interno" });
    } finally {
      await disconnectDB();
    }
  });
  
  

  
  

  router.get("/validar-token", async (req, res) => {
    try {
      await connectDB();
  
      const token = req.query.token;
      const jwtToken = req.cookies.token;
  
      if (!jwtToken || !token) return res.status(401).json({ valid: false });
  
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(404).json({ valid: false });
  
      const isValid = token === user.tokenValidacao;
  
      res.json({ valid: isValid });
    } catch (err) {
      console.error("❌ Erro ao validar token:", err);
      res.status(500).json({ valid: false });
    } finally {
      await disconnectDB();
    }
  });
  
  router.post("/confirmar-email", async (req, res) => {
    try {
      await connectDB();
  
      const jwtToken = req.cookies.token;
      const { token } = req.body;
  
      if (!jwtToken || !token) return res.status(400).json({ success: false });
  
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user || user.tokenValidacao !== token) {
        return res.status(403).json({ success: false });
      }
  
      user.warningList.isEmailCheck = true;
      await user.save();
  
      res.json({ success: true });
    } catch (err) {
      console.error("Erro ao confirmar e-mail:", err);
      res.status(500).json({ success: false });
    } finally {
      await disconnectDB();
    }
  });
  



  router.get("/get-user-warnings", async (req, res) => {
    try {
      await connectDB();
  
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Não autenticado" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || !user.warningList) return res.json([]);
      user.warningList = JSON.parse(JSON.stringify(user.warningList));
      const warningDefs = await UserWarning.find({}, { _id: 0, __v: 0 });
  
      const ativos = [];

      

      Object.getOwnPropertyNames(user.warningList).forEach(key => {
        const value = user.warningList[key];
        
        if (value === false) {
          const match = warningDefs.find(obj => obj[key]);
          if (match) {
            console.log(`✅ Key "${key}" encontrada com htmlKey: "${match[key]}"`);
            ativos.push({ key, htmlKey: match[key] });
          } else {
            console.warn(`⚠️ Key "${key}" não encontrada`);
          }
        }
      });
  
      res.json(ativos);
    } catch (err) {
      console.error("Erro ao buscar avisos pendentes:", err);
      res.status(500).json({ error: "Erro interno" });
    } finally {
      await disconnectDB();
    }
  });
  
  
  
  


  
module.exports = router;