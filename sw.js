const cacheName = "smartfocus-cache-v1";
const assetsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sounds/pop.mp3",
  "./sounds/click.mp3"
];

// Install service worker and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== cacheName) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Intercept network requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});