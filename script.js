// ============================================================
// Bascule entre la vue Accueil et la vue Jeu
// ============================================================

// 1. On récupère les éléments du DOM dont on a besoin
const vueAccueil = document.getElementById("vue-accueil");
const vueJeu = document.getElementById("vue-jeu");
const boutonNouvellePartie = document.getElementById("new-game-btn");
const boutonRetour = document.getElementById("retour-btn");

// 2. Quand on clique sur "Commencer une nouvelle partie"
//    → on cache l'accueil, on affiche la vue jeu, et on initialise une partie
boutonNouvellePartie.addEventListener("click", () => {
  vueAccueil.classList.add("hidden");
  vueJeu.classList.remove("hidden");
  demarrerPartie();
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

// ============================================================
// Données et état du jeu
// ============================================================

// 1. Liste de mots (sans accents, pour coller au clavier A-Z)
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

// 2. Les 6 parties du corps, dans l'ordre où on veut les afficher.
//    L'index = numéro de l'erreur (0 → tête, 5 → jambe droite).
const PARTIES_PENDU = [
  "tete",
  "corps",
  "bras-gauche",
  "bras-droit",
  "jambe-gauche",
  "jambe-droite",
];

// 3. Références aux éléments du DOM utilisés en jeu
const zoneMot = document.getElementById("zone-mot");
const elementScore = document.getElementById("score");
const messageFin = document.getElementById("message-fin");
const messageTexte = document.getElementById("message-texte");
const boutonRejouer = document.getElementById("rejouer-btn");
const inputProposition = document.getElementById("proposition-mot");
const boutonProposer = document.getElementById("bouton-proposer");

// 4. Variables qui changent entre les parties
//    `let` au lieu de `const` car la valeur évolue.
let motSecret = "";
let nbErreurs = 0;
let score = 0;

// ============================================================
// Démarrer une nouvelle partie (réinitialise tout)
// ============================================================
function demarrerPartie() {
  // a. Tirer un nouveau mot au hasard
  motSecret = MOTS[Math.floor(Math.random() * MOTS.length)];

  // b. Reset du compteur d'erreurs
  nbErreurs = 0;

  // c. Vider l'ancienne zone du mot et reconstruire les <span>
  zoneMot.innerHTML = "";
  [...motSecret].forEach((lettre) => {
    const span = document.createElement("span");
    span.textContent = "_";
    span.dataset.lettre = lettre;
    zoneMot.appendChild(span);
  });

  // d. Re-cacher toutes les parties du pendu
  PARTIES_PENDU.forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });

  // e. Réactiver tous les boutons du clavier
  zoneClavier.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });

  // f. Réactiver et vider le champ de proposition de mot
  inputProposition.disabled = false;
  inputProposition.value = "";
  boutonProposer.disabled = false;

  // g. Cacher le message de fin (s'il était affiché)
  messageFin.classList.add("hidden");

  // h. On annonce le démarrage (animations.js nettoie ses effets)
  document.dispatchEvent(new CustomEvent("partie-demarre"));
}

// ============================================================
// Clic sur une lettre du clavier → on révèle (ou pas)
// ============================================================

// 1. Délégation d'événement : UN listener sur le conteneur du clavier
//    plutôt que 26 listeners (un par bouton). Plus propre, plus rapide.
zoneClavier.addEventListener("click", (event) => {
  // event.target = l'élément précis qui a été cliqué
  const bouton = event.target;

  // 2. Si on clique entre deux boutons (sur le div ligne par ex.),
  //    event.target ne sera pas un bouton de lettre → on ignore.
  if (!bouton.classList.contains("lettre")) return;

  // 3. On récupère la lettre via dataset (rappel : data-lettre="A")
  const lettreChoisie = bouton.dataset.lettre;

  // 4. On désactive le bouton : impossible de le re-cliquer.
  //    Le CSS .lettre:disabled gère déjà l'apparence (opacity 40%).
  bouton.disabled = true;

  // 5. On parcourt tous les <span> du mot.
  //    `lettreTrouvee` passe à true dès qu'au moins une lettre matche.
  const spans = zoneMot.querySelectorAll("span");
  let lettreTrouvee = false;

  spans.forEach((span) => {
    if (span.dataset.lettre === lettreChoisie) {
      span.textContent = lettreChoisie;
      lettreTrouvee = true;
    }
  });

  // 6. Si la lettre n'est PAS dans le mot → c'est une erreur.
  if (!lettreTrouvee) {
    // a. On récupère l'id de la partie à révéler grâce à l'index nbErreurs
    const idPartie = PARTIES_PENDU[nbErreurs];

    // b. On enlève la classe "hidden" pour la rendre visible
    document.getElementById(idPartie).classList.remove("hidden");

    // c. On incrémente pour la prochaine erreur
    nbErreurs++;

    // d. Défaite : le pendu est complet (6 erreurs).
    if (nbErreurs === PARTIES_PENDU.length) {
      finPartie(false);
      return;
    }
  } else {
    // 7. Victoire : tous les <span> du mot ont été révélés (plus aucun "_").
    //    .every() retourne true seulement si la condition est vraie pour TOUS.
    const tousTrouves = [...spans].every(
      (span) => span.textContent !== "_"
    );
    if (tousTrouves) {
      finPartie(true);
    }
  }
});

// ============================================================
// Fin de partie (victoire ou défaite)
// ============================================================
function finPartie(victoire) {
  // 1. Désactiver tout le clavier (on ne peut plus cliquer)
  zoneClavier.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });

  // Désactiver aussi le champ de proposition de mot
  inputProposition.disabled = true;
  boutonProposer.disabled = true;

  if (victoire) {
    // 2a. On incrémente le score et on met à jour l'affichage
    score++;
    elementScore.textContent = score;

    messageTexte.textContent = `Bravo ! Vous avez trouvé "${motSecret}".`;
    // Couleur verte (succès) : on remet d'abord les classes de base
    messageFin.className =
      "font-display mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-900 shadow-sm";

    // On annonce la victoire au reste du monde (animations.js l'attrape)
    document.dispatchEvent(new CustomEvent("partie-victoire"));
  } else {
    // 2b. Défaite : on révèle le mot caché en remplaçant les "_" par les lettres
    zoneMot.querySelectorAll("span").forEach((span) => {
      span.textContent = span.dataset.lettre;
    });

    messageTexte.textContent = `Perdu ! Le mot était "${motSecret}".`;
    // Couleur rouge (échec)
    messageFin.className =
      "font-display mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-900 shadow-sm";

    // On annonce la défaite (animations.js fait tomber la tête)
    document.dispatchEvent(new CustomEvent("partie-defaite"));
  }
}

// ============================================================
// Bouton "Rejouer" → on relance une partie sur la même vue
// ============================================================
boutonRejouer.addEventListener("click", demarrerPartie);

// ============================================================
// Saisie au clavier physique
// ============================================================

// On écoute les touches pressées sur tout le document.
// Astuce : au lieu de réécrire la logique, on RÉUTILISE le bouton
// déjà en place en simulant un clic dessus avec bouton.click().
document.addEventListener("keydown", (event) => {
  // 1. Si la vue jeu n'est pas affichée, on ignore (on est sur l'accueil)
  if (vueJeu.classList.contains("hidden")) return;

  // 2. Si le joueur tape dans le champ de proposition de mot,
  //    on le laisse écrire normalement (sinon chaque lettre cliquerait un bouton).
  if (event.target === inputProposition) return;

  // 3. On ignore les raccourcis (Ctrl+A, Cmd+R, Alt+Tab, etc.)
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  // 4. event.key = caractère tapé. On le passe en majuscule pour matcher data-lettre
  const lettre = event.key.toUpperCase();

  // 5. On ne garde que A-Z (regex : un seul caractère entre A et Z)
  if (!/^[A-Z]$/.test(lettre)) return;

  // 6. On retrouve le bouton correspondant dans le clavier virtuel
  const bouton = zoneClavier.querySelector(`[data-lettre="${lettre}"]`);

  // 7. Si le bouton existe et n'est pas déjà désactivé → on simule le clic.
  //    Le listener click() existant fera tout le boulot (révélation, erreur, etc.)
  if (bouton && !bouton.disabled) {
    bouton.click();
  }
});

// ============================================================
// Proposer le mot complet
// ============================================================

function proposerMot() {
  // 1. On récupère et nettoie la valeur du champ
  const proposition = inputProposition.value.toUpperCase().trim();

  // 2. Champ vide → on ignore
  if (proposition === "") return;

  // 3. On vide le champ pour la prochaine tentative
  inputProposition.value = "";

  if (proposition === motSecret) {
    // 4a. Bonne réponse → on révèle toutes les lettres puis victoire
    zoneMot.querySelectorAll("span").forEach((span) => {
      span.textContent = span.dataset.lettre;
    });
    finPartie(true);
  } else {
    // 4b. Mauvaise réponse → 1 erreur (comme une mauvaise lettre)
    document.getElementById(PARTIES_PENDU[nbErreurs]).classList.remove("hidden");
    nbErreurs++;

    // Défaite si pendu complet
    if (nbErreurs === PARTIES_PENDU.length) {
      finPartie(false);
    }
  }
}

// Clic sur le bouton "Proposer"
boutonProposer.addEventListener("click", proposerMot);

// Touche Entrée dans le champ → équivalent au clic
inputProposition.addEventListener("keydown", (event) => {
  if (event.key === "Enter") proposerMot();
});
