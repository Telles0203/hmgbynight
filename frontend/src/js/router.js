function loadPage(route) {
  fetch(`/src/pages/${route}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('page-content').innerHTML = `
        <div class="container-fluid pt-5">
          <div class="container content-conteiner pt-3">
            ${html}
          </div>
        </div>
      `;

      history.pushState({}, '', `/${route}`);

      // ====== CHAMADAS PÓS-INJEÇÃO (AQUI É O PULO DO GATO) ======
      // main
      if (route === "main" && typeof window.loadMainUser === "function") {
        window.loadMainUser();
      }

      // login (se você quiser rodar algo ao entrar na página login)
      if (route === "login" && typeof window.onLoginPageLoaded === "function") {
        console.log("Router: login injetado -> chamando onLoginPageLoaded()");
        window.onLoginPageLoaded();
      }

      // register (se existir)
      if (route === "register" && typeof window.onRegisterPageLoaded === "function") {
        console.log("Router: register injetado -> chamando onRegisterPageLoaded()");
        window.onRegisterPageLoaded();
      }
      // ===========================================================

      document.querySelectorAll('#navbar a.nav-link').forEach(link => {
        const onclick = link.getAttribute('onclick');
        const li = link.closest('li');
        if (!li) return;

        if (onclick && onclick.includes(`loadPage('${route}'`)) {
          li.style.display = 'none';
        } else {
          li.style.display = '';
        }
      });
    })
    .catch(() => {
      document.getElementById('page-content').innerHTML = '<h1>404</h1>';
    });
}

window.addEventListener('popstate', () => {
  const route = location.pathname.replace('/', '') || 'home';
  loadPage(route);
});

document.addEventListener('DOMContentLoaded', () => {
  const route = location.pathname.replace('/', '') || 'home';
  loadPage(route);
});