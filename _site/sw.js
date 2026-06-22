const CACHE_NAME = 'phenol-site-v2';
const URLS_TO_CACHE = [
  '/',
  '/posts/',
  '/archives/',
  '/about/',
  '/friends/',
  '/search/',
  '/index.css',
  '/loader.css',
  '/posts/style.css',
  '/js/sidebar.js',
  '/js/index.js',
  '/js/loader.js',
  '/js/changing-title.js',
  '/resources/Ph-H.png',
  '/favicon/favicon.ico'
];

self.addEventListener('install', function(e)
{
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache)
    {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', function(e)
{
  e.respondWith(
    caches.match(e.request).then(function(response)
    {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', function(e)
{
  e.waitUntil(
    caches.keys().then(function(names)
    {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME; })
            .map(function(name) { return caches.delete(name); })
      );
    })
  );
});
