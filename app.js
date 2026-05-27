/* ══════════════════════════════════════════
   NAVBAR — scroll shadow + mobile toggle
══════════════════════════════════════════ */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

function toggleMenu() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}

function closeMenu() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.remove('open');
}

/* ══════════════════════════════════════════
   CONTACT / CONSULTATION FORM
══════════════════════════════════════════ */
function submitContact(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  if (!form) return;

  const name    = form.querySelector('#c-name').value.trim();
  const phone   = form.querySelector('#c-phone').value.trim();
  const email   = form.querySelector('#c-email').value.trim();
  const service = form.querySelector('#c-service').value;

  if (!name || !/^\d{10}$/.test(phone)) {
    alert('Please enter your full name and a valid 10-digit phone number.');
    return;
  }

  const entry = { name, phone: '+91' + phone, email, service, ts: new Date().toISOString() };

  // Save locally as backup
  const all = JSON.parse(localStorage.getItem('rr_contacts') || '[]');
  all.push(entry);
  localStorage.setItem('rr_contacts', JSON.stringify(all));

  // Send to Google Sheets via Apps Script Web App
  const sheetUrl = form.dataset.sheetUrl;
  if (sheetUrl && sheetUrl !== 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    const btn = document.getElementById('contact-btn');
    const btnText = document.getElementById('contact-btn-text');
    if (btnText) btnText.textContent = 'Sending...';
    if (btn) btn.disabled = true;

    fetch(sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).finally(function () {
      if (btnText) btnText.textContent = 'Submit — We\'ll Call You';
      if (btn) btn.disabled = false;
    });
  }

  form.reset();
  const successEl = document.getElementById('contact-success');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(function () { successEl.style.display = 'none'; }, 5000);
  }
}

/* ══════════════════════════════════════════
   SMOOTH SCROLL for anchor links
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* animate bar fills on first scroll into view */
  const bars = document.querySelectorAll('.hc-bar-fill');
  if (bars.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.width || el.style.width;
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) {
      const w = b.style.width;
      b.style.width = '0';
      b.dataset.width = w;
      observer.observe(b);
    });
  }
});
