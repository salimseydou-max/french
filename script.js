/* Application Web de Conseils
 * - 100% côté navigateur
 * - conseils en français uniquement (généraux)
 */

const ADVICE = [
  "Respirez profondément pendant dix secondes : cela suffit souvent à clarifier une décision.",
  "Faites une petite action maintenant plutôt que d’attendre le moment parfait.",
  "Si une tâche vous paraît lourde, découpez-la en étapes de 5 minutes.",
  "Notez une priorité du jour, puis protégez un créneau pour la réaliser.",
  "Demandez-vous : « Quelle est la prochaine chose la plus simple que je peux faire ? »",
  "Accordez-vous le droit d’apprendre en cours de route, sans tout maîtriser dès le départ.",
  "Quand vous doutez, revenez aux bases : sommeil, eau, repas, mouvement, lien social.",
  "Comparez-vous à vous-même d’hier, pas à quelqu’un d’autre.",
  "Choisissez une phrase encourageante et répétez-la quand la motivation baisse.",
  "Faites une pause courte, puis reprenez : la constance vaut mieux que l’intensité.",
  "Avant de répondre, relisez votre message avec bienveillance : pour vous et pour l’autre.",
  "Si quelque chose vous stresse, écrivez ce que vous contrôlez et ce que vous ne contrôlez pas.",
  "Dites non à une chose aujourd’hui pour dire oui à ce qui compte vraiment.",
  "Célébrez une petite victoire : elle compte autant que les grandes.",
  "Un pas imparfait est souvent plus utile qu’une intention parfaite.",
  "Quand vous vous sentez bloqué, changez d’environnement pendant deux minutes.",
  "Fixez une limite claire (temps, énergie) : cela rend les objectifs plus réalistes.",
  "Prenez soin de votre futur vous : préparez une petite chose pour demain.",
  "Rappelez-vous : vous pouvez être sérieux sans être dur avec vous-même.",
  "Cherchez la progression, pas la perfection.",
];

const STORAGE_KEY = "conseils-feedback-v1";

function getEl(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Élément introuvable: #${id}`);
  return el;
}

function pickNewIndex(currentIndex) {
  if (ADVICE.length === 0) return -1;
  if (ADVICE.length === 1) return 0;

  let next = currentIndex;
  while (next === currentIndex) {
    next = Math.floor(Math.random() * ADVICE.length);
  }
  return next;
}

function readStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { helpful: 0, notHelpful: 0 };
    const parsed = JSON.parse(raw);
    return {
      helpful: Number(parsed?.helpful ?? 0),
      notHelpful: Number(parsed?.notHelpful ?? 0),
    };
  } catch {
    return { helpful: 0, notHelpful: 0 };
  }
}

function writeStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore (mode privé / stockage désactivé)
  }
}

function formatStats(stats) {
  const total = stats.helpful + stats.notHelpful;
  if (total === 0) return "";
  return `Vos retours (sur cet appareil) : ${stats.helpful} utile(s), ${stats.notHelpful} pas utile(s).`;
}

function setStatus(message) {
  statusMessage.textContent = message;
  if (!message) return;

  // Efface le message après un court délai
  window.clearTimeout(setStatus._t);
  setStatus._t = window.setTimeout(() => {
    statusMessage.textContent = "";
  }, 2400);
}

function swapAdviceText(nextText) {
  // Transition simple: fade out -> swap -> fade in
  adviceText.classList.add("isFadingOut");

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const delay = reduceMotion ? 0 : 220;

  window.setTimeout(() => {
    adviceText.textContent = nextText;
    adviceText.classList.remove("isFadingOut");
  }, delay);
}

const adviceText = getEl("adviceText");
const newAdviceBtn = getEl("newAdviceBtn");
const helpfulBtn = getEl("helpfulBtn");
const notHelpfulBtn = getEl("notHelpfulBtn");
const statusMessage = getEl("statusMessage");
const statsEl = getEl("stats");

let currentIndex = -1;
let stats = readStats();

function renderStats() {
  statsEl.textContent = formatStats(stats);
}

function showNewAdvice() {
  const nextIndex = pickNewIndex(currentIndex);
  if (nextIndex < 0) return;
  currentIndex = nextIndex;
  swapAdviceText(ADVICE[currentIndex]);
  setStatus("");
}

function handleFeedback(type) {
  if (type !== "helpful" && type !== "notHelpful") return;

  stats = {
    helpful: stats.helpful + (type === "helpful" ? 1 : 0),
    notHelpful: stats.notHelpful + (type === "notHelpful" ? 1 : 0),
  };
  writeStats(stats);
  renderStats();

  setStatus("Merci pour votre retour !");

  // Petit anti-double-clic (sans bloquer l’usage)
  helpfulBtn.disabled = true;
  notHelpfulBtn.disabled = true;
  window.setTimeout(() => {
    helpfulBtn.disabled = false;
    notHelpfulBtn.disabled = false;
  }, 600);
}

newAdviceBtn.addEventListener("click", showNewAdvice);
helpfulBtn.addEventListener("click", () => handleFeedback("helpful"));
notHelpfulBtn.addEventListener("click", () => handleFeedback("notHelpful"));

// Affiche un conseil dès le chargement
renderStats();
showNewAdvice();

