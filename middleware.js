// Rideau d'ouverture de Hasta La Vista (Vercel Routing Middleware).
//
// Jusqu'au mardi 1er décembre 2026 à 00:00, heure de Paris (= 30 nov. 23:00 UTC),
// les visiteurs voient seulement /bientot.html, avec le décompte.
// Ritukah garde l'accès complet grâce à une clé secrète :
//   1. sur Vercel, variable d'environnement HLV_PREVIEW_KEY = une longue phrase secrète (16 caractères au moins) ;
//   2. il ouvre une fois https://hasta-la-vista.org/?cle=<la phrase> ;
//   3. un cookie retient la clé 60 jours sur cet appareil.
// À l'heure dite, le rideau se lève tout seul pour tout le monde : rien à faire.
// Pour ouvrir plus tôt : HLV_OPEN_NOW=1 sur Vercel, puis redéployer.
// (Même recette que Nebula et Atlas.Sea.)

import { next, rewrite } from '@vercel/functions';

export const OPEN_AT = Date.UTC(2026, 10, 30, 23, 0, 0); // 1er déc. 2026 00:00 à Paris
const COOKIE = 'hlv_preview';
const ALWAYS_PUBLIC = [
  /^\/bientot\.(html|css|js)$/,
  /^\/hasta-la-vista\/fuentes\//,
  /^\/hasta-la-vista\/(icono|emblema-arbol|apple-touch-icon|icone-[\w-]+)\.png$/,
  /^\/favicon[^/]*$/,
  /^\/robots\.txt$/,
];

export const config = {
  matcher: ['/((?!_vercel).*)'],
};

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export async function gate(request, now) {
  if (now >= OPEN_AT || process.env.HLV_OPEN_NOW === '1') return next();

  const url = new URL(request.url);
  if (ALWAYS_PUBLIC.some((re) => re.test(url.pathname))) return next();

  const key = process.env.HLV_PREVIEW_KEY || '';
  if (key.length >= 16) {
    const expected = await sha256(key);
    const given = url.searchParams.get('cle');
    if (given !== null) {
      url.searchParams.delete('cle');
      if (given === key) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: url.toString(),
            'Set-Cookie': `${COOKIE}=${expected}; Path=/; Max-Age=5184000; HttpOnly; Secure; SameSite=Lax`,
            'Cache-Control': 'no-store',
          },
        });
      }
    }
    if (readCookie(request, COOKIE) === expected) return next();
  }

  // Le service worker et le manifeste attendent l'ouverture : rien ne s'installe avant
  if (url.pathname === '/sw.js' || url.pathname === '/manifest.webmanifest') {
    return new Response('', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  return rewrite(new URL('/bientot.html', request.url), {
    headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
  });
}

// Vercel appelle middleware(request) : l'heure est prise ici, au moment de la visite.
export default function middleware(request) {
  return gate(request, Date.now());
}
