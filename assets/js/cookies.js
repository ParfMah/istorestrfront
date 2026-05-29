// cookies.js — Bandeau RGPD iStore Pro
(function() {
  const KEY = 'istore_cookie_consent';

  // Déjà accepté/refusé ? → ne rien afficher
  if (localStorage.getItem(KEY)) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;z-index:10000;
      background:#141414;border-top:2px solid rgba(201,168,76,0.4);
      padding:18px 24px;display:flex;flex-wrap:wrap;align-items:center;
      gap:16px;box-shadow:0 -4px 24px rgba(0,0,0,0.6);
      font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      animation:slideUp .35s ease;
    " id="cookieBannerInner">
      <style>@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}</style>
      <div style="flex:1;min-width:260px;">
        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">🍪 Gestion des cookies</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6;">
          Nous utilisons des cookies strictement nécessaires au fonctionnement du site (authentification, session).
          Aucun cookie publicitaire ou traceur tiers n'est utilisé.
          <a href="politique-confidentialite.html" style="color:#C9A84C;text-decoration:underline;">En savoir plus</a>
        </p>
      </div>
      <div style="display:flex;gap:10px;flex-shrink:0;">
        <button id="cookieReject" style="
          padding:9px 18px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);
          background:none;color:rgba(255,255,255,0.6);font-size:12px;cursor:pointer;
          font-family:inherit;transition:all .2s;
        " onmouseover="this.style.borderColor='#C9A84C';this.style.color='#C9A84C';"
           onmouseout="this.style.borderColor='rgba(255,255,255,0.2)';this.style.color='rgba(255,255,255,0.6)';">
          Nécessaires seulement
        </button>
        <button id="cookieAccept" style="
          padding:9px 20px;border-radius:6px;border:none;
          background:linear-gradient(135deg,#C9A84C,#F0C040);
          color:#000;font-size:12px;font-weight:700;cursor:pointer;
          font-family:inherit;transition:opacity .2s;
        " onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
          ✓ Accepter
        </button>
      </div>
    </div>`;

  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem(KEY, choice);
    const el = document.getElementById('cookieBannerInner');
    if (el) { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => banner.remove(), 300); }
  }

  document.getElementById('cookieAccept').onclick = () => dismiss('accepted');
  document.getElementById('cookieReject').onclick  = () => dismiss('necessary');
})();
