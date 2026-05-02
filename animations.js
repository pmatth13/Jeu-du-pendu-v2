// ============================================================
// animations.js — Effets visuels accessoires
//
// Ce fichier est totalement INDÉPENDANT du jeu.
// Il écoute des événements personnalisés ("partie-victoire" etc.)
// que script.js dispatche. Tu peux le supprimer sans rien casser.
// ============================================================

// ============================================================
// 1. Confettis sur victoire
// ============================================================

function lancerConfettis() {
  // Palette de 7 couleurs vives
  const couleurs = [
    "#ef4444", // rouge
    "#f59e0b", // orange
    "#fbbf24", // jaune
    "#10b981", // vert
    "#3b82f6", // bleu
    "#8b5cf6", // violet
    "#ec4899", // rose
  ];

  const nbConfettis = 80;

  for (let i = 0; i < nbConfettis; i++) {
    // a. On crée un petit <div> qui sera notre confetti
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    // b. Position horizontale aléatoire (0 à 100% de la largeur viewport)
    confetti.style.left = Math.random() * 100 + "vw";

    // c. Couleur aléatoire dans la palette
    confetti.style.backgroundColor =
      couleurs[Math.floor(Math.random() * couleurs.length)];

    // d. Délai aléatoire (0-0.5s) → effet de "salve" plutôt que tous en même temps
    confetti.style.animationDelay = Math.random() * 0.5 + "s";

    // e. Durée aléatoire (2.5 à 4.5s) → tous tombent à des vitesses différentes
    confetti.style.animationDuration = Math.random() * 2 + 2.5 + "s";

    // f. Variables CSS personnalisées : dérive horizontale + rotation finale
    //    Le CSS lit --derive et --rotation pour varier la trajectoire de chacun.
    confetti.style.setProperty(
      "--derive",
      Math.random() * 300 - 150 + "px" // entre -150px (gauche) et +150px (droite)
    );
    confetti.style.setProperty(
      "--rotation",
      Math.random() * 1080 + 360 + "deg" // entre 360° et 1440° (1 à 4 tours)
    );

    // g. On l'ajoute au body (position:fixed, donc indépendant du layout)
    document.body.appendChild(confetti);

    // h. Cleanup : dès que l'animation finit, on enlève l'élément du DOM
    //    pour ne pas accumuler des centaines de divs morts.
    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

// On écoute l'événement personnalisé "partie-victoire" dispatché par script.js
// → animations.js réagit sans avoir à modifier la logique du jeu.
document.addEventListener("partie-victoire", lancerConfettis);

// ============================================================
// 2. Tête qui se détache + sang qui coule sur défaite
// ============================================================

function lancerAnimationDefaite() {
  // a. On ajoute la classe qui déclenche l'animation CSS sur la tête
  document.getElementById("tete").classList.add("tete-tombe");

  // b. On crée plusieurs gouttes de sang depuis le cou (140, 100)
  const svg = document.getElementById("pendu-svg");
  const nbGouttes = 10;

  for (let i = 0; i < nbGouttes; i++) {
    // ⚠ Pour créer un élément SVG en JS il faut createElementNS
    //    (les éléments SVG ont leur propre "namespace" XML).
    const goutte = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    // Position de départ : autour du cou, légèrement décalée au hasard
    goutte.setAttribute("cx", 140 + (Math.random() * 8 - 4));
    goutte.setAttribute("cy", 100);
    goutte.setAttribute("r", 1.5 + Math.random() * 2);

    // Couleur rouge sang, pas de bordure (sinon hérite du parent SVG)
    goutte.setAttribute("fill", "#dc2626");
    goutte.setAttribute("stroke", "none");
    goutte.setAttribute("class", "goutte-sang");

    // Délais et durées étalés → effet d'écoulement irrégulier
    goutte.style.animationDelay = 0.3 + i * 0.15 + "s";
    goutte.style.animationDuration = 1.2 + Math.random() * 0.6 + "s";

    svg.appendChild(goutte);
  }
}

// ============================================================
// Nettoyage au démarrage d'une nouvelle partie
// ============================================================

function nettoyerAnimations() {
  // On retire la classe qui figeait la tête en bas
  document.getElementById("tete").classList.remove("tete-tombe");
  // On supprime toutes les gouttes restantes
  document.querySelectorAll(".goutte-sang").forEach((g) => g.remove());
}

document.addEventListener("partie-defaite", lancerAnimationDefaite);
document.addEventListener("partie-demarre", nettoyerAnimations);
