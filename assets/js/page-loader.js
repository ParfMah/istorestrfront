// page-loader.js — iStore Pro — Dark Luxury
(function () {
  const isAdmin = document.currentScript
    ? document.currentScript.src.includes('/admin/')
    : window.location.pathname.includes('/admin/');

  const assetPath = isAdmin ? '../assets/images/' : 'assets/images/';

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
    #pl{
      position:fixed;inset:0;z-index:999999;
      display:flex;align-items:center;justify-content:center;
      background:#080808;
      transition:opacity .35s ease, visibility .35s ease;
    }
    #pl.pl-out{opacity:0;visibility:hidden;pointer-events:none;}
    .pl-wrap{
      display:flex;flex-direction:column;align-items:center;gap:18px;
      animation:plIn .35s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes plIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}

    /* Anneau tournant */
    .pl-ring-wrap{position:relative;width:84px;height:84px;}
    .pl-icon-img{
      position:absolute;inset:0;margin:auto;
      width:50px;height:50px;
      filter:drop-shadow(0 0 14px rgba(201,168,76,.55));
    }
    .pl-svg{position:absolute;inset:0;width:84px;height:84px;transform:rotate(-90deg);}
    .pl-track{fill:none;stroke:rgba(255,255,255,.05);stroke-width:3;}
    .pl-arc{
      fill:none;stroke:url(#plg);stroke-width:3;stroke-linecap:round;
      stroke-dasharray:55 175;
      animation:plSpin .85s cubic-bezier(0.4,0,0.2,1) infinite;
    }
    @keyframes plSpin{
      0%  {stroke-dashoffset:0;}
      100%{stroke-dashoffset:-230;}
    }

    /* Texte */
    .pl-name{
      font-family:'Oswald','Arial Narrow',Arial,sans-serif;
      font-size:22px;font-weight:700;letter-spacing:.12em;
      text-transform:uppercase;
      background:linear-gradient(135deg,#fff 20%,#C9A84C 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;
    }
    .pl-sub{
      font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      font-size:10px;color:rgba(201,168,76,.5);
      letter-spacing:.22em;text-transform:uppercase;
      margin-top:-10px;
    }

    /* Barre de progression en bas */
    .pl-bar{
      position:fixed;bottom:0;left:0;right:0;height:2px;
      background:rgba(255,255,255,.04);
    }
    .pl-bar-fill{
      height:100%;width:0;
      background:linear-gradient(90deg,#C9A84C,#F0C040,#0071E3);
      animation:plBar .7s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes plBar{
      0%  {width:0%;}
      60% {width:75%;}
      100%{width:100%;}
    }
  `;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'pl';
  el.innerHTML = `
    <div class="pl-wrap">
      <div class="pl-ring-wrap">
        <img class="pl-icon-img" src="${assetPath}logo-icon.svg" alt="iStore Pro"
             onerror="this.style.display='none'"/>
        <svg class="pl-svg" viewBox="0 0 84 84">
          <defs>
            <linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stop-color="#F0C040"/>
              <stop offset="60%"  stop-color="#C9A84C"/>
              <stop offset="100%" stop-color="#0071E3"/>
            </linearGradient>
          </defs>
          <circle class="pl-track" cx="42" cy="42" r="38"/>
          <circle class="pl-arc"   cx="42" cy="42" r="38"/>
        </svg>
      </div>
      <div class="pl-name">iStore Pro</div>
      <div class="pl-sub">Spécialiste iPhone</div>
    </div>
    <div class="pl-bar"><div class="pl-bar-fill"></div></div>
  `;

  // Injecter dans le body dès que possible
  function inject() {
    if (document.body) {
      document.body.appendChild(el);
    } else {
      document.addEventListener('DOMContentLoaded', () => document.body.appendChild(el));
    }
  }
  inject();

  // Disparition intelligente
  const START   = Date.now();
  const MIN_MS  = 380;   // minimum visible
  const MAX_MS  = 800;   // maximum absolu

  function hide() {
    const elapsed   = Date.now() - START;
    const remaining = Math.max(0, MIN_MS - elapsed);
    setTimeout(() => {
      el.classList.add('pl-out');
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
    }, remaining);
  }

  // Écouter le chargement complet
  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
  }

  // Timeout absolu
  setTimeout(hide, MAX_MS);
})();
