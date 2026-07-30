// ============================================================
// Lógica de la página principal
// ============================================================

let boletasState = {};
let numeroSeleccionado = null;

function money(n) {
  return "$" + Number(n).toLocaleString("es-CO");
}

function pintarInfoEstatica() {
  document.getElementById("tituloRifa").textContent = RIFA_CONFIG.titulo + " 🛹";
  document.getElementById("subtituloRifa").textContent = RIFA_CONFIG.subtitulo;
  document.getElementById("mensajeIntro").textContent = RIFA_CONFIG.mensajeIntro;
  document.getElementById("fechaSorteo").textContent = RIFA_CONFIG.fechaSorteoTexto;
  document.getElementById("juegaCon").textContent = RIFA_CONFIG.juegaCon;
  document.getElementById("meta").textContent = "Meta: " + money(RIFA_CONFIG.metaRecaudo);
  document.getElementById("valorBoleta").textContent = money(RIFA_CONFIG.valorBoleta) + " COP";
  document.getElementById("nequiNum").textContent = "Celular: " + RIFA_CONFIG.pago.nequiDaviplata;
  document.getElementById("llaveBreB").textContent = "Llave · " + RIFA_CONFIG.pago.llaveBreB;
  document.getElementById("qrNequi").src = RIFA_CONFIG.pago.qrNequiUrl;
  document.getElementById("qrBreB").src = RIFA_CONFIG.pago.qrBreBUrl;
  document.getElementById("codigoDonacion").textContent = RIFA_CONFIG.pago.codigoDonacion;

  const premiosGrid = document.getElementById("premiosGrid");
  premiosGrid.innerHTML = RIFA_CONFIG.premios.map(p => `
    <div class="premio-thumb">
      <img src="${p.img}" alt="${p.nombre}" onerror="this.parentElement.textContent='${p.nombre}'">
    </div>
  `).join("");

  [...premiosGrid.querySelectorAll("img"), document.getElementById("qrNequi"), document.getElementById("qrBreB")]
    .forEach(habilitarZoom);
}

function habilitarZoom(img) {
  img.addEventListener("click", () => abrirLightbox(img.src, img.src.split("/").pop()));
}

function abrirLightbox(src, nombreArchivo) {
  document.getElementById("lightboxImg").src = src;
  const dl = document.getElementById("lightboxDownload");
  dl.href = src;
  dl.setAttribute("download", nombreArchivo || "");
  document.getElementById("lightboxBackdrop").classList.add("open");
}

function cerrarLightbox() {
  document.getElementById("lightboxBackdrop").classList.remove("open");
}

function actualizarProgreso() {
  const pagadas = Object.values(boletasState).filter(b => b.estado === "pagado").length;
  const recaudado = (pagadas * RIFA_CONFIG.valorBoleta) + RIFA_CONFIG.donacionesLibres;
  const pct = Math.min(100, (recaudado / RIFA_CONFIG.metaRecaudo) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("recaudado").textContent = money(recaudado);
}

function pintarGrid() {
  const grid = document.getElementById("boletasGrid");
  document.getElementById("boletasLoader").classList.add("oculto");
  grid.classList.remove("oculto");
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
    `Hola! Compré la boleta #${numeroSeleccionado} de la rifa "${RIFA_CONFIG.titulo}".\n` +
    `Nombre: ${nombre}\n` +
    `Mi WhatsApp: ${telefono}\n` +
    `Te envío a continuación el comprobante de pago.`
  );
  window.open(`https://wa.me/${RIFA_CONFIG.whatsappNumero}?text=${mensaje}`, "_blank");

  cerrarModal();
}

document.getElementById("modalClose").addEventListener("click", cerrarModal);
document.getElementById("modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") cerrarModal();
});
document.getElementById("btnConfirmarReserva").addEventListener("click", confirmarReserva);

document.getElementById("lightboxClose").addEventListener("click", cerrarLightbox);
document.getElementById("lightboxBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "lightboxBackdrop") cerrarLightbox();
});

// ---- Compartir ----
function textoCompartir() {
  return `🛹 Apoya el futuro del deporte en Manizales: participa en la rifa "${RIFA_CONFIG.titulo}" y ayuda a pagar la afiliación de nuestro club a la Liga Caldense de Patinaje. ¡Boletas desde $10.000!`;
}

function urlSitio() {
  return window.location.href.split("#")[0];
}

const shareMenu = document.getElementById("shareMenu");

document.getElementById("shareWhatsapp").href =
  `https://wa.me/?text=${encodeURIComponent(textoCompartir() + " " + urlSitio())}`;
document.getElementById("shareFacebook").href =
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlSitio())}`;
document.getElementById("shareX").href =
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartir())}&url=${encodeURIComponent(urlSitio())}`;

document.getElementById("shareFabBtn").addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({ title: RIFA_CONFIG.titulo, text: textoCompartir(), url: urlSitio() }).catch(() => {});
  } else {
    shareMenu.classList.toggle("open");
  }
});

document.getElementById("shareCopiar").addEventListener("click", async () => {
  await navigator.clipboard.writeText(urlSitio());
  alert("¡Enlace copiado!");
  shareMenu.classList.remove("open");
});

document.getElementById("shareInstagram").addEventListener("click", async () => {
  // Instagram no permite compartir un link prellenado desde la web,
  // así que copiamos el enlace para pegarlo en la historia o la bio.
  await navigator.clipboard.writeText(urlSitio());
  alert("¡Enlace copiado! Pégalo en tu historia o en la bio de Instagram.");
  shareMenu.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (!document.getElementById("shareFabWrap").contains(e.target)) {
    shareMenu.classList.remove("open");
  }
});

// ---- Init ----
pintarInfoEstatica();
escucharBoletas((data) => {
  boletasState = data;
  pintarGrid();
});
