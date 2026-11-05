# Règles communes — Hasta La Vista

Ce fichier s'adresse à toutes les IA qui travaillent sur ce dépôt (Claude, ChatGPT / Codex, et toute autre).
**À lire en entier avant chaque intervention.**
Lis aussi **`VISION.md`**, qui décrit la vision du projet.

## La vision : les quatre piliers

Ces quatre piliers, définis par Ritukah, guident **chaque décision**, sur le site comme dans la future plateforme. Avant de proposer une modification, vérifie qu'elle respecte les quatre.

1. **Visibilité.** Tout se voit. L'IA travaille « derrière une vitrine » : ses actions, ses raisons et ses règles sont visibles par tous, tout le temps. Elle montre elle-même ce qu'elle fait, avec des messages beaux, doux mais percutants. Chaque personne est créditée clairement pour ce qu'elle apporte. Rien ne se décide dans l'ombre.
2. **Bienveillance.** L'endroit est doux. Chacun peut y oser une idée fragile sans peur d'être jugé ou moqué. La modération protège cette douceur : l'IA signale, les humains décident, et toute décision peut être contestée.
3. **Optimisation.** Chaque ressource va à sa juste place, comme une cale bien posée. L'IA aide à réduire les coûts là où il faut, sans gaspillage, pour que de petits moyens fassent de grandes choses.
4. **Disponibilité.** Ouvert à tous, autant que possible : sans barrière d'argent, de langue, de handicap ou de connaissances techniques. Le site doit rester accessible et utilisable par chacun.

**Au-dessus des quatre piliers : tout le monde est créateur.** Sur Hasta La Vista, on ne parle pas d'« utilisateurs » ni de « clients », mais de **créateurs**.

## Le projet

- **Hasta La Vista** est une plateforme qui veut rendre le monde plus beau grâce aux idées, au travail partagé, à l'intelligence humaine et aux agents IA.
- Le site se trouve dans `hasta-la-vista/` :
  - `index.html` (espagnol, langue principale), `en.html` (anglais), `fr.html` (français), `pt.html` (portugais), `ru.html` (russe), `ar.html` (arabe, écrit de droite à gauche), `hi.html` (hindi), `bn.html` (bengali) et `zh.html` (chinois simplifié) : les neuf versions de la page, avec la même structure ;
  - `estilos.css` : le style commun aux neuf versions (l'arabe, le hindi, le bengali et le chinois utilisent les polices de l'appareil, car celles du site n'ont pas leurs caractères ; l'arabe a ses propres règles de droite à gauche, marquées `[dir="rtl"]`) ;
  - `app.js` : le comportement commun (menu, fenêtre, animations), avec en tête les quelques textes du script dans les neuf langues ;
  - `fuentes/` : les polices, hébergées sur le site (licence SIL OFL, ne pas supprimer les fichiers `OFL-*.txt`) ;
  - `emblema-arbol.png` (l'arbre, emblème du projet) et `icono.png` (l'icône d'onglet).
- La maquette de la future plateforme se trouve dans `maqueta/`. C'est **« la vitrina »** : un ciel d'étoiles où chaque créateur est une étoile, avec l'IA qui travaille à la vue de tous (journal public, Tríada de la Benevolencia, rythme de π, recettes, comptes visibles, pages Projet et Créateur). Chaque fichier est autonome : polices et code sont intégrés. Rien n'y est enregistré, et les créateurs comme les chiffres sont inventés.
- La maquette existe aussi en **neuf langues** : `vitrina-estrellas.html` (es), `vitrina-stars.html` (en), `vitrina-etoiles.html` (fr), `vitrina-estrelas.html` (pt), `vitrina-zvezdy.html` (ru), `vitrina-nujum.html` (ar), `vitrina-tare.html` (hi), `vitrina-tara.html` (bn) et `vitrina-xingxing.html` (zh). Chaque page du site mène à la vitrina de sa langue. Toute modification de la maquette se fait dans les neuf fichiers.
- Dans `maqueta/`, le **style commun** des neuf vitrinas est dans `vitrina.css`, et les polices viennent de `../hasta-la-vista/fuentes/`, partagées avec le site. Chaque fichier `vitrina-*.html` contient son code et ses textes dans sa langue.
- **Toute modification du texte ou de la structure d'une page doit être faite dans les neuf langues** (`index.html`, `en.html`, `fr.html`, `pt.html`, `ru.html`, `ar.html`, `hi.html`, `bn.html`, `zh.html`) dans la même branche. Les autres langues suivent toujours l'espagnol.
- La citation « No hay genio sin un poco de locura » apparaît **volontairement deux fois** (bandeau jaune et section Visión). Ne la retire jamais.
- Le site contient **un seul et unique easter egg** (trois touches sur l'étoile du bandeau jaune). N'en ajoute pas d'autre, et ne le supprime pas.
- La phrase dorée de Ritukah, à la fin de son histoire, reste **en anglais dans toutes les langues** : c'est sa voix.
- Les échanges avec Ritukah, les messages de commit et le journal sont **en français**.
- **Liste d'attente** : le formulaire « Participer » enregistre l'e-mail, l'apport choisi, la langue et le consentement dans Supabase (table `lista_espera`, serveur dans l'Union européenne, en Irlande). La case de consentement est obligatoire. La page `privacidad.html` explique tout en neuf langues. Si on change ce qu'on garde, il faut aussi changer la page de confidentialité.
- Le site doit rester **beau, ambitieux et accessible**, au service des quatre piliers ci-dessus.

## Qui décide

- **Ritukah est le seul à décider.** Les IA proposent et Ritukah choisit ce qui est gardé.
- Une IA ne change jamais la direction du projet (le ton, les textes de fond, l'histoire personnelle, l'identité visuelle) sans l'accord explicite de Ritukah.

## Comment travailler

1. **Une seule IA à la fois.** Avant de commencer, récupérer la dernière version de `main`.
2. **Chaque IA travaille sur sa propre branche** et ne modifie jamais `main` directement :
   - Claude : `claude/<sujet>` (exemple : `claude/couleurs-arbre`)
   - ChatGPT : `chatgpt/<sujet>` (exemple : `chatgpt/menu-mobile`)
3. **Une branche = un sujet.** Pas de mélange de plusieurs améliorations dans la même branche.
4. Quand le travail est prêt, l'IA ouvre une **Pull Request** vers `main`. Ritukah la relit, puis l'accepte (« Merge ») ou la refuse.
5. **Messages de commit en français**, courts et clairs : ce qui a changé et pourquoi.

## Ce qui est interdit

- Réécrire ou supprimer l'historique : pas de `git push --force` ni de `git reset` sur `main`.
- Supprimer ou renommer `emblema-arbol.png` ou `index.html` sans accord.
- Ajouter des outils, des bibliothèques ou des services extérieurs (formulaires, statistiques, polices…) sans accord.
- Mettre des données personnelles, des mots de passe ou des clés dans le dépôt.
  - **Seule exception : la clé « publishable » de Supabase** (`sb_publishable_…`), dans `hasta-la-vista/app.js`. Elle est publique par nature : la table `lista_espera` permet seulement d'ajouter une inscription, jamais de lire, modifier ou effacer.
  - La clé **secret** (`sb_secret_…`), la clé **service_role** et le mot de passe de la base ne doivent **jamais** être demandés, écrits ou mis dans le dépôt.

## Annuler le travail d'une autre IA

C'est permis, à condition de le faire proprement :
- annuler avec `git revert` (l'annulation reste visible dans l'historique et peut elle-même être annulée) ;
- dire dans le message de commit et dans le journal **ce qui a été annulé, et pourquoi**.

## Qualité attendue

- **Beau** : respecter la palette, les polices et l'esprit du site. Rester cohérent avec l'emblème de l'arbre.
- **Accessible** : textes lisibles (taille et contraste suffisants), navigation au clavier, respect du réglage « réduire les animations », site utilisable sur mobile.
- **Simple** : tant que c'est possible, le site reste une page autonome qu'on ouvre directement dans un navigateur.
- Vérifier le résultat (ouvrir la page) avant de proposer la Pull Request.

## Le journal

À chaque intervention, ajouter une entrée **en haut** de `JOURNAL.md`, sur ce modèle :

```
## AAAA-MM-JJ — Nom de l'IA — branche
- Ce qui a changé
- Pourquoi
- Ce qui reste à faire ou à vérifier
```
