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