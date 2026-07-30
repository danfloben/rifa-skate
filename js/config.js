// ============================================================
// CONFIGURACIÓN DE LA RIFA — edita solo este archivo
// ============================================================
const RIFA_CONFIG = {
  titulo: "Skate Solidario",
  subtitulo: "Rifa Tabla Skate · Liga de Deporte",

  fechaSorteo: "2026-08-12",
  fechaSorteoTexto: "Miércoles, 12 de Agosto de 2026",
  juegaCon: "Lotería de Manizales (Últimas 2 cifras del Premio Mayor)",

  valorBoleta: 10000, // COP
  metaRecaudo: 1750000, // COP (boletas + donaciones libres)
  totalBoletas: 100, // 00-99

  // Total recaudado a mostrar en la barra de progreso. Se actualiza
  // manualmente (suma boletas pagadas + donaciones libres por Bre-B/Nequi),
  // independiente del conteo de boletas marcadas "pagado" en el admin.
  recaudadoManual: 200000,

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
    apiKey: "AIzaSyD6zV78_Eoo709r5G_o-qFaUTAoMX6aNUI",
    authDomain: "skate-solidario.firebaseapp.com",
    projectId: "skate-solidario",
    storageBucket: "skate-solidario.firebasestorage.app",
    messagingSenderId: "422997557518",
    appId: "1:422997557518:web:338fb009a02895a113175f",
  },
};
