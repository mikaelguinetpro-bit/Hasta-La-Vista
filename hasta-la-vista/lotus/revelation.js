/*
 * La Révélation — le décompte commun aux quatre sites offerts.
 *
 * Décidé par Ritukah le 21/11/2026 : l'association qui porte les quatre sites
 * révèle son nom le 21 décembre 2026 à 12h21, heure de Paris (21/12 à 12h21 :
 * un miroir), au cœur du Lotus, sur BNM1.
 *
 * Un seul fichier, sans dépendance, posé à l'identique sur Typ-1, Atlas.Sea,
 * Nebula et Hasta La Vista, à côté de lotus-medaillon.js :
 *   <script src="/lotus/revelation.js"></script>
 *
 * Il pose un bandeau discret tout en haut de la page. Le Créateur peut le
 * fermer : il revient à sa prochaine visite.
 *
 * Le nom n'est JAMAIS écrit ici : ce fichier est lisible par tous. Le jour
 * venu, le bandeau invite à le découvrir au cœur du Lotus, sur BNM1.
 *
 * Options (facultatives) :
 *   data-revelation-style : chemin du fichier de style (par défaut, le même
 *                           nom en .css, à côté du script). Le style ne peut
 *                           pas être injecté : certains sites le refusent.
 *   data-revelation-avant : sélecteur de l'élément devant lequel poser le
 *                           bandeau (par défaut, en tête de <body>).
 *   data-revelation-masque-classe : si <body> porte cette classe, le bandeau
 *                           s'efface (ex. quand le Créateur est dans le tipi).
 *   data-revelation-coin-occupe : présent si le site a déjà un bouton dans le
 *                           coin haut-droit (ex. le son de Typ-1) : le bandeau
 *                           lui laisse la place et met sa croix de l'autre côté.
 *
 * La langue est lue sur <html lang="…"> ; à défaut, le français. Si le site
 * change de langue sans recharger la page, le bandeau la suit.
 */
(function () {
    'use strict';

    if (window.__revelationPosee) return;
    window.__revelationPosee = true;

    var REVELATION = Date.parse('2026-12-21T12:21:00+01:00');
    var BNM1 = 'https://brand-new-meta-1.agency/';
    var CLE = 'revelation_fermee';

    var script = document.currentScript;
    var STYLE = (script && script.dataset.revelationStyle) ||
        ((script && script.src ? script.src : '').replace(/\.js(\?.*)?$/, '.css') || '/lotus/revelation.css');
    var AVANT = (script && script.dataset.revelationAvant) || '';
    var MASQUE_CLASSE = (script && script.dataset.revelationMasqueClasse) || '';
    var COIN_OCCUPE = !!(script && script.hasAttribute('data-revelation-coin-occupe'));

    // ---------------------------------------------------------------- les mots
    var MOTS = {
        fr: { tag: '· La Révélation ·', annonce: 'L’association révélera son nom le 21 décembre à 12h21, heure de Paris.', prets: 'Soyez prêts, car son nom sera porteur d’intelligence, de sagesse, de résilience et de force.', salut: 'Tout cela pour le salut. Pour votre salut.', j: 'jours', h: 'heures', m: 'minutes', s: 'secondes', lien: 'Au cœur du Lotus →', revele: 'Le nom est révélé. Il vous attend au cœur du Lotus.', fermer: 'Fermer' },
        en: { tag: '· The Revelation ·', annonce: 'The association will reveal its name on December 21 at 12:21, Paris time.', prets: 'Be ready, for its name will carry intelligence, wisdom, resilience and strength.', salut: 'All of this for salvation. For your salvation.', j: 'days', h: 'hours', m: 'minutes', s: 'seconds', lien: 'To the heart of the Lotus →', revele: 'The name is revealed. It awaits you at the heart of the Lotus.', fermer: 'Close' },
        es: { tag: '· La Revelación ·', annonce: 'La asociación revelará su nombre el 21 de diciembre a las 12:21, hora de París.', prets: 'Estad preparados, porque su nombre traerá inteligencia, sabiduría, resiliencia y fuerza.', salut: 'Todo ello por la salvación. Por vuestra salvación.', j: 'días', h: 'horas', m: 'minutos', s: 'segundos', lien: 'Al corazón del Loto →', revele: 'El nombre ha sido revelado. Os espera en el corazón del Loto.', fermer: 'Cerrar' },
        pt: { tag: '· A Revelação ·', annonce: 'A associação revelará o seu nome a 21 de dezembro, às 12h21, hora de Paris.', prets: 'Estejam prontos, pois o seu nome trará inteligência, sabedoria, resiliência e força.', salut: 'Tudo isto pela salvação. Pela vossa salvação.', j: 'dias', h: 'horas', m: 'minutos', s: 'segundos', lien: 'Ao coração do Lótus →', revele: 'O nome foi revelado. Espera-vos no coração do Lótus.', fermer: 'Fechar' },
        ru: { tag: '· Откровение ·', annonce: 'Ассоциация откроет своё имя 21 декабря в 12:21 по парижскому времени.', prets: 'Будьте готовы: его имя понесёт разум, мудрость, стойкость и силу.', salut: 'Всё это — ради спасения. Ради вашего спасения.', j: 'дней', h: 'часов', m: 'минут', s: 'секунд', lien: 'К сердцу Лотоса →', revele: 'Имя открыто. Оно ждёт вас в сердце Лотоса.', fermer: 'Закрыть' },
        ar: { tag: '· الكشف ·', annonce: 'ستكشف الجمعية عن اسمها يوم 21 ديسمبر عند الساعة 12:21 بتوقيت باريس.', prets: 'كونوا مستعدين، فاسمها سيحمل الذكاء والحكمة والصمود والقوة.', salut: 'كل ذلك من أجل الخلاص. من أجل خلاصكم.', j: 'أيام', h: 'ساعات', m: 'دقائق', s: 'ثوانٍ', lien: 'إلى قلب اللوتس ←', revele: 'لقد كُشف الاسم. إنه ينتظركم في قلب اللوتس.', fermer: 'إغلاق' },
        hi: { tag: '· प्रकटीकरण ·', annonce: 'संस्था 21 दिसंबर को पेरिस समय के अनुसार 12:21 बजे अपना नाम प्रकट करेगी।', prets: 'तैयार रहिए, क्योंकि उसका नाम बुद्धि, विवेक, दृढ़ता और शक्ति लेकर आएगा।', salut: 'यह सब मुक्ति के लिए। आपकी मुक्ति के लिए।', j: 'दिन', h: 'घंटे', m: 'मिनट', s: 'सेकंड', lien: 'कमल के हृदय तक →', revele: 'नाम प्रकट हो गया है। वह कमल के हृदय में आपकी प्रतीक्षा कर रहा है।', fermer: 'बंद करें' },
        bn: { tag: '· প্রকাশ ·', annonce: 'সংগঠনটি 21 ডিসেম্বর প্যারিস সময় 12:21-এ তার নাম প্রকাশ করবে।', prets: 'প্রস্তুত থাকুন, কারণ তার নাম বয়ে আনবে বুদ্ধি, প্রজ্ঞা, সহনশীলতা আর শক্তি।', salut: 'এই সবই মুক্তির জন্য। আপনাদের মুক্তির জন্য।', j: 'দিন', h: 'ঘণ্টা', m: 'মিনিট', s: 'সেকেন্ড', lien: 'পদ্মের হৃদয়ে →', revele: 'নাম প্রকাশিত হয়েছে। পদ্মের হৃদয়ে তা আপনাদের অপেক্ষায়।', fermer: 'বন্ধ করুন' },
        zh: { tag: '· 揭晓 ·', annonce: '该协会将于12月21日12:21（巴黎时间）揭晓它的名字。', prets: '请做好准备，因为它的名字将承载智力、智慧、韧性与力量。', salut: '这一切都是为了救赎。为了你们的救赎。', j: '天', h: '小时', m: '分钟', s: '秒', lien: '前往莲花之心 →', revele: '名字已经揭晓。它在莲花之心等待着你们。', fermer: '关闭' }
    };

    function langue() {
        var l = (document.documentElement.getAttribute('lang') || 'fr').toLowerCase().split('-')[0];
        return MOTS[l] ? l : 'fr';
    }

    // Le Créateur l'a fermé pendant cette visite : il reviendra à la prochaine.
    try { if (window.sessionStorage.getItem(CLE) === '1') return; } catch (e) { /* stockage indisponible */ }

    function el(tag, cls, texte) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (texte) e.textContent = texte;
        return e;
    }

    function poser() {
        var lien = document.createElement('link');
        lien.rel = 'stylesheet';
        lien.href = STYLE;
        document.head.appendChild(lien);

        var bande = el('aside', 'revelation-bande');
        var interieur = el('div', 'revelation-interieur');
        var tag = el('div', 'revelation-tag');
        var annonce = el('p', 'revelation-annonce');
        var compte = el('div', 'revelation-compte');
        compte.setAttribute('aria-hidden', 'true');
        var cases = {};
        var unites = {};
        ['j', 'h', 'm', 's'].forEach(function (k) {
            var c = el('span', 'revelation-case');
            cases[k] = el('span', 'revelation-chiffre', '00');
            unites[k] = el('span', 'revelation-unite');
            c.appendChild(cases[k]);
            c.appendChild(unites[k]);
            compte.appendChild(c);
        });
        var prets = el('p', 'revelation-prets');
        var vers = el('a', 'revelation-lien');
        vers.href = BNM1;
        vers.rel = 'noopener';

        var fermer = el('button', 'revelation-fermer', '×');
        fermer.type = 'button';
        fermer.addEventListener('click', function () {
            try { window.sessionStorage.setItem(CLE, '1'); } catch (e) { /* rien */ }
            if (observateur) observateur.disconnect();
            if (minuterie) clearTimeout(minuterie);
            if (bande.parentNode) bande.parentNode.removeChild(bande);
        });

        interieur.appendChild(tag);
        interieur.appendChild(annonce);
        interieur.appendChild(compte);
        interieur.appendChild(prets);
        interieur.appendChild(vers);
        bande.appendChild(interieur);
        bande.appendChild(fermer);

        var revelee = false;

        // Écrit les mots dans la langue de la page (et les réécrit si elle change).
        function ecrire() {
            var L = langue();
            var M = MOTS[L];
            bande.className = 'revelation-bande' +
                (/^(ar|hi|bn|zh)$/.test(L) ? ' revelation-ecriture-liee' : '') +
                (revelee ? ' revelation-revelee' : '') +
                (COIN_OCCUPE ? ' revelation-coin-occupe' : '');
            bande.setAttribute('aria-label', M.tag.replace(/·/g, '').trim());
            bande.setAttribute('lang', L);
            bande.setAttribute('dir', L === 'ar' ? 'rtl' : 'ltr');
            tag.textContent = M.tag;
            annonce.textContent = revelee ? M.revele : M.annonce;
            ['j', 'h', 'm', 's'].forEach(function (k) { unites[k].textContent = M[k]; });
            prets.textContent = M.prets + ' ' + M.salut;
            vers.textContent = M.lien;
            fermer.setAttribute('aria-label', M.fermer);
        }

        var deux = function (n) { return (n < 10 ? '0' : '') + n; };
        var minuterie = null;
        function battre() {
            var reste = REVELATION - Date.now();
            if (reste <= 0) {
                // L'heure est venue : le nom attend au cœur du Lotus, sur BNM1.
                revelee = true;
                if (compte.parentNode) compte.parentNode.removeChild(compte);
                if (prets.parentNode) prets.parentNode.removeChild(prets);
                ecrire();
                return;
            }
            var s = Math.floor(reste / 1000);
            cases.j.textContent = deux(Math.floor(s / 86400));
            cases.h.textContent = deux(Math.floor((s % 86400) / 3600));
            cases.m.textContent = deux(Math.floor((s % 3600) / 60));
            cases.s.textContent = deux(s % 60);
            minuterie = setTimeout(battre, 1000 - (Date.now() % 1000));
        }

        // Comme le Lotus : le bandeau s'efface quand <body> porte la classe donnée.
        function masquer() {
            bande.hidden = !!(MASQUE_CLASSE && document.body.classList.contains(MASQUE_CLASSE));
        }

        ecrire();
        battre();
        masquer();

        var observateur = null;
        if (window.MutationObserver) {
            observateur = new MutationObserver(function () { ecrire(); });
            observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
            if (MASQUE_CLASSE) {
                new MutationObserver(masquer).observe(document.body, { attributes: true, attributeFilter: ['class'] });
            }
        }

        var cible = AVANT ? document.querySelector(AVANT) : null;
        if (cible && cible.parentNode) cible.parentNode.insertBefore(bande, cible);
        else document.body.insertBefore(bande, document.body.firstChild);
    }

    if (document.body) poser();
    else document.addEventListener('DOMContentLoaded', poser);
})();
