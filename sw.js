// Grow up : garde tous les fichiers de l'appli en cache pour qu'elle marche sans connexion.
// À chaque modification d'un de ces fichiers, changer VERSION : c'est ce qui fait récupérer la nouvelle version aux téléphones.
const VERSION = '2';
const CACHE = 'grow-up-' + VERSION;
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'fonts/barlow-condensed-500.woff2',
  'fonts/barlow-condensed-600.woff2',
  'fonts/barlow-condensed-700.woff2',
  'fonts/source-sans-3.woff2'
];

self.addEventListener('install', e => {
  // cache: 'reload' : ne pas reprendre une ancienne copie du cache HTTP
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.indexOf('grow-up-') === 0 && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Cache d'abord : l'appli s'ouvre tout de suite, même avec un mauvais réseau à la salle
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(err => {
    if (req.mode === 'navigate') return caches.match('./');
    throw err;
  })));
});
