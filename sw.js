/* Hasta La Vista — le service worker : rend le site installable et garde le ciel même sans réseau.
   - Les pages, le style et le code : réseau d'abord (toujours la dernière version), sinon la copie gardée.
   - Les polices, les icônes et les images : copie gardée d'abord (elles ne changent presque jamais).
   - Jamais touchés : Supabase (les chispas, les comptes, The Mix) et tous les autres sites. */
const VERSION = "hlv-v4-2026-11-18";
const CACHE = "hlv-" + VERSION;
const LANGS = ["index", "en", "fr", "pt", "ru", "ar", "hi", "bn", "zh"];
const VITRINAS = ["estrellas", "stars", "etoiles", "estrelas", "zvezdy", "nujum", "tare", "tara", "xingxing"];
const A_GARDER = [
  "/", "/index.html", "/manifest.webmanifest",
  ...LANGS.map(l => `/hasta-la-vista/${l}.html`), "/hasta-la-vista/", "/hasta-la-vista/privacidad.html",
  "/hasta-la-vista/estilos.css", "/hasta-la-vista/app.js",
  "/hasta-la-vista/lotus/lotus-medaillon.js", "/hasta-la-vista/lotus/lotus-medaillon.css",
  "/hasta-la-vista/lotus/lotus-medaillon.webp", "/hasta-la-vista/lotus/lotus-ether.webp",
  "/hasta-la-vista/icono.png", "/hasta-la-vista/emblema-arbol.png", "/hasta-la-vista/apple-touch-icon.png",
  "/hasta-la-vista/icone-192.png", "/hasta-la-vista/icone-512.png",
  ...["dm-mono-latin-400-normal", "dm-mono-latin-500-normal", "dm-sans-latin-400-normal", "dm-sans-latin-500-normal",
      "dm-sans-latin-600-normal", "dm-sans-latin-700-normal", "playfair-display-latin-600-italic",
      "playfair-display-latin-600-normal", "playfair-display-latin-700-italic", "playfair-display-latin-700-normal"]
    .map(f => `/hasta-la-vista/fuentes/${f}.woff2`),
  ...VITRINAS.map(v => `/maqueta/vitrina-${v}.html`), "/maqueta/vitrina.css"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    // un par un : si un fichier manque, les autres sont quand même gardés
    Promise.all(A_GARDER.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))
  ).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(cles => Promise.all(cles.filter(k => k.startsWith("hlv-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const STABLE = /\.(woff2|png|ico|jpg|jpeg|webp|svg)$/;

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;          // Supabase et les autres sites : jamais

  if (STABLE.test(url.pathname)) {
    e.respondWith(caches.match(r, { ignoreSearch: true }).then(gardee => gardee || fetch(r).then(rep => {
      if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
      return rep;
    })));
    return;
  }

  // « no-cache » : on demande toujours au serveur si la page a changé (sinon le navigateur garde l'ancienne jusqu'à 10 minutes)
  e.respondWith((r.mode === "navigate" ? fetch(r.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(r, { cache: "no-cache" })).then(rep => {
    if (rep.ok && !rep.redirected) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
    return rep;
  }).catch(() => caches.match(r, { ignoreSearch: true })
    .then(gardee => gardee || (r.mode === "navigate" ? caches.match("/hasta-la-vista/index.html") : Response.error()))));
});
