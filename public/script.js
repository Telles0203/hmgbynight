const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeat-password');
const emailInput = document.getElementById('email');
const feedback = document.getElementById("email-feedback");
const logoutBtn = document.getElementById("logout-btn");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const publicPaths = ["/login.html", "/register.html"];

let emailTimer;

repeatPassword?.addEventListener('input', () => {
  const value = repeatPassword.value;

  if (value === '') {
    repeatPassword.classList.remove('is-valid', 'is-invalid');
    return;
  }

  if (value === password.value) {
    repeatPassword.classList.add('is-valid');
    repeatPassword.classList.remove('is-invalid');
  } else {
    repeatPassword.classList.add('is-invalid');
    repeatPassword.classList.remove('is-valid');
  }
});

function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  const icon = document.getElementById(`icon-${fieldId}`);
  if (!input || !icon) return;

  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  icon.classList.toggle('bi-eye');
  icon.classList.toggle('bi-eye-slash');
}

emailInput?.addEventListener("input", () => {
  const value = emailInput.value.trim();

  if (value === "") {
    emailInput.classList.remove("is-valid", "is-invalid");
    feedback.textContent = "E-mail inválido.";
    return;
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    feedback.textContent = "E-mail inválido.";
    return;
  }

  clearTimeout(emailTimer);
  emailTimer = setTimeout(async () => {
    try {
      const res = await fetch(`/check-email?email=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.exists) {
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        feedback.textContent = "Este e-mail já está cadastrado.";
      } else {
        emailInput.classList.add("is-valid");
        emailInput.classList.remove("is-invalid");
        feedback.textContent = "E-mail disponível!";
      }
    } catch (err) {
      emailInput.classList.add("is-invalid");
      emailInput.classList.remove("is-valid");
      feedback.textContent = "Erro ao verificar e-mail.";
    }
  }, 500);
});

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = emailInput?.value.trim();
  const passwordVal = password?.value;
  const repeatPasswordVal = repeatPassword?.value;

  if (!name || !email || !passwordVal || !repeatPasswordVal) return;

  if (passwordVal !== repeatPasswordVal) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: passwordVal, repeatPassword: repeatPasswordVal })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "login.html";
    } else {
      alert(data.error || "Erro ao registrar.");
    }
  } catch (err) {
    alert("Erro de rede ao tentar registrar.");
  }
});

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const passwordVal = password.value;

  if (!email || !passwordVal) return;

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: passwordVal })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "main.html";
    } else {
      alert(data.error || "Erro ao fazer login.");
    }
  } catch (err) {
    alert("Erro de rede ao tentar login.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📜 script.js carregado");

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  console.log("🧭 URL atual:", window.location.href);
  console.log("🔎 Parâmetros:", window.location.search);



  if (path === "/login.html" && params.get("auth") === "required") {
    if (!path.includes("login.html")) {
      window.location.href = "/login.html?auth=required";
      return;
    }
    const modal = document.getElementById("force-modal");
    window.history.replaceState({}, document.title, path);
    if (modal) {
      modal.style.display = "block";
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";
      modal.style.zIndex = "9999";
      modal.style.position = "fixed";
      modal.style.inset = "0";
      document.getElementById("modal-ok-btn")?.addEventListener("click", () => {
        modal.remove();
      }, { once: true });
    }

    return;
  }

  try {
    const res = await fetch("/check-token", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (data.loggedIn && path === "/login.html") {
      window.location.href = "/main.html";
    }

    if (!data.loggedIn && !publicPaths.includes(path)) {
      window.location.href = "/login.html?auth=required";
    }

  } catch (err) {
    console.log("Erro ao verificar login", err);
    alert("Erro ao verificar o login. Tente novamente.");
  }
});

logoutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await fetch("/logout", {
      method: "POST",
      credentials: "include"
    });

    window.location.href = "login.html";
  } catch (err) {
    alert("Erro ao fazer logout.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/get-user-status", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (data.warning === true) {
      document.querySelector(".avisos-bloco")?.classList.remove("d-none");

      const resAvisos = await fetch("/get-user-warnings", {
        method: "GET",
        credentials: "include"
      });

      const avisoData = await resAvisos.json();
      console.log("📌 avisoData:", avisoData);

      const resHtmls = await fetch("/get-avisos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avisoData)
      });

      const htmlAvisos = await resHtmls.json();
      console.log("📋 Conteúdo final dos avisos:", htmlAvisos);

      const lista = document.querySelector("#lista-avisos");

      htmlAvisos.forEach(({ key, html }) => {
        if (!html) return;

        if (key === "isEmailCheck") {
          lista.innerHTML += `
            <li class="alert alert-warning text-center mb-2">
              ${html}
              <p></p>
              <label for="tokenInput" class="form-label mb-2">Digite seu TOKEN:</label><br>
              <input
                type="text"
                id="tokenInput"
                maxlength="10"
                class="form-control text-center"
                style="letter-spacing: 2px; max-width: 250px; margin: 0 auto;"
                placeholder="••••••••••"
              >
              <button id="confirmarTokenBtn" class="btn btn-success d-none mt-2">Confirmar E-mail</button>
            </li>
          `;
          setTimeout(ativarEventosDoToken, 0);
        } else {
          lista.innerHTML += `
            <li class="alert alert-warning text-center mb-2">
              ${html}
              <div class="d-flex justify-content-center align-items-center gap-3 mt-2">
                <input class="form-check-input" type="checkbox" id="check-${key}">
                <button id="btn-${key}" class="btn btn-danger btn-sm" disabled>Não mostrar mais</button>
              </div>
            </li>
          `;

          setTimeout(() => {
            const checkbox = document.getElementById(`check-${key}`);
            const btn = document.getElementById(`btn-${key}`);
          
            checkbox?.addEventListener("change", () => {
              btn.disabled = !checkbox.checked;
              btn.classList.toggle("btn-danger", checkbox.checked);
              btn.classList.toggle("btn-outline-secondary", !checkbox.checked);
            });
          
            btn?.addEventListener("click", async () => {
              await fetch("/ocultar-aviso", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key })
              });
          
              location.reload();
            });
          }, 0);
            
          
          
        }
      });
    }

  } catch (err) {
    console.error("Erro ao buscar status do usuário ou avisos", err);
  }
});







tokenInput?.addEventListener("input", async () => {
  const value = tokenInput.value.trim();

  if (value.length === 10) {
    try {
      const res = await fetch(`/validar-token?token=${encodeURIComponent(value)}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await res.json();

      if (data.valid) {
        tokenInput.classList.add("is-valid");
        tokenInput.classList.remove("is-invalid");
        confirmarTokenBtn?.classList.remove("d-none");
      } else {
        tokenInput.classList.add("is-invalid");
        tokenInput.classList.remove("is-valid");
        confirmarTokenBtn?.classList.add("d-none");
      }
    } catch {
      tokenInput.classList.add("is-invalid");
      tokenInput.classList.remove("is-valid");
      confirmarTokenBtn?.classList.add("d-none");
    }
  } else {
    tokenInput.classList.remove("is-valid", "is-invalid");
    confirmarTokenBtn?.classList.add("d-none");
  }
});

confirmarTokenBtn?.addEventListener("click", async () => {
  const token = tokenInput?.value.trim();
  if (!token) return;

  console.log("🟢 Botão Confirmar E-mail clicado com token:", token);

  try {
    const res = await fetch("/confirmar-email", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const data = await res.json();
    console.log("📥 Resposta do servidor:", data);

    if (data.success) {
      alert("E-mail confirmado!");
      document.querySelector(".avisos-bloco")?.classList.add("d-none");
    } else {
      alert("Token inválido ou sessão expirada.");
    }
  } catch (err) {
    console.error("❌ Erro na requisição:", err);
    alert("Erro ao confirmar token.");
  }
});


function ativarEventosDoToken() {
  console.log("✅ ativarEventosDoToken executado");
  const tokenInput = document.getElementById("tokenInput");
  const confirmarTokenBtn = document.getElementById("confirmarTokenBtn");

  if (!tokenInput || !confirmarTokenBtn) {
    console.warn("⚠️ Elementos tokenInput ou confirmarTokenBtn não encontrados");
    return
  };

  console.log(tokenInput);
  console.log(confirmarTokenBtn);

  tokenInput.addEventListener("input", async () => {
    const value = tokenInput.value.trim();

    if (value.length === 10) {
      try {
        const res = await fetch(`/validar-token?token=${encodeURIComponent(value)}`, {
          method: "GET",
          credentials: "include"
        });

        const data = await res.json();

        if (data.valid) {
          tokenInput.classList.add("is-valid");
          tokenInput.classList.remove("is-invalid");
          confirmarTokenBtn.classList.remove("d-none");
        } else {
          tokenInput.classList.add("is-invalid");
          tokenInput.classList.remove("is-valid");
          confirmarTokenBtn.classList.add("d-none");
        }
      } catch {
        tokenInput.classList.add("is-invalid");
        tokenInput.classList.remove("is-valid");
        confirmarTokenBtn.classList.add("d-none");
      }
    } else {
      tokenInput.classList.remove("is-valid", "is-invalid");
      confirmarTokenBtn.classList.add("d-none");
    }
  });

  confirmarTokenBtn.addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) return;

    try {
      const res = await fetch("/confirmar-email", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.success) {
        alert("E-mail confirmado!");
        document.querySelector(".avisos-bloco")?.classList.add("d-none");
      } else {
        alert("Token inválido ou sessão expirada.");
      }
    } catch (err) {
      console.error("❌ Erro na requisição:", err);
      alert("Erro ao confirmar token.");
    }
  });
}





