// ============================================================
// Bascule entre la vue Accueil et la vue Jeu
// ============================================================

// 1. On récupère les éléments du DOM dont on a besoin
const vueAccueil = document.getElementById("vue-accueil");
const vueJeu = document.getElementById("vue-jeu");
const boutonNouvellePartie = document.getElementById("new-game-btn");
const boutonRetour = document.getElementById("retour-btn");

// 2. Quand on clique sur "Commencer une nouvelle partie"
//    → on cache l'accueil et on affiche la vue jeu
boutonNouvellePartie.addEventListener("click", () => {
  vueAccueil.classList.add("hidden");
  vueJeu.classList.remove("hidden");
});

// 3. Quand on clique sur "← Retour à l'accueil"
//    → on fait l'inverse
boutonRetour.addEventListener("click", () => {
  vueJeu.classList.add("hidden");
  vueAccueil.classList.remove("hidden");
});

// ============================================================
// Génération dynamique du clavier AZERTY
// ============================================================

// 1. Le clavier AZERTY rangé en 3 lignes
const AZERTY = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["W", "X", "C", "V", "B", "N"],
];

// 2. On récupère le conteneur où on va injecter les boutons
const zoneClavier = document.getElementById("zone-clavier");

// 3. Pour chaque ligne du clavier...
AZERTY.forEach((ligne) => {
  // a. On crée un <div> qui contiendra les boutons de cette ligne
  const divLigne = document.createElement("div");
  divLigne.className = "flex justify-center gap-2";

  // b. Pour chaque lettre de la ligne...
  ligne.forEach((lettre) => {
    // On crée un <button>
    const bouton = document.createElement("button");
    bouton.className = "lettre"; // ← LA classe partagée
    bouton.textContent = lettre; // texte affiché : "A", "Z", etc.
    bouton.dataset.lettre = lettre; // attribut data-lettre="A" pour la logique JS

    // On ajoute le bouton à la ligne
    divLigne.appendChild(bouton);
  });

  // c. On ajoute la ligne complète au clavier
  zoneClavier.appendChild(divLigne);
});
