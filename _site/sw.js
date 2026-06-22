const CACHE_NAME = 'phenol-site-v3';

self.addEventListener('install', function(e)
{
  /* 预缓存页面 */
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache)
    {
      return cache.addAll([
        '/', '/posts/', '/archives/', '/about/', '/friends/', '/search/',
        '/index.css', '/loader.css', '/posts/style.css',
        '/js/sidebar.js', '/js/index.js', '/js/loader.js', '/js/changing-title.js',
        '/resources/Ph-H.png', '/favicon/favicon.ico'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e)
{
  e.respondWith(
    caches.match(e.request).then(function(cached)
    {
      /* 并发：从缓存返回 + 后台拉取新版本更新缓存 */
      var fetchPromise = fetch(e.request).then(function(response)
      {
        if (response && response.status === 200)
        {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, copy); });
        }
        return response;
      }).catch(function() { return cached; });

      return cached || fetchPromise;
    })
  );
});

self.addEventListener('activate', function(e)
{
  e.waitUntil(
    caches.keys().then(function(names)
    {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
            .map(function(n) { return caches.delete(n); })
      );
    })
  );
});
