# Journal des modifications — Hasta La Vista

Les entrées les plus récentes sont en haut. Voir le modèle dans `AGENTS.md`.

## 2026-11-02 — Claude — claude/idiomas-y-fuentes
- **Trois langues** : `index.html` (espagnol, textes inchangés), `fr.html` (français) et `en.html` (anglais). Un sélecteur ES · FR · EN apparaît en haut de chaque page.
- Choix de traduction :
  - en français, on tutoie, comme en espagnol ;
  - le titre « Hagamos algo bello » devient « Créons du beau. » en français et « Let’s make it beautiful. » en anglais ;
  - la citation sur la folie reprend la formule française consacrée, « Il n’y a pas de génie sans un grain de folie ».
- **Polices hébergées sur le site** (`fuentes/`, 196 Ko) : le site ne dépend plus de Google Fonts. Il est plus rapide, n’envoie plus de données à Google et s’affiche correctement même hors ligne.
- **Organisation** : le CSS va dans `estilos.css` et le JavaScript dans `app.js`, communs aux trois langues, pour ne pas recopier le style trois fois. `AGENTS.md` est mis à jour en conséquence, avec une nouvelle règle : chaque changement de texte se fait dans les trois langues.
- Vérifié : les trois pages s’affichent sans erreur, sur ordinateur et sur mobile.
- À relire par Ritukah : les traductions, surtout ton histoire dans « La graine de Hasta La Vista ».

## 2026-11-02 — Claude — claude/nueva-maquetacion
- **Couleurs** : la palette reprend celles de l'arbre (bleu marine `#052a58`, rouge `#d90211`, or `#ebaf12`). L'arbre devient aussi l'icône de l'onglet (`icono.png`, nouveau fichier de 9 Ko) et le logo de l'en-tête.
- **Accessibilité** :
  - textes agrandis (12 px minimum, paragraphes en 15-17 px) et gris plus foncé, avec des contrastes vérifiés ;
  - menu dépliant sur mobile ;
  - bouton pause sur le bandeau défilant ;
  - lien « Saltar al contenido » pour aller directement au contenu ;
  - contour visible quand on navigue au clavier ;
  - la fenêtre de participation garde le clavier à l'intérieur, rend la main au bouton d'origine et bloque le défilement de la page derrière elle.
- **Phrases surgissantes** : elles n'apparaissent plus en boucle. Chacune apparaît une seule fois, comme une récompense : à l'arrivée sur trois sections, puis à l'envoi du formulaire. Jamais en jaune, car le jaune ne se lit pas sur le fond crème.
- **Nouvelle section « 03 — Un ejemplo »** : un projet pilote fictif (« Devolver el color a la plaza de un pueblo »), avec cinq jauges de contribution (idées, heures, métiers, IA, argent). Il est clairement indiqué comme inventé. Les sections suivantes sont renumérotées 04 et 05.
- **Nettoyage** :
  - CSS en double supprimé ;
  - styles inutiles supprimés ;
  - polices chargées avec `<link>` au lieu de `@import`, ce qui est plus rapide ;
  - pied de page sorti de `<main>` ;
  - aperçu de partage (titre et description) ajouté.
- Textes de fond inchangés.
- À décider : la citation « No hay genio sin un poco de locura » apparaît toujours deux fois. Les polices viennent toujours de Google : on peut les héberger nous-mêmes, si Ritukah est d'accord.

## 2026-11-02 — Claude — claude/regles-communes
- Ajout de `AGENTS.md` (règles communes à toutes les IA), de `CLAUDE.md` (renvoie vers ces règles) et de ce journal.
- Pourquoi : permettre à Claude et ChatGPT de travailler sur les mêmes fichiers sans perdre le travail de l'autre, et laisser Ritukah décider de ce qui est gardé.
- Le site lui-même (`hasta-la-vista/`) n'a pas été modifié.
- À faire ensuite : choisir la première amélioration (couleurs de l'arbre, accessibilité ou projet pilote).

## 2026-11-02 — Ritukah — main
- Envoi initial du site : `hasta-la-vista/index.html` et `hasta-la-vista/emblema-arbol.png`.
