const express = require("express");
const path = require("path");
const app = express();
const { testConnectDB } = require("./utils/db");
const dotenv = require("dotenv");

dotenv.config();



const PORT = 8080;



app.use((req, res, next) => {
  if (req.path === "/main.html") return next();
  express.static(path.join(__dirname, "public"))(req, res, next);
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Usa o controller com /register e /login
const authController = require("./routes/authController");
app.use("/", authController);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Verificação de e-mail
app.get("/check-email", async (req, res) => {
  const { connectDB, disconnectDB } = require("./utils/db");
  const User = require("./models/User");

  const email = req.query.email;
  if (!email) return res.status(400).json({ exists: false });

  try {
    await connectDB();
    console.log("🛠 Checando:", email);
    const existing = await User.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') });
    console.log("🔎 Resultado:", existing);
    res.json({ exists: !!existing });
  } catch (err) {
    console.error("Erro ao verificar e-mail:", err);
    res.status(500).json({ exists: false });
  } finally {
    await disconnectDB();
  }
});





const auth = require("./middlewares/auth");
app.get("/main.html", auth, (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});






(async () => {
  await testConnectDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})();

