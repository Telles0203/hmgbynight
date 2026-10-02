window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };

async function loadCharacters() {
  try {
    const response =
      await fetch(
        "/api/characters",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
          "Não foi possível carregar os personagens."
      );
    }

    const characters =
      Array.isArray(
        data.characters
      )
        ? data.characters
        : [];

    window.ByNightMain.character.characters =
      characters;

    renderCharacters(
      characters
    );
  } catch (error) {
    console.error(
      "[CHARACTER] Erro ao carregar personagens:",
      error
    );

    window.ByNightMain.character.characters =
      [];

    renderCharacterError();
  }
}

function renderCharacters(
  characters
) {
  const createButton =
    document.getElementById(
      "createCharacterButton"
    );

  if (!createButton) {
    return;
  }

  const container =
    createButton.closest(
      ".mt-auto"
    );

  if (!container) {
    return;
  }

  if (characters.length === 0) {
    container.innerHTML = `
      <p class="text-secondary small">
        Você ainda não possui personagens cadastrados.
      </p>

      <button
        id="createCharacterButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createCharacterModal"
      >
        Criar meu primeiro personagem
      </button>
    `;

    return;
  }

  const characterCards =
    characters
      .map(
        (character) => {
          const id =
            escapeCharacterHtml(
              character.id
            );

          const name =
            escapeCharacterHtml(
              character.name
            );

          const clanName =
            escapeCharacterHtml(
              character.clanDisplayName ||
              character.clan ||
              ""
            );

          const sectName =
            escapeCharacterHtml(
              window.getSectLabel?.(
                character.sect
              ) ||
              character.sect ||
              ""
            );

          const houseText =
            character.motherHouse
              ? "Vinculado a uma House"
              : "Sem House";

          return `
            <div
              class="border border-secondary rounded p-3 mb-2"
            >
              <div
                class="d-flex justify-content-between align-items-center gap-3"
              >

                <div>

                  <h3
                    class="h6 text-light mb-1"
                  >
                    ${name}
                  </h3>

                  ${
                    clanName
                      ? `
                        <div class="text-secondary small">
                          ${clanName}
                        </div>
                      `
                      : ""
                  }

                  <div class="text-secondary small">
                    ${
                      sectName
                        ? `${sectName} · `
                        : ""
                    }${houseText}
                  </div>

                </div>

                <button
                  type="button"
                  class="btn btn-outline-light btn-sm"
                  data-character-id="${id}"
                  onclick="openCharacterView(this.dataset.characterId)"
                >
                  Abrir →
                </button>

              </div>
            </div>
          `;
        }
      )
      .join("");

  container.innerHTML = `
    <div
      id="characterList"
      class="mb-3"
    >
      ${characterCards}
    </div>

    <button
      id="createCharacterButton"
      type="button"
      class="btn btn-blood w-100"
      data-bs-toggle="modal"
      data-bs-target="#createCharacterModal"
    >
      + Criar personagem
    </button>
  `;
}

function renderCharacterError() {
  const createButton =
    document.getElementById(
      "createCharacterButton"
    );

  if (!createButton) {
    return;
  }

  const container =
    createButton.closest(
      ".mt-auto"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="alert alert-danger mb-3"
      role="alert"
    >
      Não foi possível carregar seus personagens.
    </div>

    <button
      id="createCharacterButton"
      type="button"
      class="btn btn-blood w-100"
      data-bs-toggle="modal"
      data-bs-target="#createCharacterModal"
    >
      + Criar personagem
    </button>
  `;
}

function escapeCharacterHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );

  element.textContent =
    String(value || "");

  return element.innerHTML;
}

window.loadCharacters =
  loadCharacters;

window.renderCharacters =
  renderCharacters;