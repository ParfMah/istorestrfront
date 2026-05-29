// password-strength.js — iStore Pro
// Indicateur visuel de force du mot de passe

function initPasswordStrength(inputId, containerId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Créer le conteneur si pas déjà en HTML
  let wrap = document.getElementById(containerId);
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = containerId;
    input.parentNode.insertBefore(wrap, input.nextSibling);
  }

  wrap.innerHTML = `
    <div style="margin-top:6px;">
      <div style="display:flex;gap:4px;height:4px;border-radius:99px;overflow:hidden;">
        <div class="pwd-bar" style="flex:1;background:var(--border-light);border-radius:99px;transition:background .3s;"></div>
        <div class="pwd-bar" style="flex:1;background:var(--border-light);border-radius:99px;transition:background .3s;"></div>
        <div class="pwd-bar" style="flex:1;background:var(--border-light);border-radius:99px;transition:background .3s;"></div>
        <div class="pwd-bar" style="flex:1;background:var(--border-light);border-radius:99px;transition:background .3s;"></div>
      </div>
      <p class="pwd-label" style="font-size:11px;color:var(--text-muted);margin:4px 0 0;"></p>
    </div>`;

  const bars  = wrap.querySelectorAll('.pwd-bar');
  const label = wrap.querySelector('.pwd-label');

  const LEVELS = [
    { min:0,  color:'transparent', text:'' },
    { min:1,  color:'#ef4444',     text:'Trop court' },
    { min:2,  color:'#f97316',     text:'Faible' },
    { min:3,  color:'#eab308',     text:'Moyen' },
    { min:4,  color:'#22c55e',     text:'Fort ✓' },
  ];

  function score(pwd) {
    if (!pwd || pwd.length < 6) return 0;
    let s = 1;
    if (pwd.length >= 8)  s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 4);
  }

  input.addEventListener('input', () => {
    const s = score(input.value);
    const lvl = LEVELS[s] || LEVELS[0];
    bars.forEach((b, i) => {
      b.style.background = i < s ? lvl.color : 'var(--border-light)';
    });
    label.textContent = lvl.text;
    label.style.color = lvl.color || 'var(--text-muted)';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Inscription
  initPasswordStrength('regPassword', 'regPwdStrength');
  // Reset password
  initPasswordStrength('newPassword', 'newPwdStrength');
  // Changement depuis espace client
  initPasswordStrength('newPwd', 'newPwdStrength2');
});
