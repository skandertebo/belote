// cache files
var cacheName = 'v1';
var cacheFiles = [
    './',
    './index.html',
    './style.css',
    './index.js',
    'logo.png'
]
// install event
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    );
});


// cache first strategy
self.addEventListener('fetch', function(event) {
    // respond with cache
    event.respondWith(
        caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) { return response; }
        return fetch(event.request);
        })
    );
});