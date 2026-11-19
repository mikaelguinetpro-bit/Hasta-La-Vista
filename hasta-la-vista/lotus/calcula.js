/*
 * Calcula — le compteur de l'Empire Éther.
 *
 * Un seul fichier, sans dépendance, posé sur les cinq sites. Il compte, il ne
 * reconnaît personne :
 *   · pas de cookie, rien d'écrit dans le navigateur, aucun identifiant ;
 *   · l'adresse IP n'est pas gardée, le navigateur n'est pas décrit ;
 *   · seule la première partie de l'adresse de la page est envoyée (« /hall »),
 *     jamais ce qui suit, ni les paramètres ;
 *   · d'où vient le Créateur est réduit à une catégorie (un des sites de
 *     l'Empire, un moteur de recherche, un réseau social, direct, ailleurs) ;
 *   · si le navigateur demande à ne pas être suivi (Do Not Track, Global
 *     Privacy Control), rien n'est envoyé du tout.
 *
 * Le serveur n'ajoute que +1 à des compteurs par jour. Aucune visite n'est
 * gardée une à une : il est impossible, même pour le Gardien, de retrouver
 * le passage d'une personne.
 *
 * Posé seul :  <script src="/lotus/calcula.js" data-calcula-site="air" defer></script>
 * Sur les quatre sites offerts, lotus-medaillon.js le charge tout seul.
 *
 *   data-calcula-site : ether | feu | terre | air | eau
 *   data-calcula-api  : adresse du serveur (par défaut celui de BNM1)
 *
 * Les autres scripts peuvent signaler un geste : window.calcula('lotus-ouvert').
 */
(function () {
    'use strict';

    if (window.calcula) return;
    var file = [];
    window.calcula = function (geste) { file.push(geste); };

    var script = document.currentScript;
    var SITE = (script && script.dataset.calculaSite) || '';
    var API = ((script && script.dataset.calculaApi) || 'https://api.brand-new-meta-1.agency').replace(/\/+$/, '') + '/api/calcula';
    var SITES = ['ether', 'feu', 'terre', 'air', 'eau'];
    if (SITES.indexOf(SITE) < 0) return;

    // Le Créateur a demandé à ne pas être suivi : on le respecte, sans exception.
    var nav = window.navigator || {};
    if (nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1') {
        window.calcula = function () {};
        return;
    }
    // Les robots de test ne comptent pas.
    if (nav.webdriver) { window.calcula = function () {}; return; }

    var EMPIRE = {
        'brand-new-meta-1.agency': 'ether',
        'typ-1.site': 'feu', 'typ-1.help': 'feu', 'typ-1site.vercel.app': 'feu',
        'atlassea.me': 'terre',
        'nebulatkn.foundation': 'air',
        'hasta-la-vista.org': 'eau'
    };
    var MOTEURS = /(^|\.)(google|bing|duckduckgo|qwant|ecosia|yahoo|yandex|baidu|startpage|brave)\./;
    var RESEAUX = /(^|\.)(facebook|fb|instagram|t\.co|twitter|x\.com|linkedin|lnkd|whatsapp|wa\.me|telegram|t\.me|tiktok|youtube|youtu\.be|reddit|pinterest|threads|bsky|mastodon|discord|snapchat)/;

    function hote(h) { return String(h || '').toLowerCase().replace(/^www\./, ''); }

    // D'où vient-on ? Une catégorie, jamais l'adresse.
    function source() {
        var ref = '';
        try { ref = hote(new URL(document.referrer).hostname); } catch (e) { return { source: 'direct' }; }
        if (!ref || ref === hote(location.hostname)) return null; // on était déjà sur le site
        if (EMPIRE[ref]) return { source: 'empire', depuis: EMPIRE[ref] };
        if (MOTEURS.test(ref)) return { source: 'moteur' };
        if (RESEAUX.test(ref)) return { source: 'reseau' };
        return { source: 'ailleurs' };
    }

    // Seulement le premier morceau du chemin : « /hall/membre-x » devient « /hall ».
    function rubrique() {
        var p = (location.pathname || '/').split('/').filter(Boolean)[0] || '';
        p = p.toLowerCase().replace(/\.html?$/, '');
        if (p === 'index') p = '';
        return /^[a-z0-9-]{0,24}$/.test(p) ? '/' + p : '/autre';
    }

    function appareil() {
        var l = window.innerWidth || 1024;
        return l < 640 ? 'mobile' : l < 1024 ? 'tablette' : 'ordinateur';
    }

    function langue() {
        var l = (document.documentElement.getAttribute('lang') || nav.language || '').toLowerCase().slice(0, 2);
        return /^[a-z]{2}$/.test(l) ? l : 'autre';
    }

    function envoie(corps) {
        corps.site = SITE;
        var texte = JSON.stringify(corps);
        try {
            // text/plain : pas de demande préalable, pas de cookie envoyé.
            if (nav.sendBeacon && nav.sendBeacon(API, new Blob([texte], { type: 'text/plain' }))) return;
        } catch (e) { /* on tente autrement */ }
        try {
            fetch(API, { method: 'POST', body: texte, keepalive: true, credentials: 'omit', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' } });
        } catch (e) { /* tant pis : un chiffre de moins, rien de cassé */ }
    }

    var derniere = null;
    function vue(premiere) {
        var r = rubrique();
        // Le sanctuaire de BNM1 ne se compte pas : ce sont Ritukah et les 22.
        if (SITE === 'ether' && (r === '/desk' || r === '/lieu' || r === '/sanctuaire')) return;
        if (r === derniere) return;
        derniere = r;
        var corps = { type: 'vue', rubrique: r };
        if (premiere) {
            var rechargee = false;
            try {
                var n = performance.getEntriesByType('navigation')[0];
                rechargee = !!(n && n.type === 'reload');
            } catch (e) { /* ancien navigateur */ }
            var s = rechargee ? null : source();
            if (s) {
                corps.arrivee = s.source;
                if (s.depuis) corps.depuis = s.depuis;
                corps.langue = langue();
                corps.appareil = appareil();
            }
        }
        envoie(corps);
    }

    var GESTE = /^[a-z0-9-]{1,32}$/;
    window.calcula = function (geste) {
        if (GESTE.test(String(geste || ''))) envoie({ type: 'geste', geste: String(geste) });
    };

    function demarre() {
        vue(true);
        file.forEach(window.calcula);
        file = [];
        // Les sites d'une seule page (BNM1, Atlas) changent d'adresse sans recharger.
        ['pushState', 'replaceState'].forEach(function (m) {
            var orig = history[m];
            if (typeof orig !== 'function') return;
            history[m] = function () {
                var r = orig.apply(this, arguments);
                setTimeout(function () { vue(false); }, 0);
                return r;
            };
        });
        window.addEventListener('popstate', function () { vue(false); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarre);
    else demarre();
})();
