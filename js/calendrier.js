// ========================
// CALENDRIER ICAL
// ========================

async function chargerCalendrier(icalUrl, containerId) {
    const proxyUrl = '/.netlify/functions/ical?url=' + encodeURIComponent(icalUrl);
    
    try {
        const response = await fetch(proxyUrl);
        const text = await response.text();
        const datesOccupees = parseIcal(text);
        initialiserCalendrier(containerId, datesOccupees);
    } catch (err) {
        document.getElementById(containerId).innerHTML = '<p class="cal-erreur">Calendrier temporairement indisponible.</p>';
    }
}

function parseIcal(text) {
    const dates = [];
    const lines = text.split('\n');
    let debut = null;
    let fin = null;
    let inEvent = false;

    for (let line of lines) {
        line = line.trim();
        if (line === 'BEGIN:VEVENT') {
            inEvent = true;
            debut = null;
            fin = null;
        }
        if (inEvent && line.startsWith('DTSTART')) {
            debut = parseDate(line.split(':')[1]);
        }
        if (inEvent && line.startsWith('DTEND')) {
            fin = parseDate(line.split(':')[1]);
        }
        if (line === 'END:VEVENT' && debut && fin) {
            inEvent = false;
            let current = new Date(debut);
            while (current < fin) {
                dates.push(formatDate(current));
                current.setDate(current.getDate() + 1);
            }
        }
    }
    return dates;
}

function parseDate(val) {
    const s = val.replace(/[TZ]/g, '');
    return new Date(s.substring(0,4), parseInt(s.substring(4,6)) - 1, parseInt(s.substring(6,8)));
}

function formatDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
}

function initialiserCalendrier(containerId, datesOccupees) {
    const aujourd_hui = new Date();
    let moisActuel = aujourd_hui.getMonth();
    let anneeActuelle = aujourd_hui.getFullYear();

    function afficher() {
        const container = document.getElementById(containerId);
        if (!container) return;

        const noms = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        const jours = ['Lu','Ma','Me','Je','Ve','Sa','Di'];

        const premier = new Date(anneeActuelle, moisActuel, 1);
        const dernier = new Date(anneeActuelle, moisActuel + 1, 0);
        let jourDepart = premier.getDay();
        jourDepart = jourDepart === 0 ? 6 : jourDepart - 1;

        let html = '<div class="cal-wrapper">';
        html += '<div class="cal-mois">';
        html += '<div class="cal-nav">';
        html += '<button class="cal-btn-nav" id="cal-prev-' + containerId + '">&#8592;</button>';
        html += '<div class="cal-titre">' + noms[moisActuel] + ' ' + anneeActuelle + '</div>';
        html += '<button class="cal-btn-nav" id="cal-next-' + containerId + '">&#8594;</button>';
        html += '</div>';
        html += '<div class="cal-grille">';

        for (let j of jours) {
            html += '<div class="cal-jour-nom">' + j + '</div>';
        }

        for (let k = 0; k < jourDepart; k++) {
            html += '<div class="cal-case vide"></div>';
        }

        for (let d = 1; d <= dernier.getDate(); d++) {
            const dateStr = anneeActuelle + '-' + String(moisActuel+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
            const occupe = datesOccupees.includes(dateStr);
            const passe = new Date(anneeActuelle, moisActuel, d) < aujourd_hui;
            let classe = 'cal-case';
            if (passe) classe += ' passe';
            else if (occupe) classe += ' occupe';
            else classe += ' libre';
            html += '<div class="' + classe + '">' + d + '</div>';
        }

        html += '</div></div></div>';

        container.innerHTML = html;

        // Flèche précédent
        document.getElementById('cal-prev-' + containerId).addEventListener('click', function() {
            moisActuel--;
            if (moisActuel < 0) { moisActuel = 11; anneeActuelle--; }
            afficher();
        });

        // Flèche suivant
        document.getElementById('cal-next-' + containerId).addEventListener('click', function() {
            moisActuel++;
            if (moisActuel > 11) { moisActuel = 0; anneeActuelle++; }
            afficher();
        });
    }

    afficher();
}