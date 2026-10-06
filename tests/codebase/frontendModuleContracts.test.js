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


const frontendRoot =
  path.resolve(
    __dirname,
    "../../frontend/src/js"
  );


function walkJavaScriptFiles(
  directory
) {
  return fs
    .readdirSync(
      directory,
      {
        withFileTypes:
          true,
      }
    )
    .flatMap(
      (
        entry
      ) => {
        const fullPath =
          path.join(
            directory,
            entry.name
          );


        if (
          entry.isDirectory()
        ) {
          return walkJavaScriptFiles(
            fullPath
          );
        }


        if (
          entry.isFile() &&
          entry.name.endsWith(
            ".js"
          )
        ) {
          return [
            fullPath,
          ];
        }


        return [];
      }
    );
}


function readFile(
  filePath
) {
  return fs.readFileSync(
    filePath,
    "utf8"
  );
}


function normalizeSpecifierPath(
  importerPath,
  specifier
) {
  const resolved =
    path.resolve(
      path.dirname(
        importerPath
      ),
      specifier
    );


  if (
    path.extname(
      resolved
    )
  ) {
    return resolved;
  }


  return `${resolved}.js`;
}


function parseExportList(
  list
) {
  return String(
    list ||
    ""
  )
    .split(
      ","
    )
    .map(
      (
        item
      ) =>
        item
          .replace(
            /\/\*[\s\S]*?\*\//g,
            ""
          )
          .trim()
    )
    .filter(
      Boolean
    )
    .map(
      (
        item
      ) => {
        const parts =
          item.split(
            /\s+as\s+/
          );


        return {
          imported:
            parts[0]
              ?.trim() ||
            "",

          exported:
            parts[1]
              ?.trim() ||
            parts[0]
              ?.trim() ||
            "",
        };
      }
    );
}


function getNamedExports(
  source
) {
  const exports =
    new Set();


  const directPattern =
    /export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g;


  let match;


  while (
    (
      match =
        directPattern.exec(
          source
        )
    )
  ) {
    exports.add(
      match[1]
    );
  }


  const listPattern =
    /export\s*{([\s\S]*?)}(?:\s*from\s*["'][^"']+["'])?\s*;?/g;


  while (
    (
      match =
        listPattern.exec(
          source
        )
    )
  ) {
    parseExportList(
      match[1]
    ).forEach(
      (
        item
      ) => {
        if (
          item.exported
        ) {
          exports.add(
            item.exported
          );
        }
      }
    );
  }


  return exports;
}


function getNamedImports(
  source
) {
  const imports =
    [];


  const pattern =
    /import\s*{([\s\S]*?)}\s*from\s*["']([^"']+)["']\s*;?/g;


  let match;


  while (
    (
      match =
        pattern.exec(
          source
        )
    )
  ) {
    imports.push({
      specifier:
        match[2],

      names:
        parseExportList(
          match[1]
        ).map(
          (
            item
          ) =>
            item.imported
        ),
    });
  }


  return imports;
}


test(
  "frontend relative named imports match module exports",
  () => {
    const files =
      walkJavaScriptFiles(
        frontendRoot
      );


    files.forEach(
      (
        importerPath
      ) => {
        const importerSource =
          readFile(
            importerPath
          );


        getNamedImports(
          importerSource
        ).forEach(
          ({
            specifier,
            names,
          }) => {
            if (
              !specifier.startsWith(
                "."
              )
            ) {
              return;
            }


            const importedPath =
              normalizeSpecifierPath(
                importerPath,
                specifier
              );


            assert.equal(
              fs.existsSync(
                importedPath
              ),
              true,
              `${path.relative(frontendRoot, importerPath)} importa um módulo inexistente: ${specifier}`
            );


            const exportedNames =
              getNamedExports(
                readFile(
                  importedPath
                )
              );


            names.forEach(
              (
                importedName
              ) => {
                assert.equal(
                  exportedNames.has(
                    importedName
                  ),
                  true,
                  `${path.relative(frontendRoot, importerPath)} importa "${importedName}" de ${specifier}, mas esse módulo não exporta esse nome.`
                );
              }
            );
          }
        );
      }
    );
  }
);