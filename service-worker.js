const CACHE = 'v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => 
      cache.addAll(['index.html', 'manifest.json'])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
});
