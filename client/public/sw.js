const CACHE_NAME = 'para-po-v2.9.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
];

// Install Event: Precache Static App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for static assets; Network-First for API requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore chrome-extension or non-GET requests for standard caching
  if (request.method !== 'GET') {
    // For POST /api/extract, handle network with cache cloning
    if (url.pathname.startsWith('/api/extract') && request.method === 'POST') {
      event.respondWith(
        fetch(request.clone())
          .then((response) => {
            if (response.status === 200) {
              const resClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put('/api/last-extracted-route', resClone);
              });
            }
            return response;
          })
          .catch(async () => {
            const cached = await caches.match('/api/last-extracted-route');
            if (cached) return cached;
            return new Response(
              JSON.stringify({ error: 'Offline ka ngayon. Ipinapakita ang huling na-save na ruta kung available.' }),
              { headers: { 'Content-Type': 'application/json' }, status: 503 }
            );
          })
      );
    }
    return;
  }

  // 1. Google Fonts / External CDNs: Cache-First
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          return response;
        });
      })
    );
    return;
  }

  // 2. API Routes: Network-First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 3. App Shell Static Assets & Vite Bundles: Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Fetch in background to update cache for next load
        fetch(request).then((response) => {
          if (response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(request).then((response) => {
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        }
        return response;
      }).catch(() => {
        // Fallback to offline index.html if navigating
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
