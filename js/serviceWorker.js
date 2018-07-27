var cacheName = 'imageresizer';
var appShellFiles = [
    "favicon.png",
    "index.html",
    "manifest.json",
    "css/main.css",
    "js/install.js",
    "js/main.js",
    "img/12.png",
    "img/24.png",
    "img/32.png",
    "img/48.png",
    "img/128.png",
    "img/256.png",
    "img/512.png"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(appShellFiles);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
