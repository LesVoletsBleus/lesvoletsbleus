/* ===================================================================
   LES VOLETS BLEUS — Script principal
   ===================================================================
   Ce fichier fait deux choses :
   1. Gère le menu mobile et l'année du footer
   2. Charge les données JSON et les affiche dans les pages
   =================================================================== */


// ============== Menu mobile ==============
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}


// ============== Année dynamique footer ==============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ============== Helper : charger un JSON ==============
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Fichier non trouvé : ' + path);
        return await response.json();
    } catch (err) {
        console.error('Erreur de chargement :', err);
        return null;
    }
}


// ============== Helper : échapper le HTML pour la sécurité ==============
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


// ============== Helper : formater un nom de plat avec / colorés ==============
function formaterNomPlat(nom) {
    if (!nom) return '';
    return escapeHTML(nom).replace(/ \/ /g, ' <span class="sep">/</span> ');
}


// ============== Page d'accueil ==============
async function chargerAccueil() {
    const infos = await loadJSON('data/infos.json');
    if (!infos || !infos.accueil) return;

    const a = infos.accueil;

    // Hero
    setHTML('#hero-title-1', `${escapeHTML(a.phrase_hero_ligne_1_avant_em)}<em>${escapeHTML(a.phrase_hero_ligne_1_em)}</em>${escapeHTML(a.phrase_hero_ligne_1_apres_em)}`);
    setHTML('#hero-title-2', `${escapeHTML(a.phrase_hero_ligne_2_avant_em)}<em>${escapeHTML(a.phrase_hero_ligne_2_em)}</em>${escapeHTML(a.phrase_hero_ligne_2_apres_em)}`);
    setText('#hero-subtitle', a.sous_titre_hero);

    // 3 sections
    setText('#section-carte-label', a.section_carte_label);
    setText('#section-carte-titre', a.section_carte_titre);
    setText('#section-carte-desc', a.section_carte_desc);

    setText('#section-vins-label', a.section_vins_label);
    setText('#section-vins-titre', a.section_vins_titre);
    setText('#section-vins-desc', a.section_vins_desc);

    setText('#section-evenements-label', a.section_evenements_label);
    setText('#section-evenements-titre', a.section_evenements_titre);
    setText('#section-evenements-desc', a.section_evenements_desc);

    // Histoire
    setText('#histoire-date', a.histoire_date);
    setText('#histoire-intro', a.histoire_intro);
    setText('#histoire-corps', a.histoire_texte);

    // 3 piliers
    setText('#pilier-1-chiffre', a.pilier_1_chiffre);
    setText('#pilier-1-label', a.pilier_1_label);
    setText('#pilier-1-desc', a.pilier_1_desc);
    setText('#pilier-2-chiffre', a.pilier_2_chiffre);
    setText('#pilier-2-label', a.pilier_2_label);
    setText('#pilier-2-desc', a.pilier_2_desc);
    setText('#pilier-3-chiffre', a.pilier_3_chiffre);
    setText('#pilier-3-label', a.pilier_3_label);
    setText('#pilier-3-desc', a.pilier_3_desc);

    // Citation
    setText('#citation-text', a.citation);
    setText('#citation-complement', a.citation_complement);

    // Infos pratiques
    if (infos.horaires_resume) {
        setText('#info-horaires', infos.horaires_resume);
    }
    if (infos.contact) {
        setHTML('#info-reserver',
            `<a href="tel:${escapeHTML(infos.contact.telephone_lien)}">${escapeHTML(infos.contact.telephone)}</a><br>${escapeHTML(infos.contact.adresse_ligne_1)} · ${escapeHTML(infos.ville)}`
        );
    }
}


// ============== Page Carte ==============
async function chargerCarte() {
    const carte = await loadJSON('data/carte.json');
    if (!carte) return;

    // Titre et infos générales
    setText('#carte-eyebrow', `— ${carte.saison} · ${carte.validite}`);
    setHTML('#carte-title-1', escapeHTML(carte.phrase_accroche_ligne_1));
    setHTML('#carte-title-2', escapeHTML(carte.phrase_accroche_ligne_2));
    setText('#carte-subtitle', `${carte.entrees.length} entrées · ${carte.plats.length} plats · ${carte.desserts.length} desserts.`);
    setText('#carte-intro', carte.intro);

    // Entrées
    afficherSection('#carte-entrees', carte.entrees, 'Entrées');
    afficherSection('#carte-plats', carte.plats, 'Plats');
    afficherSection('#carte-desserts', carte.desserts, 'Desserts');

    // Compteurs dans les en-têtes
    setText('#carte-entrees-count', `/ Entrées · ${carte.entrees.length}`);
    setText('#carte-plats-count', `/ Plats · ${carte.plats.length}`);
    setText('#carte-desserts-count', `/ Desserts · ${carte.desserts.length}`);

    // Options spéciales
    if (carte.options_speciales && carte.options_speciales.length > 0) {
        const containerSpeciales = document.querySelector('#carte-options-speciales');
        if (containerSpeciales) {
            containerSpeciales.innerHTML = carte.options_speciales
                .map(item => renderOptionSpeciale(item))
                .join('');
        }
    }
}

function afficherSection(selector, items, type) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = items.map(item => renderPlat(item)).join('');
}

function renderPlat(plat) {
    const isSignature = plat.signature === true;
    const wrapperClass = isSignature ? 'menu-item menu-item-signature' : 'menu-item';
    const signatureLabel = isSignature
        ? '<p class="menu-item-signature-label">Plat signature</p>'
        : '';

    const accord = plat.accord_vin
        ? `<div class="menu-item-pairing">
                <span class="menu-item-pairing-icon">V</span>
                <span class="menu-item-pairing-text">${escapeHTML(plat.accord_vin)}</span>
           </div>`
        : '';

    return `
        <article class="${wrapperClass}">
            ${signatureLabel}
            <h3 class="menu-item-name">${formaterNomPlat(plat.nom)}</h3>
            <p class="menu-item-desc">${escapeHTML(plat.description)}</p>
            ${accord}
        </article>
    `;
}

function renderOptionSpeciale(item) {
    const cls = item.type === 'vegan' ? 'menu-special menu-special-vegan' : 'menu-special';
    const accord = item.accord_boisson
        ? `<div class="menu-item-pairing" style="margin-top: 8px;">
                <span class="menu-item-pairing-icon">${item.type === 'vegan' ? 'V' : '🥤'}</span>
                <span class="menu-item-pairing-text">${escapeHTML(item.accord_boisson)}</span>
           </div>`
        : '';

    return `
        <div class="${cls}">
            <p class="menu-special-label">${item.icone || ''} ${escapeHTML(item.label)}</p>
            <h3 class="menu-item-name">${formaterNomPlat(item.nom)}</h3>
            <p class="menu-item-desc">${escapeHTML(item.description)}</p>
            ${accord}
        </div>
    `;
}


// ============== Page Vins ==============
async function chargerVins() {
    const vins = await loadJSON('data/vins.json');
    if (!vins) return;

    // Titre
    setText('#vins-eyebrow', `— ${vins.saison} · Notre cave`);
    setHTML('#vins-title-1', escapeHTML(vins.phrase_accroche_ligne_1));
    setHTML('#vins-title-2', escapeHTML(vins.phrase_accroche_ligne_2));
    setText('#vins-intro', vins.intro);

    // Filtres
    const filtresContainer = document.querySelector('#vins-filtres');
    if (filtresContainer) {
        let filtresHTML = '<button class="vins-filtre active" data-cat="tous">Tous</button>';
        filtresHTML += vins.categories
            .map(cat => `<button class="vins-filtre" data-cat="${cat.id}">${escapeHTML(cat.nom)}</button>`)
            .join('');
        filtresContainer.innerHTML = filtresHTML;
    }

    // Catégories
    const categoriesContainer = document.querySelector('#vins-categories');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = vins.categories.map(cat => renderCategorie(cat)).join('');
    }

    // Filtres interactifs
    document.querySelectorAll('.vins-filtre').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            document.querySelectorAll('.vins-filtre').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.vins-categorie').forEach(section => {
                if (cat === 'tous' || section.dataset.cat === cat) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

function renderCategorie(cat) {
    const vinsHTML = cat.vins.map(vin => renderVin(vin)).join('');
    return `
        <section class="vins-categorie" data-cat="${cat.id}">
            <div class="menu-section-head">
                <h2 class="menu-section-titre">${escapeHTML(cat.nom)}</h2>
                <span class="menu-section-count">/ ${cat.vins.length} cuvée${cat.vins.length > 1 ? 's' : ''}</span>
            </div>
            ${vinsHTML}
        </section>
    `;
}

function renderVin(vin) {
    const wrapperClass = vin.coup_de_coeur ? 'vin-item vin-coup-de-coeur' : 'vin-item';
    const coupDeCoeur = vin.coup_de_coeur
        ? '<p class="vin-coup-de-coeur-label">Coup de cœur du sommelier</p>'
        : '';

    const labels = (vin.labels || []).map(label => {
        const cls = label === 'BIO' ? 'vin-label-bio'
            : label === 'BIODYNAMIE' ? 'vin-label-biodynamie'
            : label === 'NATURE' ? 'vin-label-nature'
            : '';
        return `<span class="vin-label ${cls}">${escapeHTML(label)}</span>`;
    }).join('');

    const labelsHTML = labels ? `<div class="vin-item-labels">${labels}</div>` : '';

    let prix = '';
    if (vin.prix_verre && vin.prix_bouteille) {
        prix = `${escapeHTML(vin.prix_verre)} verre · ${escapeHTML(vin.prix_bouteille)} bouteille`;
    } else if (vin.prix_verre) {
        prix = escapeHTML(vin.prix_verre);
    }

    return `
        <article class="${wrapperClass}">
            ${coupDeCoeur}
            <div class="vin-item-head">
                <h3 class="vin-item-name">${formaterNomPlat(vin.nom)}</h3>
                <p class="vin-item-prices">${prix}</p>
            </div>
            <p class="vin-item-info">${escapeHTML(vin.appellation)}</p>
            ${labelsHTML}
            <p class="vin-item-desc">${escapeHTML(vin.description)}</p>
        </article>
    `;
}


// ============== Page Évènements ==============
async function chargerEvenements() {
    const data = await loadJSON('data/evenements.json');
    if (!data) return;

    setHTML('#evenements-title-1', escapeHTML(data.phrase_accroche_ligne_1));
    setHTML('#evenements-title-2', escapeHTML(data.phrase_accroche_ligne_2));

    const container = document.querySelector('#evenements-list');
    if (container) {
        container.innerHTML = data.evenements.map(ev => renderEvenement(ev)).join('');
    }
}

function renderEvenement(ev) {
    // Si la "date_jour" contient des lettres, on l'affiche en italique
    const isItalic = /[a-zA-Z]/.test(ev.date_jour);
    const jourClass = isItalic ? 'evenement-date-jour italic' : 'evenement-date-jour';
    const statutClass = `evenement-statut statut-${ev.couleur_statut || 'orange-clair'}`;

    return `
        <article class="evenement-item">
            <div class="evenement-date">
                <p class="${jourClass}">${escapeHTML(ev.date_jour)}</p>
                ${ev.date_complement ? `<p class="evenement-date-complement">${escapeHTML(ev.date_complement)}</p>` : ''}
            </div>
            <div>
                <h3 class="evenement-titre">${escapeHTML(ev.titre)}</h3>
                <p class="evenement-desc">${escapeHTML(ev.description)}</p>
            </div>
            <span class="${statutClass}">${escapeHTML(ev.statut)}</span>
        </article>
    `;
}


// ============== Page Contact ==============
async function chargerContact() {
    const infos = await loadJSON('data/infos.json');
    if (!infos) return;

    if (infos.contact) {
        setHTML('#contact-adresse',
            `${escapeHTML(infos.contact.adresse_ligne_1)}<br>${escapeHTML(infos.contact.adresse_ligne_2)}`);
        setHTML('#contact-telephone',
            `<a href="tel:${escapeHTML(infos.contact.telephone_lien)}">${escapeHTML(infos.contact.telephone)}</a>`);
        setHTML('#contact-email',
            `<a href="mailto:${escapeHTML(infos.contact.email)}">${escapeHTML(infos.contact.email)}</a>`);

        const iframe = document.querySelector('#contact-map iframe');
        if (iframe && infos.contact.google_maps_embed) {
            iframe.src = infos.contact.google_maps_embed;
        }
    }

    // Horaires
    const tableBody = document.querySelector('#hours-table tbody');
    if (tableBody && infos.horaires) {
        tableBody.innerHTML = infos.horaires.map(h => `
            <tr>
                <td>${escapeHTML(h.jour)}</td>
                <td class="${h.ferme ? 'closed' : ''}">${escapeHTML(h.creneaux)}</td>
            </tr>
        `).join('');
    }
}


// ============== Page Réserver ==============
async function chargerReserver() {
    const infos = await loadJSON('data/infos.json');
    if (!infos || !infos.contact) return;

    setText('#reserver-tel', infos.contact.telephone);
    setAttr('#reserver-tel-link', 'href', `tel:${infos.contact.telephone_lien}`);
    setText('#reserver-email', infos.contact.email);
    setAttr('#reserver-email-link', 'href', `mailto:${infos.contact.email}`);
}


// ============== Helpers d'affichage ==============
function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el && text !== undefined) el.textContent = text;
}

function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el && html !== undefined) el.innerHTML = html;
}

function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el && value !== undefined) el.setAttribute(attr, value);
}


// ============== Routeur : selon la page ==============
const page = document.body.dataset.page;
switch (page) {
    case 'accueil': chargerAccueil(); break;
    case 'carte': chargerCarte(); break;
    case 'vins': chargerVins(); break;
    case 'evenements': chargerEvenements(); break;
    case 'contact': chargerContact(); break;
    case 'reserver': chargerReserver(); break;
}
