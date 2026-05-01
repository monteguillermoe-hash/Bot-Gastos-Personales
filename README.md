# APP FINANZAS 💰
## Misiones · Región 3

---

## Estructura del proyecto

```
APP FINANZAS/
├── bot.py              ← Bot de Telegram + Google Sheets
├── requirements.txt    ← Dependencias Python
├── .env                ← Token del bot (¡no subir a git!)
├── credentials.json    ← OAuth Desktop (bajar de Google Cloud Console)
├── token.json          ← Se genera automáticamente al autorizar
├── index.html          ← PWA principal
├── manifest.json       ← Configuración PWA
├── sw.js               ← Service Worker (caché offline)
├── icon-192.png        ← Ícono 192×192 (agregar manualmente)
└── icon-512.png        ← Ícono 512×512 (agregar manualmente)
```

---

## Parte 1 – Bot de Telegram

### 1. Configurar el token
Editá `.env` y reemplazá `TU_TOKEN_DEL_BOT` por el token que te dio @BotFather:
```
TELEGRAM_TOKEN=123456789:ABCdef...
```

### 2. Obtener credentials.json
1. Ir a https://console.cloud.google.com
2. Crear proyecto → Habilitar **Google Sheets API** y **Google Drive API**
3. Credenciales → **Crear credenciales** → **ID de cliente OAuth 2.0** → tipo **Aplicación de escritorio**
4. Descargar el JSON y guardarlo como `credentials.json` en esta carpeta

### 3. Instalar dependencias
```bash
cd "APP FINANZAS"
pip install -r requirements.txt
```

### 4. Ejecutar el bot
```bash
python bot.py
```
La primera vez se abrirá el navegador para autorizar tu cuenta de Google.
Se guardará `token.json` y no será necesario repetir el proceso.

### 5. Comandos disponibles
| Comando | Descripción |
|---|---|
| `/start` o `/ayuda` | Lista de comandos |
| `/gasto <monto> <detalle> <categoria> <subcategoria> <medio>` | Registra un gasto |

**Ejemplo:**
```
/gasto 1500 Almuerzo Alimentacion Restaurante Efectivo
```
Escribe en la planilla **Gastos Personales 2026** (ID: `1R6CujT2y1BY24nTQID9mieOd2Bek_NpFzDVhxC4f2T4`):

| Fecha | Hora | Monto | Detalle | Categoría | Subcategoría | Medio |
|---|---|---|---|---|---|---|
| 28/04/2026 | 14:35:22 | 1500 | Almuerzo | Alimentacion | Restaurante | Efectivo |

---

## Parte 2 – PWA (Web como App)

### Iconos
Agregá manualmente a esta carpeta:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

### Servir localmente (prueba)
```bash
# Python 3
python -m http.server 8080
# Luego abrí: http://localhost:8080
```

### Instalar en el celular
1. Abrí `index.html` desde un servidor con HTTPS (o localhost)
2. En Chrome/Android: aparece el banner **"Agregar a pantalla de inicio"**
3. En Safari/iOS: menú Compartir → **"Añadir a pantalla de inicio"**

### Deploy sugerido
- **GitHub Pages** (gratis, HTTPS automático)
- **Netlify** (gratis, HTTPS automático)
- Cualquier hosting que sirva HTTPS

---

## Notas de seguridad
- No subas `.env`, `credentials.json` ni `token.json` a repositorios públicos.
- Agregá estas líneas a tu `.gitignore`:
```
.env
credentials.json
token.json
```
