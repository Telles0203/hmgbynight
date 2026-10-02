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
      Array.isArray(data.characters)
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


// ==============================
// Render
// ==============================

function renderCharacters(
  characters
) {
  const container =
    document.getElementById(
      "characterListContainer"
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

  const cards =
    characters
      .map(
        (character) =>
          createCharacterCard(
            character
          )
      )
      .join("");

  container.innerHTML = `
    <div id="characterList">
      ${cards}
    </div>

    <div
      id="characterCreateArea"
      class="mt-3"
    >
      <button
        id="createCharacterButton"
        type="button"
        class="btn btn-blood w-100"
        data-bs-toggle="modal"
        data-bs-target="#createCharacterModal"
      >
        + Criar personagem
      </button>
    </div>
  `;
}


// ==============================
// Character card
// ==============================

function createCharacterCard(
  character
) {
  const id =
    escapeCharacterHtml(
      character.id
    );

  const name =
    escapeCharacterHtml(
      character.name
    );

  const clan =
    escapeCharacterHtml(
      character.clanDisplayName ||
      character.clan ||
      ""
    );

  const sect =
    escapeCharacterHtml(
      window.getSectLabel?.(
        character.sect
      ) ||
      character.sect ||
      ""
    );

  const house =
    character.motherHouse
      ? "Vinculado a uma House"
      : "Sem House";

  return `
    <article
      class="character-card"
      data-character-id="${id}"
    >

      <div class="character-card-header">

        <div class="character-card-identity">

          <h3
            class="character-card-name h6 text-light mb-1"
          >
            ${name}
          </h3>

          ${
            clan
              ? `
                <div class="text-secondary small">
                  ${clan}
                </div>
              `
              : ""
          }

          <div class="text-secondary small">
            ${
              sect
                ? `${sect} · `
                : ""
            }${house}
          </div>

        </div>

        <button
          type="button"
          class="btn btn-outline-light btn-sm character-open-button"
          data-character-id="${id}"
          onclick="toggleCharacterView(this.dataset.characterId)"
        >
          Abrir →
        </button>

      </div>


      <!-- Ficha que nasce dentro do próprio card -->

      <div class="character-card-details">

        <div class="character-card-details-inner">

          <div class="row g-3 pt-4">

            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Identidade
                </h4>

                <p class="text-secondary small mb-0">
                  Informações básicas do personagem.
                </p>

              </div>

            </div>


            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Atributos
                </h4>

                <p class="text-secondary small mb-0">
                  Físicos, Sociais e Mentais.
                </p>

              </div>

            </div>


            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Habilidades
                </h4>

                <p class="text-secondary small mb-0">
                  Habilidades do personagem.
                </p>

              </div>

            </div>


            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Disciplinas
                </h4>

                <p class="text-secondary small mb-0">
                  Disciplinas vampíricas.
                </p>

              </div>

            </div>


            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Antecedentes
                </h4>

                <p class="text-secondary small mb-0">
                  Antecedentes e recursos.
                </p>

              </div>

            </div>


            <div class="col-12 col-md-6">

              <div class="character-section-card">

                <h4 class="h6 text-light">
                  Outros
                </h4>

                <p class="text-secondary small mb-0">
                  Demais características.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </article>
  `;
}


// ==============================
// Error
// ==============================

function renderCharacterError() {
  const container =
    document.getElementById(
      "characterListContainer"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="alert alert-danger"
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


// ==============================
// Escape
// ==============================

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


// ==============================
// Globals
// ==============================

window.loadCharacters =
  loadCharacters;

window.renderCharacters =
  renderCharacters;