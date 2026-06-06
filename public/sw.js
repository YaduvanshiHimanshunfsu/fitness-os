const CACHE_NAME = 'fitness-os-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/favicon.ico',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response or fetch from network
      return response || fetch(event.request).catch(() => {
        // Fallback for offline mode, ideally returning a cached offline page
        return new Response('You are offline. Your workout will sync when you reconnect.', {
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
