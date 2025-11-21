
const db = supabase.createClient(
  "https://pfnynmluwogrcippzbqv.supabase.co",
  "sb_publishable_OfyzFHt93Mr0R3r90Kf2eQ_DKaO8lKC" // <- tu web key correcta
);

const cerrar = document.getElementById("cerrar");

cerrar.addEventListener("click", async () => {
  await db.auth.signOut();
  window.location.href = "./index.html"; // Redirigir a la página de inicio de sesión
});


// Elementos del DOM
const form = document.getElementById("formAporte");
const tabla = document.getElementById("tablaAportes");
const totalAportesSpan = document.getElementById("totalAportes");

// Lista local de aportes
let aportes = [];

// Obtener 
async function cargarAportes() {
  const { data, error } = await db
    .from("aportes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al cargar aportes:", error);
    return;
  }

  aportes = data;
  renderTabla();
}


// Sumar total
function calcularTotal() {
  const total = aportes.reduce((sum, a) => sum + Number(a.valor), 0);
  totalAportesSpan.textContent = total.toLocaleString("es-CO");
}

// Renderizar tabla
function renderTabla() {
  tabla.innerHTML = "";

  aportes.forEach(aporte => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${aporte.nombre}</td>
      <td>${aporte.placa}</td>
      <td>${Number(aporte.valor).toLocaleString("es-CO")}</td>
      <td>${aporte.fecha}</td>
      <td><button class="btnEliminar" data-id="${aporte.id}">❌</button></td>
    `;
    tabla.appendChild(fila);
  });

  calcularTotal();
}

// Insertar aporte
form.addEventListener("submit", async e => {
  e.preventDefault();

  const { data: userData } = await db.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    alert("Debes iniciar sesión para agregar aportes.");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const placa = document.getElementById("placa").value;
  const valor = document.getElementById("valor").value;
  const fecha = new Date().toLocaleDateString("es-CO");

  const nuevoAporte = { nombre, placa, valor, fecha, user_id: userId };

  const { error } = await db.from("aportes").insert(nuevoAporte);

  if (error) {
    console.error("Error al insertar aporte:", error);
    return;
  }

  await cargarAportes();
  form.reset();
});

// Eliminar aporte
tabla.addEventListener("click", async e => {
  if (e.target.classList.contains("btnEliminar")) {
    const id = e.target.getAttribute("data-id");

    const { error } = await db
      .from("aportes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar aporte:", error);
      return;
    }

    await cargarAportes();
  }
});



// Carga inicial
cargarAportes();
