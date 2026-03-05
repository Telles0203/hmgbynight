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

window.loadMainUser = loadMainUser;