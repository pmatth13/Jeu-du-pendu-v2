// ============================================================
// animations.js — Effets visuels accessoires
// Indépendant du jeu : écoute des events dispatchés par script.js.
// Supprimer ce fichier ne casse rien.
// ============================================================

// ============================================================
// 1. Confettis sur victoire
// ============================================================
function lancerConfettis() {
  const couleurs = ["#ef4444", "#f59e0b", "#fbbf24", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const nbConfettis = 80;

  for (let i = 0; i < nbConfettis; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = couleurs[Math.floor(Math.random() * couleurs.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2.5 + "s";

    // Variables CSS lues par les keyframes pour varier la trajectoire
    confetti.style.setProperty("--derive", Math.random() * 300 - 150 + "px");
    confetti.style.setProperty("--rotation", Math.random() * 1080 + 360 + "deg");

    document.body.appendChild(confetti);
    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

// ============================================================
// 2. Tête détachée + sang qui coule sur défaite
// ============================================================
function lancerAnimationDefaite() {
  document.getElementById("tete").classList.add("tete-tombe");

  const svg = document.getElementById("pendu-svg");
  for (let i = 0; i < 10; i++) {
    // SVG nécessite createElementNS (namespace XML différent du HTML)
    const goutte = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    goutte.setAttribute("cx", 140 + (Math.random() * 8 - 4));
    goutte.setAttribute("cy", 100); // au niveau du cou
    goutte.setAttribute("r", 1.5 + Math.random() * 2);
    goutte.setAttribute("fill", "#dc2626");
    goutte.setAttribute("stroke", "none"); // sinon hérite du parent SVG
    goutte.setAttribute("class", "goutte-sang");
    goutte.style.animationDelay = 0.3 + i * 0.15 + "s"; // étalées dans le temps
    goutte.style.animationDuration = 1.2 + Math.random() * 0.6 + "s";
    svg.appendChild(goutte);
  }
}

// ============================================================
// 3. Nettoyage entre deux parties
// ============================================================
function nettoyerAnimations() {
  document.getElementById("tete").classList.remove("tete-tombe");
  document.querySelectorAll(".goutte-sang").forEach((g) => g.remove());
}

// ============================================================
// 4. Branchement aux events du jeu
// ============================================================
document.addEventListener("partie-victoire", lancerConfettis);
document.addEventListener("partie-defaite", lancerAnimationDefaite);
document.addEventListener("partie-demarre", nettoyerAnimations);
