// ============================================================
// CONFIGURACIÓN DE LA RIFA — edita solo este archivo
// ============================================================
const RIFA_CONFIG = {
  titulo: "Skate Solidario",
  subtitulo: "Rifa Tabla Skate · Liga de Deporte",

  // ⚠️ Revisa esto: el mockup decía 01 de agosto, el poster dice 08 de agosto.
  fechaSorteo: "2026-08-08",
  fechaSorteoTexto: "Sábado, 08 de Agosto de 2026",
  juegaCon: "Lotería de Boyacá (Últimas 2 cifras del Premio Mayor)",

  valorBoleta: 10000, // COP
  metaRecaudo: 1750000, // COP (100 boletas x 10.000... si aplica)
  totalBoletas: 100, // 00-99

  // Número de WhatsApp del encargado del club (con indicativo, sin +, sin espacios)
  whatsappNumero: "573153018036",

  // Datos de pago (se muestran en la sección de pagos)
  pago: {
    nequiDaviplata: "315 301 8036",
    qrNequiUrl: "assets/qr-nequi.png",
    qrBreBUrl: "assets/qr-breb.jpg",
    llaveBreB: "@3153018036",
    codigoDonacion: "LIGA-SKATE-MANIZALES",
  },

  premios: [
    { nombre: "Tabla completa de skate", img: "assets/premio-madero.jpg" },
  ],

  // Credenciales de Firebase (las obtienes al crear el proyecto en
  // https://console.firebase.google.com — ver README.md paso a paso)
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
  },
};
