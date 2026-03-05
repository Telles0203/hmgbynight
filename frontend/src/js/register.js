(function () {
    function isRegisterPage() {
        return !!document.getElementById("registerForm");
    }

    function showAlert(type, msg) {
        const alertBox = document.getElementById("registerAlert");
        if (!alertBox) return;

        alertBox.className = "alert";
        alertBox.classList.add(type === "success" ? "alert-success" : "alert-danger");
        alertBox.textContent = msg;
        alertBox.classList.remove("d-none");
    }

    async function handleSubmit(form) {
        const btn = document.getElementById("btnRegister");
        const alertBox = document.getElementById("registerAlert");

        btn.disabled = true;
        btn.textContent = "Criando...";
        alertBox?.classList.add("d-none");

        const payload = {
            name: document.getElementById("name")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            password: document.getElementById("password")?.value
        };

        let succeeded = false;
        let redirected = false;
        let timer = null;

        const goMain = () => {
            if (redirected) return;

            redirected = true;

            if (typeof window.loadPage === "function") {
                window.loadPage("main");
            } else {
                window.location.href = "/src/pages/main.html";
            }
        };

        try {

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.ok) {
                showAlert("error", data.error || `Erro ao registrar (HTTP ${res.status})`);
                return;
            }

            succeeded = true;
            let seconds = 10;

            showAlert("success", `Conta criada com sucesso! Logando em ${seconds}s...`);
            btn.disabled = false;
            btn.type = "button";
            btn.textContent = "Logar agora";

            btn.onclick = goMain;

            timer = setInterval(() => {

                seconds--;

                if (seconds <= 0) {
                    clearInterval(timer);
                    goMain();
                    return;
                }

                showAlert("success", `Conta criada com sucesso! Indo para o painel em ${seconds}s...`);

            }, 1000);

        } catch (err) {

            console.error(err);
            showAlert("error", "Erro de conexão com o servidor.");

        } finally {

            if (!succeeded) {
                btn.disabled = false;
                btn.type = "submit";
                btn.textContent = "Criar conta";
            }

        }
    }

    document.addEventListener("submit", (e) => {

        const form = e.target;

        if (!form || form.id !== "registerForm") return;

        e.preventDefault();

        handleSubmit(form);

    });

    const obs = new MutationObserver(() => {

        if (isRegisterPage()) {
            console.log("✅ register.html está no DOM");
        }

    });

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();