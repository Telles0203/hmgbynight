function escapeHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ?? ""
    );


  return element.innerHTML;
}


function getRoleLabel(
  role
) {
  switch (role) {
    case "owner":
      return "Proprietário";

    case "admin":
      return "Administrador";

    case "narrator":
      return "Narrador";

    case "member":
      return "Jogador";

    default:
      return "Membro";
  }
}


function getCharacterOwnerLabel(
  character
) {
  return (
    character?.owner?.name ||
    (
      character?.type ===
      "NPC"
        ? "Crônica"
        : "Jogador não disponível"
    )
  );
}


function createStatCard(
  label,
  value
) {
  return `
    <div class="col-6 col-lg-3">
      <div
        class="
          chronicle-stat-card
          h-100
        "
      >
        <div class="chronicle-stat-label">
          ${escapeHtml(
            label
          )}
        </div>

        <div class="chronicle-stat-value">
          ${escapeHtml(
            value
          )}
        </div>
      </div>
    </div>
  `;
}


function createPendingCharacterCard(
  character,
  canManage
) {
  const id =
    escapeHtml(
      character.id
    );


  const name =
    escapeHtml(
      character.name
    );


  const owner =
    escapeHtml(
      getCharacterOwnerLabel(
        character
      )
    );


  const clan =
    escapeHtml(
      character.clanDisplayName ||
      character.clan ||
      ""
    );


  return `
    <article
      class="chronicle-section-card"
      data-pending-character-id="${id}"
    >
      <div
        class="
          d-flex
          flex-column
          flex-lg-row
          justify-content-between
          gap-3
        "
      >

        <div>
          <div class="chronicle-card-title">
            ${name}
          </div>

          <div class="chronicle-card-subtext">
            Jogador: ${owner}
          </div>

          ${
            clan
              ? `
                <div class="chronicle-card-subtext">
                  ${clan}
                </div>
              `
              : ""
          }
        </div>

        ${
          canManage
            ? `
              <div
                class="
                  d-flex
                  flex-wrap
                  gap-2
                  align-items-start
                "
              >

                <button
                  type="button"
                  class="
                    btn
                    btn-sm
                    chronicle-approve-character
                  "
                  data-character-id="${id}"
                >
                  Aprovar
                </button>

                <button
                  type="button"
                  class="
                    btn
                    btn-sm
                    chronicle-reject-character
                  "
                  data-character-id="${id}"
                >
                  Rejeitar
                </button>

              </div>
            `
            : ""
        }

      </div>
    </article>
  `;
}


function createCharacterCard(
  character
) {
  const name =
    escapeHtml(
      character.name
    );


  const owner =
    escapeHtml(
      getCharacterOwnerLabel(
        character
      )
    );


  const clan =
    escapeHtml(
      character.clanDisplayName ||
      character.clan ||
      ""
    );


  const type =
    escapeHtml(
      character.type ||
      ""
    );


  return `
    <article class="chronicle-section-card">

      <div class="chronicle-card-title">
        ${name}
      </div>

      <div class="chronicle-card-subtext">
        ${type}
        ${
          clan
            ? ` · ${clan}`
            : ""
        }
      </div>

      <div class="chronicle-card-subtext mt-1">
        Responsável: ${owner}
      </div>

    </article>
  `;
}


function createMemberCard(
  member,
  canManageMembers
) {
  const id =
    escapeHtml(
      member.id
    );


  const name =
    escapeHtml(
      member.user?.name ||
      "Usuário"
    );


  const email =
    escapeHtml(
      member.user?.email ||
      ""
    );


  const role =
    member.role ||
    "member";


  const roleLabel =
    escapeHtml(
      getRoleLabel(
        role
      )
    );


  const editable =
    canManageMembers &&
    role !==
      "owner";


  return `
    <article
      class="chronicle-section-card"
      data-chronicle-member-id="${id}"
    >

      <div
        class="
          d-flex
          flex-column
          flex-lg-row
          justify-content-between
          gap-3
        "
      >

        <div>

          <div class="chronicle-card-title">
            ${name}
          </div>

          ${
            email
              ? `
                <div class="chronicle-card-subtext">
                  ${email}
                </div>
              `
              : ""
          }

          <div class="mt-2">
            <span
              class="chronicle-role-badge"
            >
              ${roleLabel}
            </span>
          </div>

        </div>

        ${
          editable
            ? `
              <div
                class="
                  d-flex
                  flex-column
                  flex-sm-row
                  gap-2
                  align-items-sm-start
                "
              >

                <select
                  class="
                    form-select
                    form-select-sm
                    bg-black
                    text-light
                    border-secondary
                    chronicle-member-role
                  "
                  aria-label="Papel do membro"
                >

                  <option
                    value="admin"
                    ${
                      role ===
                        "admin"
                        ? "selected"
                        : ""
                    }
                  >
                    Administrador
                  </option>

                  <option
                    value="narrator"
                    ${
                      role ===
                        "narrator"
                        ? "selected"
                        : ""
                    }
                  >
                    Narrador
                  </option>

                  <option
                    value="member"
                    ${
                      role ===
                        "member"
                        ? "selected"
                        : ""
                    }
                  >
                    Jogador
                  </option>

                </select>

                <button
                  type="button"
                  class="
                    btn
                    btn-sm
                    chronicle-save-member-role
                  "
                  data-member-id="${id}"
                >
                  Salvar
                </button>

              </div>
            `
            : ""
        }

      </div>

    </article>
  `;
}


export function renderChronicleLoading(
  container
) {
  container.innerHTML = `
    <div
      class="
        chronicle-management-loading
        text-secondary
      "
    >
      Carregando Crônica...
    </div>
  `;
}


export function renderChronicleError(
  container,
  message
) {
  container.innerHTML = `
    <div
      class="alert alert-danger mb-0"
      role="alert"
    >
      ${escapeHtml(
        message
      )}
    </div>
  `;
}


export function renderChronicleManagement(
  container,
  data
) {
  const membership =
    data.membership;


  const members =
    Array.isArray(
      data.members
    )
      ? data.members
      : [];


  const characters =
    Array.isArray(
      data.characters
    )
      ? data.characters
      : [];


  const pendingCharacters =
    Array.isArray(
      data.pendingCharacters
    )
      ? data.pendingCharacters
      : [];


  const permissions =
    membership?.permissions ||
    {};


  const canManageCharacters =
    permissions
      .canManageCharacters ===
    true;


  const canManageMembers =
    permissions
      .canManageMembers ===
    true;


  const canManageHouse =
    permissions
      .canManageHouse ===
    true;


  const narrativeTeamCount =
    members.filter(
      (member) =>
        [
          "owner",
          "admin",
          "narrator",
        ].includes(
          member.role
        )
    ).length;


  const playerCount =
    members.filter(
      (member) =>
        member.role ===
        "member"
    ).length;


  container.innerHTML = `
    <div class="chronicle-management-content">

      <div
        class="
          d-flex
          flex-column
          flex-md-row
          align-items-md-center
          justify-content-between
          gap-3
          mb-4
        "
      >

        <div>
          <div class="text-secondary small">
            Seu papel
          </div>

          <div class="text-light fw-semibold">
            ${escapeHtml(
              getRoleLabel(
                membership.role
              )
            )}
          </div>
        </div>

        <button
          type="button"
          class="
            btn
            btn-sm
            chronicle-refresh-button
          "
        >
          Atualizar
        </button>

      </div>


      <div
        id="chronicleManagementAlert"
        class="alert d-none"
        role="alert"
      ></div>


      <div class="row g-2 mb-4">

        ${createStatCard(
          "Equipe de Narração",
          narrativeTeamCount
        )}

        ${createStatCard(
          "Jogadores",
          playerCount
        )}

        ${createStatCard(
          "Personagens",
          characters.length
        )}

        ${createStatCard(
          "Solicitações",
          pendingCharacters.length
        )}

      </div>


      <div
        class="
          chronicle-tab-list
          mb-4
        "
        role="tablist"
      >

        <button
          type="button"
          class="
            chronicle-tab-button
            chronicle-tab-button-active
          "
          data-chronicle-tab="overview"
        >
          Visão geral
        </button>

        <button
          type="button"
          class="chronicle-tab-button"
          data-chronicle-tab="requests"
        >
          Solicitações
          ${
            pendingCharacters.length
              ? `(${pendingCharacters.length})`
              : ""
          }
        </button>

        <button
          type="button"
          class="chronicle-tab-button"
          data-chronicle-tab="characters"
        >
          Personagens
        </button>

        <button
          type="button"
          class="chronicle-tab-button"
          data-chronicle-tab="people"
        >
          Pessoas
        </button>

        <button
          type="button"
          class="chronicle-tab-button"
          data-chronicle-tab="settings"
        >
          Configurações
        </button>

      </div>


      <section
        data-chronicle-pane="overview"
      >

        <h3 class="h5 text-light">
          Visão geral
        </h3>

        <p class="text-secondary">
          Gerencie os personagens, solicitações,
          jogadores e equipe de Narração desta Crônica.
        </p>

        ${
          pendingCharacters.length
            ? `
              <div
                class="
                  alert
                  alert-warning
                  mb-0
                "
              >
                Há
                <strong>
                  ${pendingCharacters.length}
                </strong>
                ${
                  pendingCharacters.length ===
                    1
                    ? "solicitação pendente"
                    : "solicitações pendentes"
                }
                de personagem.
              </div>
            `
            : `
              <div
                class="
                  chronicle-empty-message
                  mb-0
                "
              >
                Nenhuma solicitação de personagem está pendente.
              </div>
            `
        }

      </section>


      <section
        class="d-none"
        data-chronicle-pane="requests"
      >

        <h3 class="h5 text-light mb-3">
          Solicitações pendentes
        </h3>

        ${
          pendingCharacters.length
            ? pendingCharacters
                .map(
                  (character) =>
                    createPendingCharacterCard(
                      character,
                      canManageCharacters
                    )
                )
                .join("")
            : `
              <p class="text-secondary">
                Nenhuma solicitação pendente.
              </p>
            `
        }

      </section>


      <section
        class="d-none"
        data-chronicle-pane="characters"
      >

        <h3 class="h5 text-light mb-3">
          Personagens vinculados
        </h3>

        ${
          characters.length
            ? characters
                .map(
                  createCharacterCard
                )
                .join("")
            : `
              <p class="text-secondary">
                Nenhum personagem está vinculado a esta Crônica.
              </p>
            `
        }

      </section>


      <section
        class="d-none"
        data-chronicle-pane="people"
      >

        <h3 class="h5 text-light mb-3">
          Narradores e jogadores
        </h3>

        ${
          members.length
            ? members
                .map(
                  (member) =>
                    createMemberCard(
                      member,
                      canManageMembers
                    )
                )
                .join("")
            : `
              <p class="text-secondary">
                Nenhum membro encontrado.
              </p>
            `
        }

      </section>


      <section
        class="d-none"
        data-chronicle-pane="settings"
      >

        <h3 class="h5 text-light mb-3">
          Configurações
        </h3>

        ${
          canManageHouse
            ? `
              <form
                id="chronicleSettingsForm"
              >

                <div class="mb-3">

                  <label
                    for="chronicleSettingsName"
                    class="form-label text-secondary"
                  >
                    Nome da Crônica
                  </label>

                  <input
                    id="chronicleSettingsName"
                    type="text"
                    class="
                      form-control
                      bg-black
                      text-light
                      border-secondary
                    "
                    minlength="2"
                    maxlength="80"
                    value="${escapeHtml(
                      data.chronicle.name
                    )}"
                    required
                  >

                </div>

                <button
                  type="submit"
                  class="
                    btn
                    btn-blood
                    chronicle-save-settings
                  "
                >
                  Salvar configurações
                </button>

              </form>
            `
            : `
              <p class="text-secondary mb-0">
                Você pode visualizar esta Crônica,
                mas não possui permissão para alterar
                suas configurações.
              </p>
            `
        }

      </section>

    </div>
  `;
}


export function setActiveChronicleTab(
  container,
  tabName
) {
  container
    .querySelectorAll(
      ".chronicle-tab-button"
    )
    .forEach(
      (button) => {
        const active =
          button.dataset
            .chronicleTab ===
          tabName;


        button.classList.toggle(
          "chronicle-tab-button-active",
          active
        );
      }
    );


  container
    .querySelectorAll(
      "[data-chronicle-pane]"
    )
    .forEach(
      (pane) => {
        pane.classList.toggle(
          "d-none",
          pane.dataset
            .chroniclePane !==
            tabName
        );
      }
    );
}


export function showChronicleManagementAlert(
  container,
  message,
  type = "danger"
) {
  const alert =
    container.querySelector(
      "#chronicleManagementAlert"
    );


  if (!alert) {
    return;
  }


  alert.textContent =
    message;


  alert.className =
    `alert ${
      type === "success"
        ? "alert-success"
        : "alert-danger"
    }`;
}