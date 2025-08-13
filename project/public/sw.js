const CACHE_NAME = 'mindwyn-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Skip unsupported schemes (e.g., chrome-extension:)
  if (!event.request.url.startsWith('http')) {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline mood entries
self.addEventListener('sync', (event) => {
  if (event.tag === 'mood-sync') {
    event.waitUntil(syncMoodEntries());
  }
});

async function syncMoodEntries() {
  // Sync logic would go here if we had a backend
  console.log('Syncing mood entries...');
}