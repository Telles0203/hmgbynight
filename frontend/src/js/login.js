const API_BASE = "";

function showAlert(msg) {
    const el = document.getElementById("loginAlert");
    if (!el) return;

    // se você já está no Bootstrap:
    el.classList.remove("d-none");
    el.classList.add("alert", "alert-danger");
    el.textContent = msg;
}

document.addEventListener("submit", async (e) => {
    // pega submits de QUALQUER form que tenha id="loginForm"
    if (!(e.target instanceof HTMLFormElement)) return;
    if (e.target.id !== "loginForm") return;

    e.preventDefault(); // <- agora SEMPRE roda quando o loginForm for enviado

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showAlert(data?.message || "Falha no login.");
            return;
        }

        if (data?.token) localStorage.setItem("token", data.token);

        // IMPORTANTE: em SPA, prefira loadPage
        if (typeof loadPage === "function") {
            loadPage("main");
        } else {
            window.location.href = "/main";
        }
    } catch (err) {
        showAlert("Erro de rede ao tentar logar.");
    }
});