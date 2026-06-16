const CACHE_NAME = 'weather-dashboard-v1';
const urlsToCache = [
  './',
  './index-ios.html',
  './styles.css',
  './config.js',
  './api.js',
  './ui.js',
  './app.js',
  './manifest.json',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        // Não falhe se algumas URLs não puderem ser cacheadas
        return cache.addAll(urlsToCache.filter(url => !url.includes('http')));
      });
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Buscar com fallback para cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Para requisições de API, tentar rede primeiro, depois cache
  if (event.request.url.includes('openweathermap.org')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache respostas bem-sucedidas de API
          if (response.ok) {
            const cache_copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cache_copy);
            });
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tentar cache
          return caches.match(event.request).then((response) => {
            return response || new Response(
              JSON.stringify({ error: 'Sem conexão' }),
              { status: 503, statusText: 'Service Unavailable', headers: new Headers({ 'Content-Type': 'application/json' }) }
            );
          });
        })
    );
  } else {
    // Para arquivos estáticos, usar cache primeiro
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const cache_copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cache_copy);
          });
          return response;
        });
      })
    );
  }
});
