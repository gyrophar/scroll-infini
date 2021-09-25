const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = 'PgEUQm91lUC3T6wtuCPh8zIkfOZDOMJJwhqpma76d9c';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Chargement Initial
function updateAPIURLWithNewCount(picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Verifier que toutes les images soient bien chargées
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Fonction helper pour setAttributes sur les elements DOM
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Creer des éléments de liens & photos, ajouter au DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    console.log('total images', totalImages)
    // faire fonctionner la fonction pour chaque objet de l'array
    photosArray.forEach((photo) => {
        // Créer un element <a> pour relier à Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // Créer une <img> pour les photos
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })
        // Event Listener, verifier quand chaque objet est chargé
        img.addEventListener('load', imageLoaded)
        // Mettre l' <img> dans un <a>, puis mettre les deux dans l'element imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Obtenir les Photos depuis l'API d'Unsplash
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateAPIURLWithNewCount(30);
            isInitialLoad = false
        }
    } catch (error) {
        // attrape les erreurs ici
    }
}

// Vérifier si le scrolling arrive en bout de page, et charger de nouvelles photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})


// au chargement
getPhotos();