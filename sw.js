const CACHE_NAME = 'suivi-guerison-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Pour les requêtes GET, essaye le réseau d'abord, puis le cache
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone la réponse
          const clonedResponse = response.clone();
          
          // Mets en cache
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          
          return response;
        })
        .catch(() => {
          // Si pas de réseau, essaye le cache
          return caches.match(event.request);
        })
    );
  }
});
