// ***** Récupération des données *****
async function loadPhotographers() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const photographers = await response.json();
    displayPhotographers(photographers); // Appel de la fonction pour afficher les photographes
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
  const tagsContainer = createTagsContainer(photographer.tags); // Fonction pour créer le conteneur de tags

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
  sectionPhotographers.innerHTML = ''; // Vider la section avant d'ajouter les photographes

  photographers.forEach(photographer => {
    const photographerCard = createPhotographerCard(photographer); // Créer la carte pour chaque photographe
    sectionPhotographers.appendChild(photographerCard); // Ajouter la carte au DOM
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


// ***** Appel de la fonction pour charger les photographes *****
loadPhotographers();
// *************************************************************
