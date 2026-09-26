// SubseaGuard AI: Service Worker for Offline PWA Demo Caching
// Enables flawless offline operation in poor-WiFi interview rooms and offshore vessels

const CACHE_NAME = 'subseaguard-ai-v1';
const PRECACHE_ASSETS = [
  '/',
  '/app/',
  '/app/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('SubseaGuard SW precache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

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

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Ignore chrome-extension or other schemes
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    // Stale-while-revalidate for html, assets, and scripts
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is for a navigation page, return cached app entry
          if (request.mode === 'navigate') {
            return caches.match('/app/index.html') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
