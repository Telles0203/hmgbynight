const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = express();

const PORT = process.env.PORT || 8080;

// ==============================
// Proxy
// ==============================

const trustProxyHops = Number.parseInt(
  process.env.TRUST_PROXY_HOPS || "1",
  10
);

if (
  Number.isNaN(trustProxyHops) ||
  trustProxyHops < 0
) {
  console.error(
    "❌ TRUST_PROXY_HOPS possui um valor inválido."
  );

  process.exit(1);
}

app.set(
  "trust proxy",
  trustProxyHops
);

// Remove identificação do Express
app.disable("x-powered-by");

// ==============================
// Middlewares
// ==============================

app.use(express.json({
  limit: "100kb",
}));

app.use(cookieParser());

// ==============================
// API Routes
// ==============================

const authRoutes = require(
  "./routes/authRoutes"
);

app.use(
  "/api/auth",
  authRoutes
);

// ==============================
// MongoDB
// ==============================

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error(
    "❌ MONGO_URI/MONGODB_URI não definido no backend/.env"
  );

  process.exit(1);
}

async function connectMongo() {
  await mongoose.connect(
    MONGO_URI,
    {
      dbName:
        process.env.DB_NAME ||
        "bynight",

      autoIndex: true,
    }
  );

  console.log(
    "🟢 MongoDB conectado"
  );
}

// ==============================
// Frontend
// ==============================

const publicDir = path.join(
  __dirname,
  "..",
  "frontend",
  "public"
);

const srcDir = path.join(
  __dirname,
  "..",
  "frontend",
  "src"
);

app.use(
  "/src",
  express.static(srcDir)
);

app.use(
  express.static(publicDir)
);

// ==============================
// API 404
// ==============================

app.use(
  "/api",
  (req, res) => {
    return res.status(404).json({
      ok: false,
      error:
        "Endpoint não encontrado.",
    });
  }
);

// ==============================
// SPA fallback
// ==============================

app.use(
  (req, res, next) => {
    if (path.extname(req.path)) {
      return next();
    }

    return res.sendFile(
      path.join(
        publicDir,
        "index.html"
      )
    );
  }
);

// ==============================
// Start server
// ==============================

async function startServer() {
  try {
    console.log(
      "🔎 Conectando no MongoDB..."
    );

    await connectMongo();

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Servidor rodando na porta ${PORT}`
        );

        console.log(
          `🔐 Trust proxy: ${trustProxyHops} hop(s)`
        );
      }
    );
  } catch (error) {
    console.error(
      "🔴 Falha ao iniciar servidor:",
      error.message
    );

    process.exit(1);
  }
}

startServer();

// ==============================
// Graceful shutdown
// ==============================

async function shutdown(signal) {
  console.log(
    `🟡 ${signal} recebido. Encerrando servidor...`
  );

  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error(
      "🔴 Erro ao fechar MongoDB:",
      error.message
    );
  }

  process.exit(0);
}

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);