async function loadMainUser() {
    const greeting = document.getElementById("mainGreeting");
    if (!greeting) return;

    greeting.innerText = "Carregando usuário...";

    try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
            window.location.replace("/login");
            return;
        }

        const data = await res.json();

        console.log("Resposta completa do usuário:", data);

        const isEmailValid =
            data?.isEmailValid ??
            data?.user?.isEmailValid ??
            data?.data?.isEmailValid ??
            data?.data?.user?.isEmailValid;

        if (isEmailValid === false) {
            const container = document.getElementById("emailValidationContainer");
            if (container) {
                const modalRes = await fetch("/src/pages/emailValidationModal.html");
                const html = await modalRes.text();
                container.innerHTML = html;

                // ✅ IMPORTANTE: liga os botões depois de injetar o HTML
                await setupEmailValidationHandlers();
            }
        } else {
            const container = document.getElementById("emailValidationContainer");
            if (container) container.innerHTML = "";
        }

        const name =
            data?.name ||
            data?.user?.name ||
            data?.data?.name ||
            data?.data?.user?.name;

        greeting.innerText = name ? `Olá ${name}.` : "Olá, cadastrado no sistema.";

        const loading = document.getElementById("loadingScreen");
        const main = document.getElementById("mainPage");

        if (loading) loading.style.display = "none";
        if (main) main.style.display = "block";
    } catch (err) {
        console.error("Erro ao carregar usuário:", err);
    }
}

async function setupEmailValidationHandlers() {
    const validateBtn = document.getElementById("validateEmailButton");
    const resendBtn = document.getElementById("resendTokenButton");
    const tokenInput = document.getElementById("emailTokenInput");
    const warningBox = document.getElementById("emailValidationWarning");

    if (!validateBtn || !tokenInput || !warningBox) return;

    // Evita duplicar listener se você entrar no main mais de uma vez
    if (validateBtn.dataset.listenerAttached === "true") return;
    validateBtn.dataset.listenerAttached = "true";

    validateBtn.addEventListener("click", async () => {
        const token = (tokenInput.value || "").trim();

        console.log("Clique em Validar e-mail. Token:", token);

        // limpa estilos anteriores
        tokenInput.classList.remove("border-danger", "border-success");

        if (!token) {
            tokenInput.classList.add("border-danger");
            tokenInput.focus();
            showEmailValidationAlert("Informe o token.", "danger");
            return;
        }

        try {
            console.log("POST -> /api/auth/email/verify-email-token");

            const response = await fetch("/api/auth/email/verify-email-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token })
            });

            const data = await response.json().catch(() => null);

            console.log("VERIFY RESPONSE status:", response.status);
            console.log("VERIFY RESPONSE body:", data);

            if (!response.ok || !data?.ok) {
                let msg = "Não foi possível validar o token.";

                if (data?.debug === "token_mismatch") {
                    msg = "Token incorreto. Verifique o código enviado por e-mail.";
                    tokenInput.classList.add("border-danger");
                    tokenInput.focus();
                    tokenInput.select();
                } else if (data?.debug === "token_expired") {
                    msg = "Token expirado. Clique em 'Enviar novo token'.";
                    tokenInput.classList.add("border-danger");
                    document.getElementById("resendTokenButton")?.focus();
                } else if (data?.debug === "user_not_found") {
                    msg = "Sessão inválida. Faça login novamente.";
                } else {
                    msg = data?.error || data?.message || "Token inválido ou expirado.";
                    tokenInput.classList.add("border-danger");
                }

                console.log("VERIFY FAILED msg:", msg, "debug:", data?.debug);
                showEmailValidationAlert(msg, "danger");
                return;
            }

            // sucesso
            tokenInput.classList.add("border-success");
            showEmailValidationAlert("E-mail validado com sucesso!", "success");

            warningBox.style.display = "none";
            tokenInput.value = "";

            await loadMainUser();
        } catch (err) {
            console.error("Erro ao validar e-mail:", err);
            tokenInput.classList.add("border-danger");
            showEmailValidationAlert("Falha ao validar. Tente novamente.", "danger");
        }
    });

    // ✅ Handler do botão "Enviar novo token"
    if (resendBtn && resendBtn.dataset.listenerAttached !== "true") {
        resendBtn.dataset.listenerAttached = "true";

        resendBtn.addEventListener("click", async () => {
            try {
                console.log("POST -> /api/auth/email/send-token");

                const response = await fetch("/api/auth/email/send-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                const data = await response.json().catch(() => null);

                if (!response.ok || !data?.ok) {
                    const msg = data?.error || data?.message || "Não foi possível enviar um novo token.";
                    showEmailValidationAlert(msg, "danger");
                    return;
                }

                // UX: limpa input e destaca pra colar o novo token
                tokenInput.classList.remove("border-danger", "border-success");
                tokenInput.value = "";
                tokenInput.focus();

                showEmailValidationAlert(
                    "Novo token enviado para seu e-mail. Ele expira em 10 minutos.",
                    "success"
                );
            } catch (err) {
                console.error("Erro ao reenviar token:", err);
                showEmailValidationAlert("Falha ao reenviar. Tente novamente.", "danger");
            }
        });
    }
}

function showEmailValidationAlert(message, type = "danger") {
    const warningBox = document.getElementById("emailValidationWarning");
    if (!warningBox) return;

    let alert = document.getElementById("emailValidationAlert");
    if (!alert) {
        alert = document.createElement("div");
        alert.id = "emailValidationAlert";
        alert.className = "alert mt-3";
        alert.role = "alert";
        warningBox.querySelector(".card-body")?.appendChild(alert);
    }

    alert.classList.remove("alert-danger", "alert-success", "alert-warning", "alert-info");
    alert.classList.add(type === "success" ? "alert-success" : "alert-danger");
    alert.textContent = message;
}

window.loadMainUser = loadMainUser;