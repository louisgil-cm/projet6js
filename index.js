// ***** Récupération des données *****
async function loadPhotographers() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const photographers = await response.json();
    // Appel de la fonction pour afficher les photographes
    displayPhotographers(photographers); 
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}
// ************************************


// ***** Création de la carte d'un photographe *****
function createPhotographerCard(photographer) {
  const photographersElement = document.createElement("article");

  // Création des balises
  const imageElement = document.createElement("img");
  const nomElement = document.createElement("h2");
  const villeElement = document.createElement("p");
  const taglineElement = document.createElement("p");
  const prixElement = document.createElement("span");
  // Fonction pour créer le conteneur de tags
  const tagsContainer = createTagsContainer(photographer.tags); 

  // Remplissage des éléments avec les données du photographe
  imageElement.src = photographer.portrait;
  nomElement.innerText = photographer.nom;
  villeElement.innerText = photographer.ville;
  taglineElement.innerText = photographer.tagline;
  prixElement.innerText = photographer.prix + "€/jour";

  // Ajout des éléments à la carte du photographe
  photographersElement.appendChild(imageElement);
  photographersElement.appendChild(nomElement);
  photographersElement.appendChild(villeElement);
  photographersElement.appendChild(taglineElement);
  photographersElement.appendChild(prixElement);
  photographersElement.appendChild(tagsContainer);

  // Appliquer les styles
  stylePhotographerCard(photographersElement, imageElement, nomElement, prixElement);

  return photographersElement; // Retourne la carte du photographe
}
// *************************************************


// ***** Création du conteneur de tags *****
function createTagsContainer(tags) {
  const tagsContainer = document.createElement("div");

  // Ajout des tags dans des balises span
  tags.forEach(tag => {
    const tagElement = document.createElement("span");
    tagElement.innerText = `#${tag}`;
    styleTag(tagElement); // Fonction pour styliser les tags
    tagsContainer.appendChild(tagElement);
  });

  return tagsContainer;
}
// *****************************************


// ***** Affichage des photographes *****
function displayPhotographers(photographers) {
  const sectionPhotographers = document.querySelector("body section");
  // Vider la section avant d'ajouter les photographes
  sectionPhotographers.innerHTML = ''; 

  photographers.forEach(photographer => {
    // Créer la carte pour chaque photographe
    const photographerCard = createPhotographerCard(photographer); 
    sectionPhotographers.appendChild(photographerCard);
  });

  // Appliquer le style à la section
  sectionPhotographers.style.cssText = `
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    flex-direction: row;
  `;
}
// **************************************


// ***** Styles pour les cartes de photographes *****
function stylePhotographerCard(photographersElement, imageElement, nomElement, prixElement) {
  photographersElement.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 calc(30.33% - 20px);
    padding: 20px;
  `;

  imageElement.style.cssText = `
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
  `;

  nomElement.style.cssText = `
    color: #d3573c;
  `;

  prixElement.style.cssText = `
    margin-bottom: 10px;
  `;
}
// **********************************************


// ***** Styles pour les tags *****
function styleTag(tagElement) {
  tagElement.style.cssText = `
    font-size: 1rem;
    margin-right: 5px;
    padding: 6px;
    border: 2px solid #f2f2f2;
    border-radius: 15px;
    color: #d3573c;
  `;
}
// ********************************


// ***** Filtrer les photographes par tags *****
function filterPhotographers(tag) {
  // Charger les données des photographes
  loadPhotographers(tag); // On passe le tag à la fonction loadPhotographers
}
// ********************************************


// ***** Récupération des données et filtrage *****
async function loadPhotographers(filterTag = "") {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const photographers = await response.json();



        // Sélectionner les boutons
      const filterArtBtn = document.getElementById("filterArt");
      const filterPortraitBtn = document.getElementById("filterPortrait");
      const filterArchitectureBtn = document.getElementById("filterArchitecture");
      const filterVoyageBtn = document.getElementById("filterVoyage");
      const filterSportBtn = document.getElementById("filterSport");
      const filterAnimauxBtn = document.getElementById("filterAnimaux");
      const filterEvenementsBtn = document.getElementById("filterEvenements");

    // Ajouter des écouteurs d'événements pour chaque bouton
    filterArtBtn.addEventListener("click", () => filterPhotographers('art'));
    filterPortraitBtn.addEventListener("click", () => filterPhotographers('portrait'));
    filterArchitectureBtn.addEventListener("click", () => filterPhotographers('architecture'));
    filterVoyageBtn.addEventListener("click", () => filterPhotographers('voyage'));
    filterSportBtn.addEventListener("click", () => filterPhotographers('sport'));
    filterAnimauxBtn.addEventListener("click", () => filterPhotographers('animaux'));
    filterEvenementsBtn.addEventListener("click", () => filterPhotographers('événements'));


    // Si un filtre est appliqué, on filtre les photographes par tag
    if (filterTag) {
      const filteredPhotographers = photographers.filter(photographer =>
        photographer.tags.includes(filterTag)
      );
      displayPhotographers(filteredPhotographers); // Affiche seulement les photographes filtrés
    } else {
      displayPhotographers(photographers); // Affiche tous les photographes si aucun filtre
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}
// ***********************************************


// ***** Appel de la fonction pour charger les photographes *****
loadPhotographers();
// *************************************************************
