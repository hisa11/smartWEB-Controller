// service-worker.js
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('v1').then(cache => cache.addAll([
        '/',
        '/static/css/bootstrap.min.css',
        '/static/js/bootstrap.bundle.min.js'
      ]))
    );
  });
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  });
  