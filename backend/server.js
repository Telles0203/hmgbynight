const path = require(
  "path"
);

const express = require(
  "express"
);

const mongoose = require(
  "mongoose"
);

const cookieParser = require(
  "cookie-parser"
);

const helmet = require(
  "helmet"
);

const dotenv = require(
  "dotenv"
);


dotenv.config({
  path:
    path.join(
      __dirname,
      ".env"
    ),
});


const authRoutes = require(
  "./routes/authRoutes"
);

const characterRoutes = require(
  "./routes/characterRoutes"
);

const houseRoutes = require(
  "./routes/houseRoutes"
);


const app =
  express();


const PORT =
  Number(
    process.env.PORT ||
    8080
  );


const trustProxyHops =
  Number(
    process.env.TRUST_PROXY_HOPS ||
    1
  );


const publicPath =
  path.join(
    __dirname,
    "../frontend/public"
  );


const srcPath =
  path.join(
    __dirname,
    "../frontend/src"
  );


const indexPath =
  path.join(
    publicPath,
    "index.html"
  );


// ==============================
// Environment validation
// ==============================

function validateApplicationUrl() {
  const rawApplicationUrl =
    String(
      process.env.APP_URL || ""
    ).trim();

  if (!rawApplicationUrl) {
    throw new Error(
      "APP_URL não configurado."
    );
  }


  let applicationUrl;

  try {
    applicationUrl =
      new URL(
        rawApplicationUrl
      );
  } catch {
    throw new Error(
      "APP_URL inválido."
    );
  }


  const isLocalhost =
    applicationUrl.hostname ===
      "localhost" ||
    applicationUrl.hostname ===
      "127.0.0.1";


  if (
    applicationUrl.protocol !==
      "https:" &&
    !isLocalhost
  ) {
    throw new Error(
      "APP_URL deve utilizar HTTPS fora do ambiente local."
    );
  }


  process.env.APP_URL =
    applicationUrl
      .toString()
      .replace(
        /\/+$/,
        ""
      );
}


// ==============================
// Proxy
// ==============================

app.set(
  "trust proxy",
  trustProxyHops
);


// ==============================
// Basic security
// ==============================

app.disable(
  "x-powered-by"
);


app.use(
  helmet({
    contentSecurityPolicy:
      false,
  })
);


// ==============================
// Parsers
// ==============================

app.use(
  express.json({
    limit:
      "100kb",
  })
);

app.use(
  cookieParser()
);


// ==============================
// API
// ==============================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/characters",
  characterRoutes
);


app.use(
  "/api/houses",
  houseRoutes
);


// ==============================
// Frontend source files
// ==============================

app.use(
  "/src",
  express.static(
    srcPath
  )
);


// ==============================
// Root redirect
// ==============================

app.get(
  "/",
  (
    req,
    res
  ) => {
    return res.redirect(
      302,
      "/home"
    );
  }
);


// ==============================
// Public files
// ==============================

app.use(
  express.static(
    publicPath
  )
);


// ==============================
// Unknown API route
// ==============================

app.use(
  "/api",
  (
    req,
    res
  ) => {
    return res
      .status(404)
      .json({
        ok: false,

        error:
          "Rota não encontrada.",
      });
  }
);


// ==============================
// SPA fallback
// ==============================

app.use(
  (
    req,
    res,
    next
  ) => {
    if (
      req.method !==
      "GET"
    ) {
      return next();
    }

    return res.sendFile(
      indexPath
    );
  }
);


// ==============================
// Remaining 404
// ==============================

app.use(
  (
    req,
    res
  ) => {
    return res
      .status(404)
      .json({
        ok: false,

        error:
          "Rota não encontrada.",
      });
  }
);


let server =
  null;


// ==============================
// Start
// ==============================

async function startServer() {
  try {
    if (
      !process.env.MONGO_URI
    ) {
      throw new Error(
        "MONGO_URI não configurado."
      );
    }


    validateApplicationUrl();


    await mongoose.connect(
      process.env.MONGO_URI,
      {
        dbName:
          process.env.DB_NAME ||
          "bynight",
      }
    );


    console.log(
      "[DATABASE] MongoDB conectado."
    );


    server =
      app.listen(
        PORT,
        () => {
          console.log(
            `[SERVER] Rodando na porta ${PORT}.`
          );
        }
      );

  } catch (error) {
    console.error(
      "[SERVER] Erro ao iniciar:",
      error
    );

    process.exit(1);
  }
}


// ==============================
// Shutdown
// ==============================

async function shutdown(
  signal
) {
  console.log(
    `[SERVER] ${signal} recebido. Encerrando...`
  );


  try {
    if (server) {
      await new Promise(
        (resolve) => {
          server.close(
            resolve
          );
        }
      );
    }


    await mongoose.disconnect();


    console.log(
      "[SERVER] Encerrado com sucesso."
    );


    process.exit(0);

  } catch (error) {
    console.error(
      "[SERVER] Erro ao encerrar:",
      error
    );

    process.exit(1);
  }
}


process.on(
  "SIGINT",
  () =>
    shutdown(
      "SIGINT"
    )
);


process.on(
  "SIGTERM",
  () =>
    shutdown(
      "SIGTERM"
    )
);


startServer();