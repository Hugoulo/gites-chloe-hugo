document.addEventListener('DOMContentLoaded', function () {

    var images = document.querySelectorAll('.carrousel-gite .carrousel-img');
    var compteur = document.querySelector('.carrousel-compteur');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCompteur = document.getElementById('lightbox-compteur');
    var indexCarrousel = 0;
    var indexLightbox = 0;

    function afficherCarrousel(index) {
        for (var i = 0; i < images.length; i++) {
            images[i].classList.remove('active');
        }
        images[index].classList.add('active');
        compteur.textContent = (index + 1) + ' / ' + images.length;
    }

    document.querySelector('.carrousel-gite .btn-droite').addEventListener('click', function () {
        indexCarrousel = (indexCarrousel + 1) % images.length;
        afficherCarrousel(indexCarrousel);
    });

    document.querySelector('.carrousel-gite .btn-gauche').addEventListener('click', function () {
        indexCarrousel = (indexCarrousel - 1 + images.length) % images.length;
        afficherCarrousel(indexCarrousel);
    });

    window.ouvrirLightbox = function (index) {
        indexLightbox = index;
        lightboxImg.src = images[index].getAttribute('src');
        lightboxCompteur.textContent = (index + 1) + ' / ' + images.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function fermerLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('lightbox-fermer').addEventListener('click', fermerLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            fermerLightbox();
        }
    });

    document.getElementById('lightbox-droite').addEventListener('click', function () {
        indexLightbox = (indexLightbox + 1) % images.length;
        lightboxImg.src = images[indexLightbox].getAttribute('src');
        lightboxCompteur.textContent = (indexLightbox + 1) + ' / ' + images.length;
    });

    document.getElementById('lightbox-gauche').addEventListener('click', function () {
        indexLightbox = (indexLightbox - 1 + images.length) % images.length;
        lightboxImg.src = images[indexLightbox].getAttribute('src');
        lightboxCompteur.textContent = (indexLightbox + 1) + ' / ' + images.length;
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) {
            return;
        }
        if (e.key === 'ArrowRight') {
            indexLightbox = (indexLightbox + 1) % images.length;
            lightboxImg.src = images[indexLightbox].getAttribute('src');
            lightboxCompteur.textContent = (indexLightbox + 1) + ' / ' + images.length;
        }
        if (e.key === 'ArrowLeft') {
            indexLightbox = (indexLightbox - 1 + images.length) % images.length;
            lightboxImg.src = images[indexLightbox].getAttribute('src');
            lightboxCompteur.textContent = (indexLightbox + 1) + ' / ' + images.length;
        }
        if (e.key === 'Escape') {
            fermerLightbox();
        }
    });

    afficherCarrousel(0);
});