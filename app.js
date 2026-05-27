/* ══════════════════════════════════════════
   LEAD POPUP — show on first visit
══════════════════════════════════════════ */
(function () {
  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;
  if (localStorage.getItem('rr_lead_submitted')) {
    overlay.classList.add('hidden');
  }
})();

function submitLead(e) {
  e.preventDefault();
  const name  = document.getElementById('lead-name').value.trim();
  const phone = document.getElementById('lead-phone').value.trim();
  if (!name || !/^\d{10}$/.test(phone)) {
    alert('Please enter your name and a valid 10-digit mobile number.');
    return;
  }
  const lead = { name, phone: '+91' + phone, ts: new Date().toISOString() };
  const existing = JSON.parse(localStorage.getItem('rr_leads') || '[]');
  existing.push(lead);
  localStorage.setItem('rr_leads', JSON.stringify(existing));
  localStorage.setItem('rr_lead_submitted', '1');
  document.getElementById('lead-overlay').classList.add('hidden');
}

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
   CONTACT FORM
══════════════════════════════════════════ */
function submitContact(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  if (!form) return;

  const name    = form.querySelector('#c-name').value.trim();
  const phone   = form.querySelector('#c-phone').value.trim();
  const service = form.querySelector('#c-service').value;
  const msg     = form.querySelector('#c-message').value.trim();

  if (!name || phone.length < 10) {
    alert('Please enter your name and a valid phone number.');
    return;
  }

  const entry = { name, phone, service, msg, ts: new Date().toISOString() };
  const all = JSON.parse(localStorage.getItem('rr_contacts') || '[]');
  all.push(entry);
  localStorage.setItem('rr_contacts', JSON.stringify(all));

  form.reset();
  const msg_el = document.getElementById('contact-success');
  if (msg_el) {
    msg_el.style.display = 'block';
    setTimeout(function () { msg_el.style.display = 'none'; }, 5000);
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
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
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
