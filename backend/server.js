const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI/MONGODB_URI não definido no backend/.env");
  process.exit(1);
}

async function connectMongo() {
  await mongoose.connect(MONGO_URI, {
    dbName: process.env.DB_NAME || "bynight",
    autoIndex: true,
  });

  console.log("🟢 MongoDB conectado (mongoose)");
}


const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const publicDir = path.join(__dirname, "..", "frontend", "public");
const srcDir = path.join(__dirname, "..", "frontend", "src");

app.use("/src", express.static(srcDir));
app.use(express.static(publicDir));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (path.extname(req.path)) return next();
  return res.sendFile(path.join(publicDir, "index.html"));
});

(async () => {
  try {
    console.log("🔎 Conectando no MongoDB...");
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🔴 Falha ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  console.log("🟡 Encerrando... fechando MongoDB (mongoose)");
  await mongoose.connection.close().catch(() => {});
  process.exit(0);
});