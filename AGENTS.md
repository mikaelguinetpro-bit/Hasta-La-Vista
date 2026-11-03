# Règles communes — Hasta La Vista

Ce fichier s'adresse à toutes les IA qui travaillent sur ce dépôt (Claude, ChatGPT / Codex, et toute autre).
**À lire en entier avant chaque intervention.**

## Le projet

- **Hasta La Vista** est une plateforme qui veut rendre le monde plus beau grâce aux idées, au travail partagé, à l'intelligence humaine et aux agents IA.
- Le site se trouve dans `hasta-la-vista/` :
  - `index.html` (espagnol, langue principale) et `en.html` (anglais) : les deux versions de la page, avec la même structure ;
  - `estilos.css` : le style commun aux deux versions ;
  - `app.js` : le comportement commun (menu, fenêtre, animations), avec en tête les quelques textes du script dans les deux langues ;
  - `fuentes/` : les polices, hébergées sur le site (licence SIL OFL, ne pas supprimer les fichiers `OFL-*.txt`) ;
  - `emblema-arbol.png` (l'arbre, emblème du projet) et `icono.png` (l'icône d'onglet).
- **Toute modification du texte ou de la structure d'une page doit être faite dans les deux langues** (`index.html` et `en.html`) dans la même branche. L'anglais suit toujours l'espagnol.
- **Le site n'a pas de version française, par décision de Ritukah. N'en ajoute jamais**, ni page, ni traduction, ni bouton de langue.
- Les échanges avec Ritukah, les messages de commit et le journal sont **en français**.
- Trois valeurs guident chaque décision : **beau, ambitieux, accessible**.

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
