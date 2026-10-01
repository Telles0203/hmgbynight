async function sessionMe() {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data?.user || null;
  } catch (error) {
    console.error(
      "[SESSION] Erro ao verificar sessão:",
      error
    );

    return null;
  }
}

async function requireAuth(currentPage) {
  const user = await sessionMe();

  if (!user && currentPage === "main") {
    return {
      allowed: false,
      redirect: "login",
      user: null,
    };
  }

  if (
    user &&
    (currentPage === "login" ||
      currentPage === "register")
  ) {
    return {
      allowed: false,
      redirect: "main",
      user,
    };
  }

  return {
    allowed: true,
    redirect: null,
    user,
  };
}

window.sessionMe = sessionMe;
window.requireAuth = requireAuth;