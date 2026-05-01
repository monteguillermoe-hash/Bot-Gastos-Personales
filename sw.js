/**
 * APP FINANZAS – Service Worker
 * Cachea recursos estáticos y permite uso offline.
 */

const CACHE_NAME    = "app-finanzas-v1";
const CACHE_TIMEOUT = 3000; // ms antes de usar caché como fallback

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  // Agrega aquí cualquier CSS / JS extra que uses:
  // "./styles.css",
  // "./app.js",
];

// ── Instalación: pre-cacheo de recursos estáticos ───────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando…");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Pre-cacheando recursos estáticos…");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // activa el SW de inmediato
  );
});

// ── Activación: elimina cachés viejas ───────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando…");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log(`[SW] Eliminando caché antigua: ${key}`);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim()) // toma control de las pestañas abiertas
  );
});

// ── Fetch: estrategia "Network first, caché como fallback" ──────────────────
self.addEventListener("fetch", (event) => {
  // Solo interceptamos peticiones GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    Promise.race([
      // Intenta obtener la respuesta de la red
      fetch(event.request.clone()).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          // Actualiza la caché con la respuesta fresca
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }),

      // Si la red tarda más de CACHE_TIMEOUT ms, devuelve la caché
      new Promise((resolve) =>
        setTimeout(async () => {
          const cached = await caches.match(event.request);
          if (cached) resolve(cached);
        }, CACHE_TIMEOUT)
      ),
    ]).catch(async () => {
      // Sin red y sin caché: devuelve index.html como fallback genérico
      const cached = await caches.match(event.request);
      return cached || caches.match("./index.html");
    })
  );
});
