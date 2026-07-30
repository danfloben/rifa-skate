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

function renderTabla(boletas) {
  const body = document.getElementById("tablaBody");
  const filas = [];

  for (let i = 0; i < RIFA_CONFIG.totalBoletas; i++) {
    const numero = String(i).padStart(2, "0");
    const b = boletas[numero] || { estado: "disponible" };
    filas.push({ numero, ...b });
  }

  // Muestra primero reservado/pagado, para revisar rápido
  filas.sort((a, b) => {
    const orden = { reservado: 0, pagado: 1, disponible: 2 };
    return orden[a.estado] - orden[b.estado];
  });

  document.getElementById("contador").textContent =
    `(${filas.filter(f => f.estado === "pagado").length} pagadas / ${RIFA_CONFIG.totalBoletas})`;

  body.innerHTML = filas.map(f => `
    <tr>
      <td><b>${f.numero}</b></td>
      <td>${estadoLabel(f.estado)}</td>
      <td>${f.nombre || "—"}</td>
      <td>${f.telefono || "—"}</td>
      <td>
        ${f.estado === "reservado" ? `<button class="btn" style="margin:0; padding:6px 10px; font-size:11px" onclick="marcarPagado('${f.numero}')">Marcar pagado</button>` : ""}
        ${f.estado === "pagado" ? `<button class="btn secondary" style="margin:0; padding:6px 10px; font-size:11px" onclick="liberarBoleta('${f.numero}')">Liberar</button>` : ""}
      </td>
    </tr>
  `).join("");
}

async function marcarPagado(numero) {
  await guardarBoleta(numero, { estado: "pagado" });
}

async function liberarBoleta(numero) {
  if (!confirm(`¿Liberar la boleta ${numero} y dejarla disponible de nuevo?`)) return;
  await guardarBoleta(numero, { estado: "disponible", nombre: null, telefono: null });
}

function iniciarPanel() {
  escucharBoletas(renderTabla);
}
