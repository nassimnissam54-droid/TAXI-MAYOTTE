// ===== CONFIGURATION — REMPLACEZ CES VALEURS =====
const PHONE = '262639202699'; // Société MASSULAHA

// ===== DATE & HEURE PAR DÉFAUT =====
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('heure');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (timeInput) {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const h = String(now.getHours()).padStart(2, '0');
    timeInput.value = `${h}:00`;
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (document.getElementById('header')?.offsetHeight || 64) + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== HEADER: TRANSPARENT → OPAQUE ON SCROLL =====
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== FORMULAIRE → WHATSAPP =====
const form = document.getElementById('formReservation');
const errorBox = document.getElementById('formError');
const btnSubmit = document.getElementById('btnSubmit');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    errorBox.hidden = true;

    const prenom     = form.prenom.value.trim();
    const tel        = form.tel.value.trim();
    const date       = form.date.value;
    const heure      = form.heure.value;
    const depart     = form.depart.value;
    const destination = form.destination.value;
    const passagers  = form.passagers.value;
    const bagages    = form.bagages.value;
    const notes      = form.notes.value.trim();
    const rgpd       = form.rgpd.checked;

    if (!prenom || !tel || !date || !heure || !depart || !destination || !rgpd) {
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const message = buildMessage({ prenom, tel, date: formatDate(date), heure, depart, destination, passagers, bagages, notes });
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showSuccess();
  });
}

function buildMessage({ prenom, tel, date, heure, depart, destination, passagers, bagages, notes }) {
  let msg = `🚕 *Réservation Société MASSULAHA*\n\n`;
  msg += `👤 *Prénom :* ${prenom}\n`;
  msg += `📱 *Téléphone :* ${tel}\n`;
  msg += `📅 *Date :* ${date}\n`;
  msg += `⏰ *Heure :* ${heure}\n`;
  msg += `📍 *Départ :* ${depart}\n`;
  msg += `🏁 *Destination :* ${destination}\n`;
  msg += `👥 *Passagers :* ${passagers}\n`;
  if (bagages && bagages !== 'Non') msg += `🧳 *Bagages :* ${bagages}\n`;
  if (notes) msg += `📝 *Notes :* ${notes}\n`;
  msg += `\n_Réservation effectuée via le site web_`;
  return msg;
}

function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  const jours   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mois    = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const date    = new Date(str + 'T12:00:00');
  return `${jours[date.getDay()]} ${parseInt(d)} ${mois[parseInt(m) - 1]} ${y}`;
}

// ===== FORMULAIRE DEVIS → WHATSAPP =====
const formDevis   = document.getElementById('formDevis');
const btnDevis    = document.getElementById('btnDevis');

if (formDevis) {
  formDevis.addEventListener('submit', e => {
    e.preventDefault();

    const nom         = formDevis['nom'].value.trim();
    const tel         = formDevis['tel'].value.trim();
    const depart      = formDevis['depart'].value.trim();
    const destination = formDevis['destination'].value.trim();
    const date        = formDevis['date'].value;
    const passagers   = formDevis['passagers'].value;
    const notes       = formDevis['notes'].value.trim();

    if (!nom || !tel || !depart || !destination) {
      alert('Merci de remplir les champs obligatoires : prénom, téléphone, départ et destination.');
      return;
    }

    let msg = `💰 *Demande de devis — Société MASSULAHA*\n\n`;
    msg += `👤 *Prénom :* ${nom}\n`;
    msg += `📱 *Téléphone :* ${tel}\n`;
    msg += `📍 *Départ :* ${depart}\n`;
    msg += `🏁 *Destination :* ${destination}\n`;
    if (date) msg += `📅 *Date souhaitée :* ${formatDate(date)}\n`;
    msg += `👥 *Passagers :* ${passagers}\n`;
    if (notes) msg += `📝 *Infos complémentaires :* ${notes}\n`;
    msg += `\n_Demande de devis via le site web_`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Feedback visuel
    const original = btnDevis.innerHTML;
    btnDevis.innerHTML = `✅ Message envoyé — Vérifiez WhatsApp !`;
    btnDevis.style.background = '#059669';
    btnDevis.disabled = true;
    setTimeout(() => {
      btnDevis.innerHTML = original;
      btnDevis.style.background = '';
      btnDevis.disabled = false;
      formDevis.reset();
    }, 5000);
  });
}

function showSuccess() {
  const original = btnSubmit.innerHTML;
  btnSubmit.innerHTML = `✅ Message envoyé — Vérifiez WhatsApp !`;
  btnSubmit.style.background = '#059669';
  btnSubmit.disabled = true;

  setTimeout(() => {
    btnSubmit.innerHTML = original;
    btnSubmit.style.background = '';
    btnSubmit.disabled = false;
    form.reset();

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.value = today;

    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const timeInput = document.getElementById('heure');
    if (timeInput) timeInput.value = `${String(now.getHours()).padStart(2, '0')}:00`;
  }, 5000);
}

// ===================================================
// ===== MODAL TOURISME — CARTE INTERACTIVE MAYOTTE
// ===================================================

const SITES_TOURISME = [
  {
    id: 1,
    nom: "Plage de N'Gouja",
    lat: -12.9697, lng: 45.1547,
    cat: 'plage', emoji: '🏖️', commune: 'Kani-Kéli',
    desc: "L'une des plus belles plages de Mayotte, célèbre pour ses tortues marines et ses eaux cristallines.",
    activites: ['Tortues marines 🐢', 'Snorkeling 🤿', 'Natation', 'Coucher de soleil 🌅'],
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80'
  },
  {
    id: 2,
    nom: 'Lagon de Mayotte',
    lat: -12.8700, lng: 45.1500,
    cat: 'nautique', emoji: '🤿', commune: 'Toute l\'île',
    desc: 'Le plus grand lagon du monde avec ses eaux turquoise d\'une clarté exceptionnelle — paradis des plongeurs.',
    activites: ['Plongée sous-marine 🤿', 'Snorkeling', 'Dauphins 🐬', 'Balades en bateau'],
    photo: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&q=80'
  },
  {
    id: 3,
    nom: 'Mont Bénara',
    lat: -12.8356, lng: 45.0820,
    cat: 'nature', emoji: '🏔️', commune: 'Bouéni',
    desc: 'Point culminant de Mayotte à 660 m. Randonnée en forêt tropicale avec vue panoramique sur le lagon.',
    activites: ['Randonnée 🥾', 'Panorama sur le lagon', 'Faune endémique', 'Photographie 📸'],
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80'
  },
  {
    id: 4,
    nom: 'Îlot Mbouzi',
    lat: -12.8770, lng: 45.2230,
    cat: 'nautique', emoji: '🏝️', commune: 'Mamoudzou',
    desc: 'Réserve naturelle classée, accessible en bateau. Coraux intacts et faune marine d\'une richesse rare.',
    activites: ['Snorkeling 🤿', 'Plongée', 'Faune marine protégée', 'Nature sauvage'],
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=80'
  },
  {
    id: 5,
    nom: 'Cascade de Soulou',
    lat: -12.9170, lng: 45.0990,
    cat: 'nature', emoji: '💧', commune: 'Bouéni',
    desc: 'Magnifique cascade au cœur de la forêt tropicale humide. Bassin naturel pour la baignade.',
    activites: ['Randonnée 🥾', 'Baignade', 'Forêt tropicale', 'Pique-nique'],
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80'
  },
  {
    id: 6,
    nom: 'Marché de Mamoudzou',
    lat: -12.7797, lng: 45.2297,
    cat: 'culture', emoji: '🛒', commune: 'Mamoudzou',
    desc: 'Le marché central coloré et animé — artisanat local, épices, tissus traditionnels et saveurs mahoraises.',
    activites: ['Artisanat local', 'Gastronomie mahoraise 🍴', 'Culture locale', 'Shopping'],
    photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80'
  },
  {
    id: 7,
    nom: 'Plage de Sakouli',
    lat: -12.9797, lng: 45.1197,
    cat: 'plage', emoji: '🌊', commune: 'Kani-Kéli',
    desc: 'Plage de sable blanc bordée de filaos. Eaux turquoise, idéale pour la baignade et le snorkeling.',
    activites: ['Baignade 🏊', 'Snorkeling 🤿', 'Détente', 'Coucher de soleil 🌅'],
    photo: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80'
  },
  {
    id: 8,
    nom: 'Dzaoudzi & Petite Terre',
    lat: -12.7900, lng: 45.2700,
    cat: 'culture', emoji: '🏛️', commune: 'Dzaoudzi',
    desc: 'Ancienne capitale sur Petite Terre. Architecture coloniale, panoramas sur le lagon, vie locale authentique.',
    activites: ['Histoire & patrimoine', 'Vue panoramique 📸', 'Gastronomie', 'Marché local'],
    photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80'
  },
  {
    id: 9,
    nom: 'Plage de Moya',
    lat: -12.9543, lng: 45.2050,
    cat: 'plage', emoji: '🐋', commune: 'Bandrélé',
    desc: 'Plage sauvage et préservée, sanctuaire pour les tortues marines. Observation de baleines en saison.',
    activites: ['Baleines (juil–sept) 🐋', 'Tortues 🐢', 'Snorkeling 🤿', 'Plage sauvage'],
    photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80'
  },
  {
    id: 10,
    nom: 'Îlot de Sable Blanc',
    lat: -12.7650, lng: 45.0950,
    cat: 'nautique', emoji: '☀️', commune: 'Koungou',
    desc: 'Îlot de sable blanc immaculé au milieu du lagon, accessible uniquement en pirogue ou bateau.',
    activites: ['Pirogue 🚣', 'Snorkeling 🤿', 'Plage privée', 'Photographie unique 📸'],
    photo: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&q=80'
  }
];

const CAT_COLORS = { plage: '#0891b2', nautique: '#1d4ed8', nature: '#059669', culture: '#c8960c' };
const CAT_LABELS = { plage: 'Plage', nautique: 'Nautique', nature: 'Nature', culture: 'Culture' };

let tourismeMap   = null;
let tourismeMarkers = {};
let listRendered  = false;

function openTourismeModal() {
  const modal = document.getElementById('modalTourisme');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (!listRendered) { renderSiteCards(); listRendered = true; }
  setTimeout(initTourismeMap, 160);
}

function closeTourismeModal() {
  const modal = document.getElementById('modalTourisme');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Fermer en cliquant le backdrop
document.addEventListener('DOMContentLoaded', () => {
  const bd = document.getElementById('mtBackdrop');
  if (bd) bd.addEventListener('click', closeTourismeModal);
  // Keyboard support on tourisme card
  const card = document.querySelector('.sc-tour');
  if (card) {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTourismeModal(); }
    });
  }
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTourismeModal();
  });
});

function renderSiteCards() {
  const list = document.getElementById('mtList');
  if (!list) return;
  list.innerHTML = SITES_TOURISME.map(s => `
    <div class="mt-card" id="mtc-${s.id}" onclick="zoomToSite(${s.id})">
      <img class="mt-card-img" src="${s.photo}" alt="${s.nom}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/310x96/eef2f7/8899aa?text=${encodeURIComponent(s.nom)}'"/>
      <div class="mt-card-body">
        <span class="mt-cat-badge cat-${s.cat}">${s.emoji} ${CAT_LABELS[s.cat]}</span>
        <h4>${s.nom}</h4>
        <p class="mt-card-loc">📍 ${s.commune}</p>
        <div class="mt-acts">
          ${s.activites.slice(0, 3).map(a => `<span class="mt-act">${a}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

function initTourismeMap() {
  if (typeof L === 'undefined') return;
  const el = document.getElementById('mtMap');
  if (!el) return;
  if (tourismeMap) { tourismeMap.invalidateSize(); return; }

  tourismeMap = L.map('mtMap', { zoomControl: true, scrollWheelZoom: true })
    .setView([-12.83, 45.155], 10);

  // Fond de carte OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(tourismeMap);

  SITES_TOURISME.forEach(s => {
    const col = CAT_COLORS[s.cat] || '#0b1628';
    const icon = L.divIcon({
      html: `<div class="lf-mk" style="background:${col}" title="${s.nom}">${s.emoji}</div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -44]
    });
    const marker = L.marker([s.lat, s.lng], { icon }).addTo(tourismeMap);
    marker.bindPopup(buildMapPopup(s), { minWidth: 250, maxWidth: 290, className: 'mt-lf-popup' });
    marker.on('click', () => highlightSiteCard(s.id));
    tourismeMarkers[s.id] = marker;
  });
}

function buildMapPopup(s) {
  const col = CAT_COLORS[s.cat] || '#0b1628';
  return `
    <div style="margin:-13px -20px -17px;border-radius:6px;overflow:hidden;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
      <img src="${s.photo}" alt="${s.nom}"
           style="width:100%;height:135px;object-fit:cover;display:block"
           onerror="this.src='https://via.placeholder.com/280x135/eef2f7/8899aa?text=${encodeURIComponent(s.nom)}'"/>
      <div style="padding:10px 13px 13px">
        <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.4px;background:${col}22;color:${col};margin-bottom:5px">
          ${s.emoji} ${CAT_LABELS[s.cat]}
        </span>
        <div style="font-size:.93rem;font-weight:800;color:#0b1628;margin-bottom:2px">${s.nom}</div>
        <div style="font-size:.72rem;color:#8899aa;margin-bottom:6px">📍 ${s.commune}</div>
        <div style="font-size:.79rem;color:#4a5568;line-height:1.55;margin-bottom:8px">${s.desc}</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:10px">
          ${s.activites.map(a =>
            `<span style="padding:2px 7px;background:#f7f9fc;border-radius:4px;font-size:.68rem;color:#1a2332;border:1px solid #dde3ec">${a}</span>`
          ).join('')}
        </div>
        <a href="#reservation" onclick="closeTourismeModal()"
           style="display:flex;align-items:center;justify-content:center;gap:6px;background:#c8960c;color:#0b1628;border-radius:50px;padding:9px 16px;font-size:.81rem;font-weight:700;text-decoration:none">
          🚕 Réserver un taxi pour ce site
        </a>
      </div>
    </div>`;
}

function zoomToSite(id) {
  const s = SITES_TOURISME.find(x => x.id === id);
  if (!s) return;
  highlightSiteCard(id);
  if (!tourismeMap) return;
  tourismeMap.flyTo([s.lat, s.lng], 13, { duration: 1.1, easeLinearity: 0.35 });
  setTimeout(() => {
    if (tourismeMarkers[id]) tourismeMarkers[id].openPopup();
  }, 1200);
}

function highlightSiteCard(id) {
  document.querySelectorAll('.mt-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById('mtc-' + id);
  if (card) {
    card.classList.add('active');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}
