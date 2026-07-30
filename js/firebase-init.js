// ============================================================
// Conexión a Firebase (Firestore) — con modo demo de respaldo
// ============================================================
// Si no has puesto tus credenciales reales en config.js todavía,
// la app funciona en "modo demo" guardando el estado en el
// navegador (localStorage) para que puedas probar el flujo.
// Cuando pongas tus credenciales reales, cambia automáticamente
// a modo Firebase (compartido entre todos los usuarios).

const FIREBASE_READY = RIFA_CONFIG.firebase.apiKey !== "TU_API_KEY";

let db = null;

if (FIREBASE_READY) {
  firebase.initializeApp(RIFA_CONFIG.firebase);
  db = firebase.firestore();
}

const BOLETAS_COLLECTION = "boletas";

// --- Capa de datos: misma interfaz, dos implementaciones ---

async function obtenerBoletas() {
  if (FIREBASE_READY) {
    const snap = await db.collection(BOLETAS_COLLECTION).get();
    const data = {};
    snap.forEach((doc) => (data[doc.id] = doc.data()));
    return data;
  }
  return JSON.parse(localStorage.getItem("rifa_boletas_demo") || "{}");
}

function escucharBoletas(callback) {
  if (FIREBASE_READY) {
    return db.collection(BOLETAS_COLLECTION).onSnapshot((snap) => {
      const data = {};
      snap.forEach((doc) => (data[doc.id] = doc.data()));
      callback(data);
    });
  }
  // Modo demo: solo carga inicial, sin tiempo real entre pestañas
  obtenerBoletas().then(callback);
  return () => {};
}

async function guardarBoleta(numero, datos) {
  if (FIREBASE_READY) {
    await db.collection(BOLETAS_COLLECTION).doc(numero).set(datos, { merge: true });
    return;
  }
  const all = JSON.parse(localStorage.getItem("rifa_boletas_demo") || "{}");
  all[numero] = { ...(all[numero] || {}), ...datos };
  localStorage.setItem("rifa_boletas_demo", JSON.stringify(all));
}
