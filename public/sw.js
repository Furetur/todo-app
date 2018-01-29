const staticCachePrefix = 'static-cache-v';
const staticCacheVersion = 0;
const cacheName = staticCachePrefix + staticCacheVersion;

//edit
const files = [
    '/',
    '/styles.css',
    '/js/index.js',
    '/js/todo.js',
    '/js/data/db.js',
    '/js/data/memory.js',
    '/js/content/field.js',
    '/js/content/main-content.js',
    '/js/content/tabs.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css',
    'https://cdn.rawgit.com/mozilla/localForage/master/dist/localforage.js',
    'https://unpkg.com/axios/dist/axios.min.js'
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(files)
        })
    );
});



self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key.startsWith(staticCachePrefix) && key !== cacheName)
                    .map(key => caches.delete(key))
            )
        })
    )
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    if(requestUrl.origin === location.origin){
        event.respondWith(
            caches.open(cacheName).then(cache => {
                const urlInCache = requestUrl.pathname;
                return cache.match(urlInCache)
            }).then(cached => {
                return cached || fetch(event.request);
            })
        );
        return;
    }

    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request)
        }).then(response => {
            return response || fetch(event.request);
        })
    )

});


self.addEventListener('message', event => {
    const action = event.data.action;

    if(action === 'skipWaiting'){
        self.skipWaiting();
    }
})