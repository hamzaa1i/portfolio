const CACHE_NAME = 'hamza-portfolio-v2';
const ASSETS = ['/', '/favicon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('hamza-portfolio-') && key !== CACHE_NAME).map(key => caches.delete(key)),
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Never intercept contact submissions, API responses or third-party security scripts.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (!ASSETS.includes(url.pathname)) return;
  event.respondWith(fetch(event.request).catch(async () =>
    (await caches.match(event.request)) || new Response('Offline. Please reconnect.', { status: 503 }),
  ));
});
