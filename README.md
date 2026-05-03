# Jeu du Pendu

Jeu du pendu jouable dans le navigateur — HTML / Tailwind CSS v4 / JavaScript vanilla, sans framework.

## Stack

| Technologie | Rôle |
|---|---|
| HTML5 | Structure et SVG du pendu |
| Tailwind CSS v4 (CLI) | Mise en page et design |
| JavaScript ES6+ | Logique du jeu et animations |

## Structure

```
├── index.html      ← deux vues (accueil / jeu) + SVG
├── script.js       ← logique du jeu
├── animations.js   ← effets visuels (confettis, sang)
└── src/
    ├── input.css   ← source CSS (Tailwind + classes custom)
    └── output.css  ← CSS compilé (ne pas modifier)
```

## Lancer le projet

```bash
npm install tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

Puis ouvrir `index.html` dans un navigateur.
