// ========================
// CARROUSEL PAR GÎTE
// ========================
document.addEventListener('DOMContentLoaded', function () {

    const carousels = document.querySelectorAll('.carrousel');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxFermer = document.getElementById('lightbox-fermer');
    const lightboxGauche = document.getElementById('lightbox-gauche');
    const lightboxDroite = document.getElementById('lightbox-droite');

    let lightboxImages = [];
    let lightboxIndex = 0;

    // --- Initialisation des carrousels ---
    carousels.forEach(function (carrousel) {
        const images = carrousel.querySelectorAll('.carrousel-img');
        const points = carrousel.querySelectorAll('.point');
        const btnGauche = carrousel.querySelector('.btn-gauche');
        const btnDroite = carrousel.querySelector('.btn-droite');
        let indexActuel = 0;

        function afficherImage(index) {
            images.forEach(img => img.classList.remove('active'));
            points.forEach(p => p.classList.remove('active'));
            images[index].classList.add('active');
            points[index].classList.add('active');
        }

        btnDroite.addEventListener('click', function () {
            indexActuel = (indexActuel + 1) % images.length;
            afficherImage(indexActuel);
        });

        btnGauche.addEventListener('click', function () {
            indexActuel = (indexActuel - 1 + images.length) % images.length;
            afficherImage(indexActuel);
        });

        points.forEach(function (point, i) {
            point.addEventListener('click', function () {
                indexActuel = i;
                afficherImage(indexActuel);
            });
        });

        // --- Clic sur photo → ouvre la lightbox ---
        images.forEach(function (img, i) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function () {
                lightboxImages = Array.from(images).map(im => im.src);
                lightboxIndex = i;
                ouvrirLightbox();
            });
        });

        afficherImage(0);
    });

    // --- Lightbox ---
    function ouvrirLightbox() {
        lightboxImg.src = lightboxImages[lightboxIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function fermerLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxFermer.addEventListener('click', fermerLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) fermerLightbox();
    });

    lightboxDroite.addEventListener('click', function () {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });

    lightboxGauche.addEventListener('click', function () {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });

    // --- Navigation clavier (flèches + Échap) ---
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') {
            lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
            lightboxImg.src = lightboxImages[lightboxIndex];
        }
        if (e.key === 'ArrowLeft') {
            lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            lightboxImg.src = lightboxImages[lightboxIndex];
        }
        if (e.key === 'Escape') fermerLightbox();
    });
});