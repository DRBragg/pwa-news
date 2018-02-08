// Reference basic app files for caching
const staticAssets = [
  './', './styles.css', './app.js', './fallback.json', './images/fetch-dog.jpg'
];

// cache static assets on install
self.addEventListener('install', async (e) => {
  const cache = await caches.open('news-static');
  cache.addAll(staticAssets);
});

// Intercept HTTP requests
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // If request is requesting static assets serve cached assets
  // If request is requesting news stories check cache
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});

// Serve cached assets if they are saved otherwise fetch assets
async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

// Try to fetch news stories and cache them otherwise serve cached stories
async function networkFirst(req) {
  const cache = await caches.open('news-dynamic');

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || await caches.match('./fallback.json')
  }
}
