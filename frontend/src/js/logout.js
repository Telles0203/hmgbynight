async function logoutUser() {
  try {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok || !data?.ok) {
      console.error(
        "[LOGOUT] Falha ao encerrar sessão:",
        data?.error || "Erro desconhecido."
      );

      return false;
    }

    if (typeof window.loadPage === "function") {
      await window.loadPage("home", {
        updateHistory: true,
        replaceHistory: true,
        checkAuth: false,
      });
    } else {
      window.location.href = "/home";
    }

    return true;
  } catch (error) {
    console.error(
      "[LOGOUT] Erro ao encerrar sessão:",
      error
    );

    return false;
  }
}

window.logoutUser = logoutUser;