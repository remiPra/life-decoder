// Service Worker minimaliste pour Life Decoder
// Permet l'installation PWA sans caching agressif

const CACHE_NAME = 'life-decoder-v1';

// Installation - pas de mise en cache pour l'instant
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting(); // Active immédiatement
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - stratégie Network First (toujours chercher en ligne d'abord)
self.addEventListener('fetch', (event) => {
  // Pas de cache, toujours fetch depuis le réseau
  event.respondWith(
    fetch(event.request).catch(() => {
      // Si offline, retourne une page basique
      return new Response(
        '<html><body><h1>Offline</h1><p>Life Decoder nécessite une connexion internet.</p></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    })
  );
});
