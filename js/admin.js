// ============================================================
// Lógica del panel admin
// ⚠️ El PIN es una barrera básica, NO seguridad real.
// Cualquiera que vea el código fuente puede encontrarlo.
// Para producción, migra a Firebase Auth (ver README.md).
// ============================================================

const ADMIN_PIN = "2026"; // cámbialo aquí

document.getElementById("btnLogin").addEventListener("click", () => {
  const val = document.getElementById("pinInput").value;
  if (val === ADMIN_PIN) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panelBox").style.display = "block";
    iniciarPanel();
  } else {
    alert("PIN incorrecto");
  }
});

function estadoLabel(estado) {
  return `<span class="badge ${estado}">${estado}</span>`;
}

let adminBoletasState = {};

function numerosDestacados() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("boletas");
  if (!raw) return [];
  return raw.split(",").map(n => n.trim().padStart(2, "0")).filter(Boolean);
}

const destacadas = numerosDestacados();
let yaHizoScroll = false;

function renderGrid(boletas) {
  adminBoletasState = boletas;
  const grid = document.getElementById("boletasGridAdmin");
  document.getElementById("boletasLoaderAdmin").classList.add("oculto");
  grid.classList.remove("oculto");
  grid.innerHTML = "";

  if (destacadas.length) {
    const filtro = document.getElementById("filtroBoletas");
    filtro.textContent = `📎 Boletas del link recibido: ${destacadas.map(n => "#" + n).join(", ")}`;
    filtro.style.display = "block";
    filtro.style.marginBottom = "14px";
  }

  let pagadas = 0;
  for (let i = 0; i < RIFA_CONFIG.totalBoletas; i++) {
    const numero = String(i).padStart(2, "0");
    const estado = (boletas[numero] && boletas[numero].estado) || "disponible";
    if (estado === "pagado") pagadas++;

    const el = document.createElement("div");
    el.className = "boleta " + estado + (destacadas.includes(numero) ? " resaltada" : "");
    el.textContent = numero;
    el.dataset.numero = numero;
    el.addEventListener("click", () => abrirDetalle(numero));
    grid.appendChild(el);
  }

  document.getElementById("contador").textContent =
    `(${pagadas} pagadas / ${RIFA_CONFIG.totalBoletas})`;

  if (destacadas.length && !yaHizoScroll) {
    yaHizoScroll = true;
    const el = grid.querySelector(`[data-numero="${destacadas[0]}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function abrirDetalle(numero) {
  const b = adminBoletasState[numero] || { estado: "disponible" };

  document.getElementById("adminModalNumero").textContent = "#" + numero;
  document.getElementById("adminModalBadge").innerHTML = estadoLabel(b.estado);
  document.getElementById("adminModalBody").innerHTML = `
    <p><b>Nombre:</b> ${b.nombre || "—"}</p>
    <p><b>WhatsApp:</b> ${b.telefono || "—"}</p>
  `;

  const acciones = document.getElementById("adminModalActions");
  acciones.innerHTML = "";
  if (b.estado === "reservado") {
    acciones.innerHTML += `<button class="btn" id="btnMarcarPagado">Marcar pagado</button>`;
  }
  if (b.estado === "reservado" || b.estado === "pagado") {
    acciones.innerHTML += `<button class="btn secondary" id="btnLiberar">Liberar</button>`;
  }

  if (b.estado === "reservado") {
    document.getElementById("btnMarcarPagado").addEventListener("click", async () => {
      await marcarPagado(numero);
      cerrarDetalle();
    });
  }
  if (b.estado === "reservado" || b.estado === "pagado") {
    document.getElementById("btnLiberar").addEventListener("click", async () => {
      await liberarBoleta(numero);
      cerrarDetalle();
    });
  }

  document.getElementById("adminModalBackdrop").classList.add("open");
}

function cerrarDetalle() {
  document.getElementById("adminModalBackdrop").classList.remove("open");
}

document.getElementById("adminModalClose").addEventListener("click", cerrarDetalle);
document.getElementById("adminModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "adminModalBackdrop") cerrarDetalle();
});

async function marcarPagado(numero) {
  await guardarBoleta(numero, { estado: "pagado" });
}

async function liberarBoleta(numero) {
  if (!confirm(`¿Liberar la boleta ${numero} y dejarla disponible de nuevo?`)) return;
  await guardarBoleta(numero, { estado: "disponible", nombre: null, telefono: null });
}

document.getElementById("btnReiniciarBoletas").addEventListener("click", async () => {
  if (!confirm("¿Reiniciar TODAS las boletas (00-99) a disponible? Esto borra todas las reservas y pagos registrados. Esta acción no se puede deshacer.")) return;
  if (!confirm("Confirma una vez más: se van a borrar todos los registros de boletas. ¿Continuar?")) return;

  const btn = document.getElementById("btnReiniciarBoletas");
  btn.disabled = true;
  btn.textContent = "Reiniciando...";

  for (let i = 0; i < RIFA_CONFIG.totalBoletas; i++) {
    const numero = String(i).padStart(2, "0");
    await guardarBoleta(numero, { estado: "disponible", nombre: null, telefono: null, fechaReserva: null });
  }

  btn.disabled = false;
  btn.textContent = "🔄 Reiniciar todas las boletas";
  alert("Listo, todas las boletas quedaron disponibles.");
});

function iniciarPanel() {
  escucharBoletas(renderGrid);
}
