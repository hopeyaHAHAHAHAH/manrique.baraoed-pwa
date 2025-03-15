const CACHE_NAME = 'snake-game-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/snake.js',
  '/styles.css',
  '/manifest.json',
  '/icons/snake_icon_192.png',
  '/icons/snake_icon_512.png' // Optional: any additional images you want to cache
];

// Install the Service Worker and Cache the Game Files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Fetch the Cached Files
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached files or fetch them from the network
        return response || fetch(event.request);
      })
  );
});

// Activate the Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
