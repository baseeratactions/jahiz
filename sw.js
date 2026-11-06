// جاهز: عامل الخدمة لتطبيق الكمبيوتر والجوال.
// الشبكة أولاً دائماً؛ النسخة المحفوظة تُستخدم فقط عند انقطاع الإنترنت. لا يخزّن أي طلب إلى الخادم ولا بيانات العملاء،
// يخدم صفحات جاهز وحدها، ولا يمسّ أي موقع آخر.
const CACHE = 'jahiz-v20261106a';
const CORE = ['./', 'index.html', 'portal.html', 'login.html', 'about.html', 'privacy.html', 'legal.html', 'standards.html', '404.html',
  'en/index.html', 'en/portal.html', 'en/login.html', 'en/about.html',
  'site.webmanifest', 'assets/style.css', 'assets/market.css', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/apple-touch-icon.png'];
const BASE = new URL('./', self.location).pathname;
function mine(url) {
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return false;
  const p = url.pathname.slice(BASE.length);
  return p === '' || /^[^/]+\.(html|webmanifest|css|js|png|svg|json)$/.test(p) || /^(en|assets|data)\//.test(p);
}
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('jahiz-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!font && !mine(url)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()).catch(() => {});
      return res;
    } catch (err) {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await c.match(url.pathname.includes('/en/') ? 'en/index.html' : 'index.html')) || Response.error();
      return Response.error();
    }
  })());
});
