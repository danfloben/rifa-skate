// ============================================================
// Lógica de la página principal
// ============================================================

let boletasState = {};
let numeroSeleccionado = null;

function money(n) {
  return "$" + Number(n).toLocaleString("es-CO");
}

function pintarInfoEstatica() {
  document.getElementById("tituloRifa").textContent = "🛹 " + RIFA_CONFIG.titulo;
  document.getElementById("subtituloRifa").textContent = RIFA_CONFIG.subtitulo;
  document.getElementById("fechaSorteo").textContent = RIFA_CONFIG.fechaSorteoTexto;
  document.getElementById("juegaCon").textContent = RIFA_CONFIG.juegaCon;
  document.getElementById("meta").textContent = "Meta: " + money(RIFA_CONFIG.metaRecaudo);
  document.getElementById("valorBoleta").textContent = money(RIFA_CONFIG.valorBoleta) + " COP";
  document.getElementById("nequiNum").textContent = "Celular: " + RIFA_CONFIG.pago.nequiDaviplata;
  document.getElementById("llaveBreB").textContent = "Llave · " + RIFA_CONFIG.pago.llaveBreB;
  document.getElementById("codigoDonacion").textContent = RIFA_CONFIG.pago.codigoDonacion;

  const premiosGrid = document.getElementById("premiosGrid");
  premiosGrid.innerHTML = RIFA_CONFIG.premios.map(p => `
    <div class="premio-thumb">
      <img src="${p.img}" alt="${p.nombre}" onerror="this.parentElement.textContent='${p.nombre}'">
    </div>
  `).join("");
}

function actualizarProgreso() {
  const pagadas = Object.values(boletasState).filter(b => b.estado === "pagado").length;
  const recaudado = pagadas * RIFA_CONFIG.valorBoleta;
  const pct = Math.min(100, (recaudado / RIFA_CONFIG.metaRecaudo) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("recaudado").textContent = money(recaudado);
}

function pintarGrid() {
  const grid = document.getElementById("boletasGrid");
  grid.innerHTML = "";
  for (let i = 0; i < RIFA_CONFIG.totalBoletas; i++) {
    const numero = String(i).padStart(2, "0");
    const estado = (boletasState[numero] && boletasState[numero].estado) || "disponible";

    const el = document.createElement("div");
    el.className = "boleta " + estado;
    el.textContent = numero;
    el.dataset.numero = numero;

    if (estado === "disponible") {
      el.addEventListener("click", () => abrirModal(numero));
    }
    grid.appendChild(el);
  }
  actualizarProgreso();
}

function abrirModal(numero) {
  numeroSeleccionado = numero;
  document.getElementById("modalNumero").textContent = "#" + numero;
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputTelefono").value = "";
  document.getElementById("modalBackdrop").classList.add("open");
}

function cerrarModal() {
  document.getElementById("modalBackdrop").classList.remove("open");
  numeroSeleccionado = null;
}

async function confirmarReserva() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();

  if (!nombre || !telefono) {
    alert("Por favor completa tu nombre y tu WhatsApp.");
    return;
  }

  // 1) Marcar como reservado
  await guardarBoleta(numeroSeleccionado, {
    estado: "reservado",
    nombre,
    telefono,
    fechaReserva: new Date().toISOString(),
  });

  // 2) Abrir WhatsApp con el mensaje prellenado hacia el club
  const mensaje = encodeURIComponent(
    `Hola! Quiero reservar la boleta #${numeroSeleccionado} de la rifa "${RIFA_CONFIG.titulo}".\n` +
    `Nombre: ${nombre}\n` +
    `Mi WhatsApp: ${telefono}\n` +
    `Adjunto el comprobante de pago.`
  );
  window.open(`https://wa.me/${RIFA_CONFIG.whatsappNumero}?text=${mensaje}`, "_blank");

  cerrarModal();
}

document.getElementById("modalClose").addEventListener("click", cerrarModal);
document.getElementById("modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") cerrarModal();
});
document.getElementById("btnConfirmarReserva").addEventListener("click", confirmarReserva);

// ---- Init ----
pintarInfoEstatica();
escucharBoletas((data) => {
  boletasState = data;
  pintarGrid();
});
