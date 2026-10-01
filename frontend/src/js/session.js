let currentUser = undefined;
let sessionRequest = null;

async function sessionMe(forceRefresh = false) {
  if (!forceRefresh && currentUser !== undefined) {
    return currentUser;
  }

  if (!forceRefresh && sessionRequest) {
    return sessionRequest;
  }

  sessionRequest = (async () => {
    try {
      const response = await fetch(
        "/api/auth/me",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        currentUser = null;
        return null;
      }

      const data = await response.json();

      currentUser =
        data?.user || null;

      return currentUser;
    } catch (error) {
      console.error(
        "[SESSION] Erro ao verificar sessão:",
        error
      );

      currentUser = null;

      return null;
    } finally {
      sessionRequest = null;
    }
  })();

  return sessionRequest;
}

async function requireAuth(currentPage) {
  const user = await sessionMe();

  if (
    !user &&
    currentPage === "main"
  ) {
    return {
      allowed: false,
      redirect: "login",
      user: null,
    };
  }

  if (
    user &&
    (
      currentPage === "login" ||
      currentPage === "register"
    )
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

function setSessionUser(user) {
  currentUser = user || null;
}

function clearSessionUser() {
  currentUser = null;
}

function invalidateSession() {
  currentUser = undefined;
}

window.sessionMe =
  sessionMe;

window.requireAuth =
  requireAuth;

window.setSessionUser =
  setSessionUser;

window.clearSessionUser =
  clearSessionUser;

window.invalidateSession =
  invalidateSession;