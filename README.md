# 🛹 Skate Solidario — Rifa Tabla Skate

Web app responsive para gestionar la rifa del club: grid de boletas 00-99,
reserva vía WhatsApp con comprobante, y panel admin para verificar pagos.

## Estructura del proyecto

```
rifa-skate/
├── index.html          → página principal (usuarios)
├── admin.html           → panel admin (verificación de pagos)
├── css/style.css        → estilos
├── js/
│   ├── config.js         → EDITA AQUÍ: fecha, precios, WhatsApp, Firebase
│   ├── firebase-init.js  → conexión a base de datos (con modo demo)
│   ├── app.js            → lógica página principal
│   └── admin.js          → lógica panel admin
├── assets/               → pon aquí tus imágenes (QR, premios)
└── .github/workflows/deploy.yml → deploy automático a GH Pages
```

## Paso 1 — Modo demo (sin Firebase, prueba rápida)

Así como está, el proyecto ya funciona: abre `index.html` en el navegador
y prueba el flujo. El estado de las boletas se guarda en tu propio
navegador (localStorage) — útil para probar el diseño y el flujo, pero
**no se comparte entre usuarios reales**. Para eso necesitas Firebase (paso 2).

## Paso 2 — Conectar Firebase (para que el estado sea compartido en tiempo real)

1. Ve a https://console.firebase.google.com → "Agregar proyecto" (gratis)
2. Dentro del proyecto: **Compilación → Firestore Database → Crear base de datos**
   → modo producción, región más cercana (ej. `southamerica-east1`)
3. En **Reglas** de Firestore, pega esto para empezar (ábrelo más adelante si quieres restringir escritura solo al admin):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /boletas/{boleta} {
         allow read: if true;
         allow write: if true; // ⚠️ ábrelo así para probar, luego restringe
       }
     }
   }
   ```
4. Ve a **Configuración del proyecto → General → Tus apps → Web (</>)** y registra la app
5. Copia el objeto `firebaseConfig` que te da y pégalo en `js/config.js`, dentro de `firebase: { ... }`
6. Listo — recarga la página y ya está en modo compartido/tiempo real

## Paso 3 — Subir tus assets reales

Reemplaza en `assets/`:
- `qr-nequi.png`, `qr-breb.png` → tus QR reales
- `premio-tabla.jpg`, `premio-deck.jpg`, etc. → fotos reales de los premios

Y ajusta textos/números en `js/config.js`.

## Paso 4 — Deploy a GitHub Pages

1. Sube este proyecto a tu repo de GitHub (rama `main`)
2. En GitHub: **Settings → Pages → Source → GitHub Actions**
3. Cada `git push` a `main` despliega solo (el workflow ya está incluido en `.github/workflows/deploy.yml`)

## Paso 5 — Trabajar desde el celular con Claude Code

1. Conecta este repo a Claude Code (una vez, desde una laptop o desde la app)
2. Desde la **app de Claude en tu celular**, abre una sesión remota de Claude Code sobre este repo
3. Pide cambios en lenguaje natural, ej:
   - "Cambia el color naranja por uno más oscuro en style.css"
   - "Agrega un contador de tiempo restante hasta el sorteo"
   - "El PIN del admin debe pedir confirmación doble antes de liberar una boleta"
4. Claude Code edita, commitea y pushea → GitHub Actions despliega solo
5. Revisas el resultado en la URL de GH Pages desde el mismo celular

## Seguridad del admin (importante antes de usarlo en producción real)

El PIN en `js/admin.js` es solo una barrera visual — cualquiera que abra
el código fuente del navegador puede verlo. Para algo más serio:
- Activa **Firebase Authentication** (email/password) en la consola
- Reemplaza el chequeo de PIN por un login real de Firebase Auth
- Cambia la regla de Firestore para que `allow write` requiera
  `request.auth != null`

Si quieres, pide esto como siguiente tarea y se implementa igual que
cualquier otro cambio: por chat, desde el celular.

## Notas

- ⚠️ **Revisar fecha del sorteo**: el mockup decía 01 de agosto y el
  poster dice 08 de agosto — está puesto como 08 en `config.js`, confírmalo.
- El grid es 00-99 (100 boletas). Si cambias `totalBoletas` en config,
  ajusta también la lógica de padding si pasas de 100.
