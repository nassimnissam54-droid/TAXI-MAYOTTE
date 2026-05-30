// ===== CONFIGURATION — REMPLACEZ CES VALEURS =====
const PHONE = '262639XXXXXX'; // Votre numéro WhatsApp sans + ni espaces (ex: 262639123456)

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

// ===== HEADER SHADOW ON SCROLL =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,0.14)'
      : '0 2px 8px rgba(0,0,0,0.06)';
  }, { passive: true });
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
  let msg = `🚕 *Réservation Taxi Mayotte Express*\n\n`;
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
