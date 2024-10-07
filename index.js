// Variable pour stocker les données des photographes après leur premier chargement
let cachedPhotographers = [];

// Récupération des données provenant du fichier JSON
async function loadData(filterTag = "") {
  try {
    // Si les données ne sont pas encore chargées, elles sont chargées une seule fois ici.
    if (cachedPhotographers.length === 0) {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      cachedPhotographers = data.photographers; // Stocker seulement les photographes
    }

    // Si un filtre est appliqué, les photographes sont triés par tag
    const filteredPhotographers = filterTag
      ? cachedPhotographers.filter(photographer => photographer.tags.includes(filterTag))
      : cachedPhotographers;

    // J'affiche les photographes filtrés (ou tous si pas de filtre)
    displayPhotographers(filteredPhotographers);
  } catch (error) {
    console.error(error);
  }
}

// les Elements du header
// Ajout du header au DOM
let headerBloc = document.querySelector("header");
let headerElement = `
  <div>
    <img class="header__logo" src="assets/logo/logo.PNG" alt="logo FishEye">
    <button id="filterArt">#Art</button>
    <button id="filterPortrait">#Portrait</button>
    <button id="filterArchitecture">#Architecture</button>
    <button id="filterVoyage">#Voyage</button>
    <button id="filterSport">#Sport</button>
    <button id="filterAnimaux">#Animaux</button>
    <button id="filterEvenements">#Événements</button>
    <button id="filterMode">#Mode</button>
    <h1 class="header__title">Nos photographes</h1>
  </div>
`;
headerBloc.innerHTML = headerElement;


// Création du profile d'un photographe
function createPhotographerCard(photographer) {
  const photographersElement = document.createElement("article");

  // Création des balises
  const imageElement = document.createElement("img");
  const nomElement = document.createElement("h2");
  const villeElement = document.createElement("h3");
  const taglineElement = document.createElement("p");
  const prixElement = document.createElement("span");
  const tagsContainer = createTagsContainer(photographer.tags);

  // Remplissage des éléments avec les données du photographe
  imageElement.src = photographer.portrait;
  nomElement.innerText = photographer.name;
  villeElement.innerText = photographer.city;
  taglineElement.innerText = photographer.tagline;
  prixElement.innerText = `${photographer.price} €/jour`;

  // Ajout des éléments à la carte du photographe
  photographersElement.appendChild(imageElement);
  photographersElement.appendChild(nomElement);
  photographersElement.appendChild(villeElement);
  photographersElement.appendChild(taglineElement);
  photographersElement.appendChild(prixElement);
  photographersElement.appendChild(tagsContainer);

  // Lien de redirection vers la page d'accueil
  imageElement.addEventListener("click", () => {
    window.location.href = `photographer.html?id=${photographer.id}`;
  });

  return photographersElement; // Retourne la carte du photographe
}

// Création du conteneur de tags
function createTagsContainer(tags) {
  const tagsContainer = document.createElement("div");

  // Ajout des tags dans des balises span
  tags.forEach(tag => {
    const tagElement = document.createElement("span");
    tagElement.innerText = "#" + tag;

    // Ajouter un événement de filtrage lorsqu'on clique sur le tag
    tagElement.addEventListener("click", () => filterPhotographers(tag));
    tagsContainer.appendChild(tagElement);
  });

  return tagsContainer;
}

// Affichage des photographes
function displayPhotographers(photographers) {
  const sectionPhotographers = document.querySelector("body main section");
  // Vider la section avant d'ajouter les photographes
  sectionPhotographers.innerHTML = '';

  photographers.forEach(photographer => {
    // Créer la carte pour chaque photographe
    const photographerCard = createPhotographerCard(photographer);
    sectionPhotographers.appendChild(photographerCard);
  });
}

// Filtrer les photographes par tags
function filterPhotographers(tag) {
  // Recharger les données des photographes et filtrer par tag
  loadData(tag);
}

// Appel de la fonction pour charger les photographes
loadData();

// La sélection des boutons de filtrage
const filterArtBtn = document.getElementById("filterArt");
const filterPortraitBtn = document.getElementById("filterPortrait");
const filterArchitectureBtn = document.getElementById("filterArchitecture");
const filterVoyageBtn = document.getElementById("filterVoyage");
const filterSportBtn = document.getElementById("filterSport");
const filterAnimauxBtn = document.getElementById("filterAnimaux");
const filterEvenementsBtn = document.getElementById("filterEvenements");
const filterModeBtn = document.getElementById("filterMode");

// Les événements pour écouter chaque bouton de filtrage
filterArtBtn.addEventListener("click", () => filterPhotographers('art'));
filterPortraitBtn.addEventListener("click", () => filterPhotographers('portrait'));
filterArchitectureBtn.addEventListener("click", () => filterPhotographers('architecture'));
filterVoyageBtn.addEventListener("click", () => filterPhotographers('voyage'));
filterSportBtn.addEventListener("click", () => filterPhotographers('sport'));
filterAnimauxBtn.addEventListener("click", () => filterPhotographers('animaux'));
filterEvenementsBtn.addEventListener("click", () => filterPhotographers('événements'));
filterModeBtn.addEventListener("click", () => filterPhotographers('mode'));








