const db = supabase.createClient(
  "https://pfnynmluwogrcippzbqv.supabase.co",
  "sb_publishable_OfyzFHt93Mr0R3r90Kf2eQ_DKaO8lKC"
);

const formLogin = document.getElementById("formLogin");
const msgLogin = document.getElementById("msgLogin");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const password = document.getElementById("passLogin").value.trim();

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msgLogin.textContent = "Correo o contraseña incorrectos.";
    console.error(error);
    return;
  }

  msgLogin.style.color = "green";
  msgLogin.textContent = "Ingresando...";

  // Redirige a tu app de aportes
  setTimeout(() => {
    window.location.href = "./principal.html";
  }, 800);
});
