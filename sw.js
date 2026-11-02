// Loutrons : garde tous les fichiers de l'appli en cache pour qu'elle marche sans connexion.
// À chaque modification d'un de ces fichiers, changer VERSION : c'est ce qui fait récupérer la nouvelle version aux téléphones.
// Même numéro que dans js/version.js (affiché dans Réglages).
const VERSION = '1.3';
const CACHE = 'loutrons-' + VERSION;
const FILES = [
  './',
  'index.html',
  'js/app.js',
  'js/actions.js',
  'js/backup.js',
  'js/chart.js',
  'js/data.js',
  'js/engine.js',
  'js/library.js',
  'js/render.js',
  'js/store.js',
  'js/timers.js',
  'js/util.js',
  'js/version.js',
  'js/views/calendar.js',
  'js/views/editors.js',
  'js/views/history.js',
  'js/views/picker.js',
  'js/views/profile.js',
  'js/views/program.js',
  'js/views/progress.js',
  'js/views/session.js',
  'js/views/setup.js',
  'js/views/today.js',
  'manifest.webmanifest',
  'icons/logo.png',
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
    .then(keys => Promise.all(keys.filter(k => (k.indexOf('loutrons-') === 0 || k.indexOf('grow-up-') === 0) && k !== CACHE).map(k => caches.delete(k))))
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
