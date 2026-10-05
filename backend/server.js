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

const originProtection = require(
  "./Middlewares/originProtection"
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

function validateConfiguredUrl(
  variableName,
  options = {}
) {
  const {
    requireHttps = false,
    requireLocalhost = false,
    required = true,
  } = options;


  const rawValue =
    String(
      process.env[
        variableName
      ] || ""
    ).trim();


  if (!rawValue) {
    if (!required) {
      return null;
    }

    throw new Error(
      `${variableName} não configurado.`
    );
  }


  let configuredUrl;

  try {
    configuredUrl =
      new URL(
        rawValue
      );

  } catch {
    throw new Error(
      `${variableName} inválido.`
    );
  }


  if (
    configuredUrl.username ||
    configuredUrl.password ||
    configuredUrl.search ||
    configuredUrl.hash
  ) {
    throw new Error(
      `${variableName} contém componentes não permitidos.`
    );
  }


  if (
    configuredUrl.pathname !==
      "/" &&
    configuredUrl.pathname !==
      ""
  ) {
    throw new Error(
      `${variableName} não deve conter caminho.`
    );
  }


  if (
    requireHttps &&
    configuredUrl.protocol !==
      "https:"
  ) {
    throw new Error(
      `${variableName} deve utilizar HTTPS.`
    );
  }


  if (
    !requireHttps &&
    configuredUrl.protocol !==
      "http:" &&
    configuredUrl.protocol !==
      "https:"
  ) {
    throw new Error(
      `${variableName} deve utilizar HTTP ou HTTPS.`
    );
  }


  if (requireLocalhost) {
    const hostname =
      configuredUrl.hostname
        .toLowerCase();


    const isLocalhost =
      hostname ===
        "localhost" ||
      hostname ===
        "127.0.0.1" ||
      hostname ===
        "::1";


    if (!isLocalhost) {
      throw new Error(
        `${variableName} deve apontar para localhost.`
      );
    }
  }


  return configuredUrl.origin;
}


function validateApplicationUrls() {
  const productionUrl =
    validateConfiguredUrl(
      "APP_URL",
      {
        requireHttps: true,
      }
    );


  const localUrl =
    validateConfiguredUrl(
      "APP_URL_LOCAL",
      {
        requireLocalhost:
          true,

        required:
          false,
      }
    );


  process.env.APP_URL =
    productionUrl;


  if (localUrl) {
    process.env.APP_URL_LOCAL =
      localUrl;

  } else {
    delete process.env.APP_URL_LOCAL;
  }


  console.log(
    `[SERVER] APP_URL: ${productionUrl}.`
  );


  if (localUrl) {
    console.log(
      `[SERVER] APP_URL_LOCAL: ${localUrl}.`
    );

  } else {
    console.log(
      "[SERVER] APP_URL_LOCAL não configurado."
    );
  }
}


// ==============================
// Proxy
// ==============================

app.set(
  "trust proxy",
  trustProxyHops
);


// ==============================
// Security
// ==============================

app.disable(
  "x-powered-by"
);


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
        ],

        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
        ],

        scriptSrcAttr: [
          "'none'",
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com",
        ],

        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https:",
        ],

        connectSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],

        objectSrc: [
          "'none'",
        ],

        frameSrc: [
          "'none'",
        ],

        frameAncestors: [
          "'none'",
        ],

        baseUri: [
          "'self'",
        ],

        formAction: [
          "'self'",
        ],

        upgradeInsecureRequests:
          null,
      },
    },
  })
);


// ==============================
// Origin protection
// ==============================

app.use(
  originProtection
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


    validateApplicationUrls();


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