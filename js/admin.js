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

function renderGrid(boletas) {
  adminBoletasState = boletas;
  const grid = document.getElementById("boletasGridAdmin");
  grid.innerHTML = "";

  let pagadas = 0;
  for (let i = 0; i < RIFA_CONFIG.totalBoletas; i++) {
    const numero = String(i).padStart(2, "0");
    const estado = (boletas[numero] && boletas[numero].estado) || "disponible";
    if (estado === "pagado") pagadas++;

    const el = document.createElement("div");
    el.className = "boleta " + estado;
    el.textContent = numero;
    el.addEventListener("click", () => abrirDetalle(numero));
    grid.appendChild(el);
  }

  document.getElementById("contador").textContent =
    `(${pagadas} pagadas / ${RIFA_CONFIG.totalBoletas})`;
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

function iniciarPanel() {
  escucharBoletas(renderGrid);
}
