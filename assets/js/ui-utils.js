// ui-utils.js — Bouton retour en haut + barre de recherche catalogue

// ── Back to top ───────────────────────────────────────────────
(function() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.style.cssText = `
    position:fixed;bottom:90px;right:24px;z-index:900;
    width:44px;height:44px;border-radius:50%;
    background:linear-gradient(135deg,#C9A84C,#F0C040);
    color:#000;font-size:1.2rem;font-weight:700;
    border:none;cursor:pointer;
    box-shadow:0 4px 16px rgba(201,168,76,0.35);
    opacity:0;transform:translateY(12px);
    transition:opacity .3s,transform .3s;
    display:flex;align-items:center;justify-content:center;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity   = show ? '1'    : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
})();

// ── Scroll reveal pour les sections ──────────────────────────
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function observeSections() {
    document.querySelectorAll('section:not(.hero):not(.features)').forEach(s => {
      if (s.style.opacity === '') {
        s.style.opacity    = '0';
        s.style.transform  = 'translateY(30px)';
        s.style.transition = 'opacity .55s ease, transform .55s ease';
        observer.observe(s);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
  } else {
    observeSections();
  }
})();
