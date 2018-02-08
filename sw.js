// Reference basic app files for caching
const staticAssets = [
  './', './styles.css', './app.js'
];

// cache static assets on install
self.addEventListener('install', async (e) => {
  const cache = await caches.open('news-static');
  cache.addAll(staticAssets);
});

// Intercept HTTP requests
self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(cacheFirst(req));
});

// Serve cached assets if they are saved otherwise fetch assets
async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}
