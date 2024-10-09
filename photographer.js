// Récupération de l'ID du photographe depuis les paramètres de l'URL
const params = new URLSearchParams(window.location.search);
const photographerId = parseInt(params.get('id'));

let photographersData = [];
let mediaData = [];

// Variable pour stocker les médias déjà likés par l'utilisateur
let likedMedia = {};

// Chargement des données des photographes et des médias 
async function loadPhotographersData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        photographersData = data.photographers;
        mediaData = data.media;
        
        afficherDetailsPhotographe();  
        afficherGaleriePhotographe();  
        attacherLightboxEvents();  
        TotalLikesPhotographes();
    } catch (error) {
        console.error(error);
    }
}

// Affichage des détails du photographe sélectionné
function afficherDetailsPhotographe() {
    const photographer = photographersData.find(p => p.id === photographerId);
    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    const detailsSection = document.querySelector("#photographerDetails");

    let description = `
        <div>
            <h2>${photographer.name}</h2>
            <h3>${photographer.city}</h3>
            <p>${photographer.tagline}</p>
            <span id="photographerTags"></span>
        </div>
    `;

    const form = document.querySelector(".name");
    form.innerHTML = photographer.name;

    const imageElement = document.createElement("img");
    imageElement.src = photographer.portrait;

    detailsSection.innerHTML = description;
    const tagsContainer = document.querySelector("#photographerTags");

    photographer.tags.forEach(tag => {
        const tagElement = document.createElement("strong");
        tagElement.innerText = `#${tag} `;
        tagsContainer.appendChild(tagElement);
    });

    detailsSection.appendChild(imageElement);

    TotalLikesPhotographes();
}

// Récupération des médias du photographe
function recupererMediasPhotographe() {
    return mediaData.filter(media => media.photographerId === photographerId);
}

// Fonction pour les likes
function Likes(media, likeButton, likesElement) {
    likeButton.addEventListener('click', () => {
        if (!likedMedia[media.id]) {
            media.likes++;
            likesElement.innerText = media.likes;
            likedMedia[media.id] = true;
            likeButton.classList.add("liked");
        } else {
            media.likes--;
            likesElement.innerText = media.likes;
            likeButton.classList.remove("liked");
            delete likedMedia[media.id];
        }
        TotalLikesPhotographes();
    });
}

// Affichage des médias du photographe dans la galerie 
function afficherGaleriePhotographe(photographerMedia = null) {
    const gallerySection = document.querySelector("#photographerGallery .media");
    gallerySection.innerHTML = "";  
    photographerMedia = photographerMedia || recupererMediasPhotographe(); 

    photographerMedia.forEach(media => {
        const mediaElement = document.createElement("div");
        mediaElement.classList.add("galleryItem");
       

        let likesContainer, likesElement, likeButton;

        if (media.typeMedia === "video") {
            const videoElement = document.createElement("video");
            videoElement.src = media.video;
            videoElement.controls = true;
          

            const footerElement = document.createElement("footer");
            const titleElement = document.createElement("h3");
            titleElement.innerText = media.title;

            likesContainer = document.createElement("span");
            likesElement = document.createElement("strong");
            likesElement.innerText = media.likes;
            likesElement.classList.add("likes");

            likeButton = document.createElement("button");
            likeButton.innerText = "♥";

            likesContainer.appendChild(likesElement);
            likesContainer.appendChild(likeButton);
            footerElement.appendChild(titleElement);
            footerElement.appendChild(likesContainer);

            mediaElement.appendChild(videoElement);
            mediaElement.appendChild(footerElement);

        } else {
            const imageElement = document.createElement("img");
            imageElement.src = media.image;
            imageElement.alt = media.title;

            const footerElement = document.createElement("footer");
            const titleElement = document.createElement("h3");
            titleElement.innerText = media.title;

            likesContainer = document.createElement("span");
            likesElement = document.createElement("strong");
            likesElement.innerText = media.likes;
            likesElement.classList.add("likes");

            likeButton = document.createElement("button");
            likeButton.innerText = "♥";

            likesContainer.appendChild(likesElement);
            likesContainer.appendChild(likeButton);
            footerElement.appendChild(titleElement);
            footerElement.appendChild(likesContainer);

            mediaElement.appendChild(imageElement);
            mediaElement.appendChild(footerElement);
        }

        Likes(media, likeButton, likesElement);

        gallerySection.appendChild(mediaElement);
    });
}

// Systeme de gestion des tri
function trierMedias(critere) {
    let photographerMedia = recupererMediasPhotographe();

    if (critere === "popularite") {
        photographerMedia.sort((a, b) => b.likes - a.likes); 
    } else if (critere === "date") {
        photographerMedia.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    } else if (critere === "titre") {
        photographerMedia.sort((a, b) => a.title.localeCompare(b.title)); 
    }

    afficherGaleriePhotographe(photographerMedia);
}
document.getElementById("sortOptions").addEventListener("change", function () {
    const critere = this.value; 
    trierMedias(critere); 
});

// Fonction pour l'affichage du total des likes
function TotalLikesPhotographes() {
    const photographer = photographersData.find(p => p.id === photographerId);
    const photographerMedia = recupererMediasPhotographe();
    let totalLikes = 0;

    for (let i = 0; i < photographerMedia.length; i++) {
        totalLikes += photographerMedia[i].likes;
    }

    const totalLikesElement = document.getElementById("totalLikes");
    totalLikesElement.innerText = `${totalLikes} \u00A0 ${photographer.price}€/jour`;
}

// fonction des evenements de la lightbox
function attacherLightboxEvents() {
    const lightbox = document.getElementById("lightbox");
    const lightboxContent = document.getElementById("lightboxContent");
    let currentIndex = 0;

    const galleryItems = document.querySelectorAll("#photographerGallery .galleryItem");

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightBox(item.cloneNode(true));
        });

        const likeButton = item.querySelector('button');
        if (likeButton) {
            likeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const likesElement = item.querySelector('.likes strong');
                Likes(mediaData[index], likeButton, likesElement);
            });
        }
    });

    function openLightBox(content) {
        lightboxContent.innerHTML = '';  
        lightboxContent.appendChild(content); 
        lightbox.style.display = 'flex'; 
        
        const likeButton = lightboxContent.querySelector('button');
        const likesElement = lightboxContent.querySelector('.likes strong');
        Likes(mediaData[currentIndex], likeButton, likesElement);
    }

    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    document.querySelector('.right').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightBox(galleryItems[currentIndex].cloneNode(true));
    });

    document.querySelector('.left').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightBox(galleryItems[currentIndex].cloneNode(true));
    });
}

function gererModal(modalId, boutonId, closeClass) {
    let modal = document.getElementById(modalId);
    let btn = document.getElementById(boutonId);
    let span = document.getElementsByClassName(closeClass)[0];

    btn.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


document.getElementById('myForm').addEventListener('submit', function(event) {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs
    const prenom = document.getElementById('prenom').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('commentaire').value;

    // Afficher les valeurs dans la console
    console.log('Prénom:', prenom);
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Réinitialiser le formulaire
    document.getElementById('myForm').reset();
});

gererModal("myModal", "myBtn", "close");
loadPhotographersData();





