// Variable pour stocker les données des photographes après leur premier chargement
let cachedPhotographers = [];
let selectedTags = [];

// Récupération des données provenant du fichier JSON
async function loadData() {
  try {
    // Si les données ne sont pas encore chargées, elles sont chargées une seule fois ici.
    if (cachedPhotographers.length === 0) {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      cachedPhotographers = data.photographers; 
    }

    // J'affiche tous les photographes
    displayPhotographers(cachedPhotographers);
  } catch (error) {
    console.error(error);
  }
}

// Ajout du header et des boutons de filtre 
document.querySelector("header").innerHTML = `
  <div>
    <strong>
      <img class="header__logo" src="Medias/logo/logo.png" alt="logo FishEye">
      <h1 class="title1">Nos photographes</h1>
    </strong>
    <nav>
      <button class="filter-btn" data-tag="art">#Art</button>
      <button class="filter-btn" data-tag="portrait">#Portrait</button>
      <button class="filter-btn" data-tag="architecture">#Architecture</button>
      <button class="filter-btn" data-tag="travel">#Travel</button>
      <button class="filter-btn" data-tag="sport">#Sport</button>
      <button class="filter-btn" data-tag="animals">#Animals</button>
      <button class="filter-btn" data-tag="events">#events</button>
      <button class="filter-btn" data-tag="fashion">#Fashion</button>
    </nav>
    <h1 class="header__title">Nos photographes</h1>
  </div>
`;

// Gestion de la sélection des filtres
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tag = this.getAttribute('data-tag');

      // Vérifier si le tag est déjà sélectionné
      if (selectedTags.includes(tag)) {
        // Si le tag est sélectionné, le retirer de la liste
        selectedTags = selectedTags.filter(t => t !== tag);
        this.classList.remove('selected');
      } else {
        // Ajouter le tag sélectionné
        selectedTags.push(tag);
        this.classList.add('selected');
      }

      // Mettre à jour l'affichage des photographes
      filterPhotographers();
    });
  });
}

// Fonction pour filtrer les photographes
function filterPhotographers() {
  const filteredPhotographers = cachedPhotographers.filter(photographer => {
    // Si aucun tag n'est sélectionné, tous les photographes sont affichés
    if (selectedTags.length === 0) {
      return true;
    }

    // Vérifier si le photographe a tous les tags sélectionnés
    return selectedTags.every(tag => photographer.tags.includes(tag.toLowerCase()));
  });

  // Afficher les photographes filtrés
  displayPhotographers(filteredPhotographers);
}

// Création du profile d'un photographe
function createPhotographerCard(photographer) {
  const photographersElement = document.createElement("article");
  photographersElement.setAttribute('tabindex', '0');
  photographersElement.classList.add("profilePhotographe")
  photographersElement.addEventListener('click', function () {
    this.classList.toggle('active');
  });

  const imageElement = document.createElement("img");
  const nomElement = document.createElement("h2");
  const villeElement = document.createElement("h3");
  const taglineElement = document.createElement("p");
  const prixElement = document.createElement("span");
  const tagsContainer = createTagsContainer(photographer.tags);

  imageElement.src = photographer.portrait;
  nomElement.innerText = photographer.name;
  villeElement.innerText = photographer.city;
  taglineElement.innerText = photographer.tagline;
  prixElement.innerText = `${photographer.price} €/jour`;

  photographersElement.appendChild(imageElement);
  photographersElement.appendChild(nomElement);
  photographersElement.appendChild(villeElement);
  photographersElement.appendChild(taglineElement);
  photographersElement.appendChild(prixElement);
  photographersElement.appendChild(tagsContainer);

  photographersElement.addEventListener("click", () => {
    window.location.href = `photographer.html?id=${photographer.id}`;
  });
  
  return photographersElement;
}

// Création du conteneur de tags
function createTagsContainer(tags) {
  const tagsContainer = document.createElement("div");

  tags.forEach(tag => {
    const tagElement = document.createElement("span");
    tagElement.innerText = `#${tag}`;
    tagsContainer.appendChild(tagElement);
  });

  return tagsContainer;
}

// Affichage des photographes
function displayPhotographers(photographers) {
  const sectionPhotographers = document.querySelector("body main section");
  sectionPhotographers.innerHTML = '';

  photographers.forEach(photographer => {
    const photographerCard = createPhotographerCard(photographer);
    sectionPhotographers.appendChild(photographerCard);
  });
}

// Appel des fonctions pour charger les photographes et configurer les boutons de filtre
loadData();
setupFilterButtons();
