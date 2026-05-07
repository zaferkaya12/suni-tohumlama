const CACHE_NAME = 'suni-tohumlama-v4';
const urlsToCache = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install
self.addEventListener('install', event => {
  console.log('[SW] Yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache açıldı');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Kurulum başarılı');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Kurulum hatası:', err);
      })
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('[SW] Aktifleştiriliyor...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Aktifleştirildi');
      return self.clients.claim();
    })
  );
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Başarılı response - cache'e kaydet
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network başarısız - cache'den getir
        return caches.match(event.request);
      })
  );
});
