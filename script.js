// ============================================================
// 1. DONNÉES (constantes)
// ============================================================

// Mots sans accents pour coller au clavier A-Z
const MOTS = [
  "ORDINATEUR", "JAVASCRIPT", "PROGRAMME", "CLAVIER", "FONCTION",
  "VARIABLE", "BOUTON", "NAVIGATEUR", "PENDU", "ROCKET",
  "SOURIS", "INTERNET", "MUSIQUE", "VOITURE", "MAISON",
  "JARDIN", "MONTAGNE", "DRAGON", "MAGIE", "SOLEIL",
  "LUNE", "GALAXIE", "AVENTURE", "PIRATE", "COURAGE",
  "BONHEUR", "NATURE", "FORTUNE", "HORIZON", "CHATEAU",
  "PRINCESSE", "VICTOIRE", "AMOUR", "GUITARE", "LIVRE",
  "CINEMA", "PARIS", "FRANCE", "CHOCOLAT", "FROMAGE",
  "BIBLIOTHEQUE", "MONTRE", "VOYAGE", "CHANSON", "DANSE",
  "PEINTURE", "SCULPTURE", "POESIE", "CULTURE", "HISTOIRE",
];

// Disposition AZERTY en 3 lignes
const AZERTY = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["W", "X", "C", "V", "B", "N"],
];

// Ordre de révélation des parties du pendu (l'index = numéro d'erreur)
const PARTIES_PENDU = [
  "tete", "corps", "bras-gauche", "bras-droit", "jambe-gauche", "jambe-droite",
];

// ============================================================
// 2. RÉFÉRENCES DOM
// ============================================================

const vueAccueil = document.getElementById("vue-accueil");
const vueJeu = document.getElementById("vue-jeu");
const boutonNouvellePartie = document.getElementById("new-game-btn");
const boutonRetour = document.getElementById("retour-btn");
const boutonRejouer = document.getElementById("rejouer-btn");
const boutonProposer = document.getElementById("bouton-proposer");
const inputProposition = document.getElementById("proposition-mot");
const zoneClavier = document.getElementById("zone-clavier");
const zoneMot = document.getElementById("zone-mot");
const elementScore = document.getElementById("score");
const messageFin = document.getElementById("message-fin");
const messageTexte = document.getElementById("message-texte");

// ============================================================
// 3. ÉTAT DU JEU (évolue entre les parties)
// ============================================================

let motSecret = "";
let nbErreurs = 0;
let score = 0;

// ============================================================
// 4. GÉNÉRATION DU CLAVIER (une seule fois au chargement)
// ============================================================

AZERTY.forEach((ligne) => {
  const divLigne = document.createElement("div");
  divLigne.className = "flex justify-center gap-2";

  ligne.forEach((lettre) => {
    const bouton = document.createElement("button");
    bouton.className = "lettre";
    bouton.textContent = lettre;
    bouton.dataset.lettre = lettre; // identifie le bouton lors du clic / keydown
    divLigne.appendChild(bouton);
  });

  zoneClavier.appendChild(divLigne);
});

// ============================================================
// 5. FONCTIONS DU JEU
// ============================================================

// Démarre une nouvelle partie (réinitialise tout l'état).
function demarrerPartie() {
  motSecret = MOTS[Math.floor(Math.random() * MOTS.length)];
  nbErreurs = 0;

  // Reconstruire l'affichage du mot (un <span> par lettre, "_" au départ)
  zoneMot.innerHTML = "";
  [...motSecret].forEach((lettre) => {
    const span = document.createElement("span");
    span.textContent = "_";
    span.dataset.lettre = lettre; // vraie lettre cachée jusqu'à révélation
    zoneMot.appendChild(span);
  });

  // Re-cacher les parties du pendu
  PARTIES_PENDU.forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });

  // Réactiver toutes les saisies
  zoneClavier.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  inputProposition.disabled = false;
  inputProposition.value = "";
  boutonProposer.disabled = false;

  messageFin.classList.add("hidden");

  // animations.js nettoie ses effets visuels résiduels
  document.dispatchEvent(new CustomEvent("partie-demarre"));
}

// Tente une lettre : révèle les correspondances ou fait perdre une vie.
function tenterLettre(bouton) {
  const lettreChoisie = bouton.dataset.lettre;
  bouton.disabled = true;

  const spans = zoneMot.querySelectorAll("span");
  let lettreTrouvee = false;
  spans.forEach((span) => {
    if (span.dataset.lettre === lettreChoisie) {
      span.textContent = lettreChoisie;
      lettreTrouvee = true;
    }
  });

  if (!lettreTrouvee) {
    perdreUneVie();
  } else if ([...spans].every((s) => s.textContent !== "_")) {
    // Plus aucun "_" → toutes les lettres trouvées
    finPartie(true);
  }
}

// Tente le mot complet : victoire si correct, sinon perd une vie.
function proposerMot() {
  const proposition = inputProposition.value.toUpperCase().trim();
  if (proposition === "") return;
  inputProposition.value = "";

  if (proposition === motSecret) {
    zoneMot.querySelectorAll("span").forEach((span) => {
      span.textContent = span.dataset.lettre;
    });
    finPartie(true);
  } else {
    perdreUneVie();
  }
}

// Révèle une partie du pendu et déclenche la défaite si pendu complet.
function perdreUneVie() {
  document.getElementById(PARTIES_PENDU[nbErreurs]).classList.remove("hidden");
  nbErreurs++;
  if (nbErreurs === PARTIES_PENDU.length) finPartie(false);
}

// Termine la partie : bloque les saisies, affiche le message, dispatche l'event.
function finPartie(victoire) {
  zoneClavier.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  inputProposition.disabled = true;
  boutonProposer.disabled = true;

  if (victoire) {
    score++;
    elementScore.textContent = score;
    messageTexte.textContent = `Bravo ! Vous avez trouvé "${motSecret}".`;
    messageFin.className =
      "font-display mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-900 shadow-sm";
    document.dispatchEvent(new CustomEvent("partie-victoire"));
  } else {
    // Révéler le mot caché pour que le joueur le voie
    zoneMot.querySelectorAll("span").forEach((span) => {
      span.textContent = span.dataset.lettre;
    });
    messageTexte.textContent = `Perdu ! Le mot était "${motSecret}".`;
    messageFin.className =
      "font-display mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-900 shadow-sm";
    document.dispatchEvent(new CustomEvent("partie-defaite"));
  }
}

// ============================================================
// 6. ÉVÉNEMENTS
// ============================================================

// --- Bascule entre les vues ---
boutonNouvellePartie.addEventListener("click", () => {
  vueAccueil.classList.add("hidden");
  vueJeu.classList.remove("hidden");
  demarrerPartie();
});

boutonRetour.addEventListener("click", () => {
  vueJeu.classList.add("hidden");
  vueAccueil.classList.remove("hidden");
});

// --- Clic sur une lettre du clavier virtuel (délégation : 1 listener pour 26 boutons) ---
zoneClavier.addEventListener("click", (event) => {
  const bouton = event.target;
  if (!bouton.classList.contains("lettre")) return;
  tenterLettre(bouton);
});

// --- Saisie au clavier physique (réutilise tenterLettre) ---
document.addEventListener("keydown", (event) => {
  if (vueJeu.classList.contains("hidden")) return;        // pas en jeu
  if (event.target === inputProposition) return;          // saisie dans le champ "Proposer"
  if (event.ctrlKey || event.altKey || event.metaKey) return; // raccourci système
  const lettre = event.key.toUpperCase();
  if (!/^[A-Z]$/.test(lettre)) return;                    // ignore tout sauf A-Z

  const bouton = zoneClavier.querySelector(`[data-lettre="${lettre}"]`);
  if (bouton && !bouton.disabled) tenterLettre(bouton);
});

// --- Proposer le mot complet (clic OU touche Entrée) ---
boutonProposer.addEventListener("click", proposerMot);
inputProposition.addEventListener("keydown", (event) => {
  if (event.key === "Enter") proposerMot();
});

// --- Rejouer ---
boutonRejouer.addEventListener("click", demarrerPartie);
