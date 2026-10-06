const fs = require(
  "fs"
);

const path = require(
  "path"
);

const {
  spawnSync,
} = require(
  "child_process"
);


const projectRoot =
  path.resolve(
    __dirname,
    ".."
  );


const roots = [
  path.join(
    projectRoot,
    "backend"
  ),

  path.join(
    projectRoot,
    "frontend",
    "src",
    "js"
  ),

  path.join(
    projectRoot,
    "tests"
  ),

  path.join(
    projectRoot,
    "scripts"
  ),
];


function collectJavaScriptFiles(
  directory
) {
  if (
    !fs.existsSync(
      directory
    )
  ) {
    return [];
  }


  const entries =
    fs.readdirSync(
      directory,
      {
        withFileTypes:
          true,
      }
    );


  const files =
    [];


  for (
    const entry
    of entries
  ) {
    const entryPath =
      path.join(
        directory,
        entry.name
      );


    if (
      entry.isDirectory()
    ) {
      files.push(
        ...collectJavaScriptFiles(
          entryPath
        )
      );

      continue;
    }


    if (
      entry.isFile() &&
      entry.name.endsWith(
        ".js"
      )
    ) {
      files.push(
        entryPath
      );
    }
  }


  return files;
}


function isModuleSource(
  source
) {
  return /^\s*(import|export)\s/m.test(
    source
  );
}


function checkJavaScriptFile(
  filePath
) {
  const source =
    fs.readFileSync(
      filePath,
      "utf8"
    );


  const moduleSource =
    isModuleSource(
      source
    );


  const result =
    moduleSource
      ? spawnSync(
          process.execPath,
          [
            "--input-type=module",
            "--check",
          ],
          {
            input:
              source,

            encoding:
              "utf8",
          }
        )
      : spawnSync(
          process.execPath,
          [
            "--check",
            filePath,
          ],
          {
            encoding:
              "utf8",
          }
        );


  if (
    result.status ===
    0
  ) {
    return;
  }


  const relativePath =
    path.relative(
      projectRoot,
      filePath
    );


  console.error(
    `\n[CHECK] Erro de sintaxe em ${relativePath}.`
  );


  if (result.stderr) {
    console.error(
      result.stderr.trim()
    );
  }


  process.exitCode =
    1;
}


const files =
  roots.flatMap(
    collectJavaScriptFiles
  );


for (
  const file
  of files
) {
  checkJavaScriptFile(
    file
  );
}


if (
  process.exitCode
) {
  process.exit(
    process.exitCode
  );
}


console.log(
  `[CHECK] ${files.length} arquivos JavaScript validados.`
);