const fs = require(
  "fs"
);

const path = require(
  "path"
);

const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);


const projectRoot =
  path.resolve(
    __dirname,
    "../.."
  );


function readProjectFile(
  relativePath
) {
  return fs.readFileSync(
    path.join(
      projectRoot,
      relativePath
    ),
    "utf8"
  );
}


const checks = [
  {
    file:
      "frontend/src/pages/home.html",

    forbidden: [
      "House conhecida",
      "Secto conhecido",
    ],
  },

  {
    file:
      "frontend/src/pages/main.html",

    forbidden: [
      ">Houses<",
      "Crie uma House",
      "House mãe",
      "Buscar House",
      "Nenhuma House",
      "Criar House",
      "Nome da House",
      "proprietário da House",
      "vinculados a uma House",
      "pela própria House",
    ],
  },

  {
    file:
      "frontend/src/js/main/house/houseForm.js",

    forbidden: [
      "Informe o nome da House.",
      "Não foi possível criar a House.",
      "Criar House",
    ],
  },

  {
    file:
      "frontend/src/js/main/house/houseSearch.js",

    forbidden: [
      "Não foi possível pesquisar as Houses.",
    ],
  },

  {
    file:
      "frontend/src/js/main/house/houses.js",

    forbidden: [
      "nenhuma House cadastrada",
      "Criar minha primeira House",
      "+ Criar House",
      "Não foi possível carregar suas Houses.",
    ],
  },

  {
    file:
      "frontend/src/js/main/character/characterForm.js",

    forbidden: [
      "solicitação de House enviada",
    ],
  },

  {
    file:
      "frontend/src/js/main/character/characterChronicleSelector.js",

    forbidden: [
      "Pesquisando Houses",
      "Nenhuma House",
      "sem House",
    ],
  },

  {
    file:
      "backend/controllers/houseController.js",

    forbidden: [
      "Informe o nome da House.",
      "O nome da House deve possuir",
      "Não foi possível criar a House.",
      "Não foi possível carregar suas Houses.",
      "Não foi possível pesquisar as Houses.",
    ],
  },

  {
    file:
      "backend/routes/houseRoutes.js",

    forbidden: [
      "Muitas tentativas de criação de House.",
    ],
  },
];


for (
  const check
  of checks
) {
  test(
    `${check.file} uses Chronicle terminology`,
    () => {
      const source =
        readProjectFile(
          check.file
        );


      for (
        const forbiddenText
        of check.forbidden
      ) {
        assert.equal(
          source.includes(
            forbiddenText
          ),
          false,
          `${check.file} still contains "${forbiddenText}"`
        );
      }
    }
  );
}