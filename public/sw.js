const CACHE_NAME = 'quote-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
  '/manifest.json',
  '/icons/icon.png',
  '/icons/icon2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quotes') {
    event.waitUntil(syncPendingQuotes());
  }
});

function syncPendingQuotes() {
  return getQuotesFromIndexedDB().then(quotes => {
    return fetch('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(quotes),
      headers: { 'Content-Type': 'application/json' }
    });
  });
}

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

