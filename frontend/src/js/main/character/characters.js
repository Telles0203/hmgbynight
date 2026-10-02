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
      ? "Vinculado"
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


      <!-- ============================== -->
      <!-- CHARACTER SHEET -->
      <!-- ============================== -->

      <div class="character-card-details">

        <div class="character-card-details-inner">

          <div class="character-sheet">


            <!-- ============================== -->
            <!-- IDENTIDADE -->
            <!-- ============================== -->

            <div class="character-sheet-grid">

              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Vampiro
                </h4>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Clã
                  </span>

                  <span class="character-sheet-value">
                    ${clan || "—"}
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Geração
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Seita
                  </span>

                  <span class="character-sheet-value">
                    ${sect || "—"}
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    House
                  </span>

                  <span class="character-sheet-value">
                    ${house}
                  </span>

                </div>

              </section>


              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Personalidade
                </h4>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Natureza
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Comportamento
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Título
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

              </section>


              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Virtudes
                </h4>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Consciência
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Coragem
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

                <div class="character-sheet-row">

                  <span class="character-sheet-label">
                    Autocontrole
                  </span>

                  <span class="character-sheet-value">
                    —
                  </span>

                </div>

              </section>

            </div>


            <!-- ============================== -->
            <!-- RECURSOS -->
            <!-- ============================== -->

            <div
              class="character-sheet-grid character-sheet-resource-grid"
            >

              <section
                class="character-section-card character-sheet-section character-sheet-resource"
              >

                <h4 class="character-sheet-title">
                  Sangue Máximo
                </h4>

                <div class="character-sheet-pips">
                  ${createEmptyPips(10)}
                </div>

              </section>


              <section
                class="character-section-card character-sheet-section character-sheet-resource"
              >

                <h4 class="character-sheet-title">
                  Força de Vontade
                </h4>

                <div class="character-sheet-pips">
                  ${createEmptyPips(10)}
                </div>

              </section>


              <section
                class="character-section-card character-sheet-section character-sheet-resource"
              >

                <h4 class="character-sheet-title">
                  Trilha
                </h4>

                <div class="character-sheet-pips">
                  ${createEmptyPips(10)}
                </div>

              </section>

            </div>


            <!-- ============================== -->
            <!-- ATRIBUTOS -->
            <!-- ============================== -->

            <div class="character-sheet-grid">

              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Físicos / Negativos
                </h4>

                <div class="character-sheet-empty">
                  Nenhum traço cadastrado.
                </div>

              </section>


              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Sociais / Negativos
                </h4>

                <div class="character-sheet-empty">
                  Nenhum traço cadastrado.
                </div>

              </section>


              <section
                class="character-section-card character-sheet-section"
              >

                <h4 class="character-sheet-title">
                  Mentais / Negativos
                </h4>

                <div class="character-sheet-empty">
                  Nenhum traço cadastrado.
                </div>

              </section>

            </div>


            <!-- ============================== -->
            <!-- CORPO PRINCIPAL -->
            <!-- ============================== -->

            <div
              class="character-sheet-grid character-sheet-main-grid"
            >


              <!-- ABILITIES -->

              <section
                class="character-section-card character-sheet-section"
              >

                <div class="character-sheet-group">

                  <h4 class="character-sheet-title">
                    Habilidades
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhuma habilidade cadastrada.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Notas
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhuma nota cadastrada.
                  </div>

                </div>

              </section>


              <!-- DISCIPLINES -->

              <section
                class="character-section-card character-sheet-section"
              >

                <div class="character-sheet-group">

                  <h4 class="character-sheet-title">
                    Disciplinas
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhuma disciplina cadastrada.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Rituais
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhum ritual cadastrado.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Itens / Equipamentos
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhum equipamento cadastrado.
                  </div>

                </div>

              </section>


              <!-- BACKGROUNDS -->

              <section
                class="character-section-card character-sheet-section"
              >

                <div class="character-sheet-group">

                  <h4 class="character-sheet-title">
                    Antecedentes
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhum antecedente cadastrado.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Qualidades / Defeitos
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhuma característica cadastrada.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Influências
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhuma influência cadastrada.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Laços de Sangue / Vinculum
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhum vínculo cadastrado.
                  </div>

                </div>


                <div class="character-sheet-group">

                  <h4 class="character-sheet-subtitle">
                    Vitalidade
                  </h4>

                  <div class="character-sheet-empty">
                    Nenhum nível cadastrado.
                  </div>

                </div>

              </section>

            </div>

          </div>

        </div>

      </div>

    </article>
  `;
}


// ==============================
// Pips
// ==============================

function createEmptyPips(
  amount
) {
  return Array.from(
    {
      length: amount,
    },
    () =>
      '<span class="character-sheet-pip"></span>'
  ).join("");
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