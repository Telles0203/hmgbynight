async function sessionMe() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) return null;
    return await res.json();
}

async function requireAuth(currentPage) {
    const user = await sessionMe();

    if (!user && currentPage === "main") {
        if (typeof loadPage === "function") loadPage("login");
        else window.location.href = "/login";
        return null;
    }

    if (user && (currentPage === "login" || currentPage === "register")) {
        if (typeof loadPage === "function") loadPage("main");
        else window.location.href = "/main";
        return user;
    }

    return user;
}

window.sessionMe = sessionMe;
window.requireAuth = requireAuth;