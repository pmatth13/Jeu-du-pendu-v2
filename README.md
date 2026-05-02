# Jeu du Pendu

Exercice final de révisions JavaScript — un jeu du pendu jouable en ligne, écrit en HTML / Tailwind CSS v4 / JavaScript vanilla, sans framework.

## Stack

- **HTML** — structure (2 vues : accueil / jeu)
- **Tailwind CSS v4** — design (CLI, build local vers `src/output.css`)
- **JavaScript vanilla** — logique du jeu et animations
- **SVG** — dessin du pendu

## Structure du projet

```
Jeu du pendu/
├── index.html          ← structure HTML + 2 vues + SVG du pendu
├── script.js           ← logique du jeu (mot secret, clavier, victoire/défaite)
├── animations.js       ← animations accessoires (confettis, tête qui tombe)
├── src/
│   ├── input.css       ← Tailwind + classes custom (.lettre, .confetti…)
│   └── output.css      ← CSS final généré (ne pas éditer)
└── README.md
```

## Lancer le projet

1. Installer Tailwind CLI (une seule fois) :
   ```bash
   npm install tailwindcss @tailwindcss/cli
   ```
2. Compiler le CSS (mode watch pour recompiler à chaque modif) :
   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```
3. Ouvrir `index.html` dans un navigateur.

## Fonctionnalités

### Gameplay
- Tirage aléatoire d'un mot dans une liste de 50 mots français
- Affichage du mot en `_ _ _ _` au départ
- Saisie au **clavier physique** (touches A–Z) **ou** clic sur le clavier AZERTY virtuel
- Possibilité de **proposer le mot complet** dans un champ dédié (Entrée pour valider)
- 6 chances → chaque erreur révèle une partie du pendu (tête, corps, 2 bras, 2 jambes)
- Score qui s'incrémente à chaque victoire et persiste tant que la page n'est pas rechargée
- Bouton **Rejouer** sans recharger la page

### Animations (fichier séparé, totalement optionnel)
- **Victoire** → 80 confettis colorés tombent du haut de l'écran
- **Défaite** → la tête se détache, tombe en tournant et 10 gouttes de sang coulent du cou

## Architecture

### Vues
Deux sections (`#vue-accueil` / `#vue-jeu`) basculent via la classe `hidden`.

### Génération dynamique
Le clavier (26 boutons) et l'affichage du mot (n spans) sont **créés en JS** à partir de tableaux/strings → un seul code pour tous les éléments.

### Délégation d'événements
Un seul listener `click` sur `#zone-clavier` capte tous les clics (au lieu de 26 listeners). Le test `bouton.classList.contains("lettre")` filtre les clics utiles.

### Découplage jeu ↔ animations
`script.js` ne connaît pas `animations.js`. Sur les moments-clés, il **dispatche des événements personnalisés** que `animations.js` écoute :

| Event dispatché par script.js | Effet dans animations.js |
| --- | --- |
| `partie-victoire` | confettis |
| `partie-defaite` | tête qui tombe + sang |
| `partie-demarre` | nettoyage des effets précédents |

→ Supprimer `animations.js` ne casse rien.
