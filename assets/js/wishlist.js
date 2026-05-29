// wishlist.js — Favoris iStore Pro (stockage localStorage)
const Wishlist = {
  KEY: 'istore_wishlist',

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  has(id) { return this.get().includes(String(id)); },

  toggle(id) {
    let list = this.get();
    const sid = String(id);
    if (list.includes(sid)) {
      list = list.filter(x => x !== sid);
    } else {
      list.push(sid);
    }
    localStorage.setItem(this.KEY, JSON.stringify(list));
    this.updateButtons(sid);
    return list.includes(sid);
  },

  updateButtons(id) {
    document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(btn => {
      const inList = this.has(id);
      btn.textContent   = inList ? '❤️' : '🤍';
      btn.title         = inList ? 'Retirer des favoris' : 'Ajouter aux favoris';
      btn.style.color   = inList ? '#ef4444' : '';
    });
  },

  initButtons() {
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      const id = btn.dataset.wishlist;
      this.updateButtons(id);
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const added = this.toggle(id);
        // Feedback visuel
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => btn.style.transform = '', 200);
        if (added) showToast('❤️ Ajouté aux favoris');
        else       showToast('🤍 Retiré des favoris');
      });
    });
  },

  getCount() { return this.get().length; },
};

// Toast notification
function showToast(msg, duration = 2000) {
  let t = document.getElementById('wishlistToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'wishlistToast';
    t.style.cssText = `
      position:fixed;top:80px;right:20px;z-index:9999;
      background:#1a1a1a;border:1px solid rgba(201,168,76,.4);border-radius:8px;
      padding:10px 18px;font-size:13px;color:#fff;
      box-shadow:0 4px 16px rgba(0,0,0,.5);
      opacity:0;transform:translateY(-8px);
      transition:opacity .25s,transform .25s;pointer-events:none;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1'; t.style.transform = 'translateY(0)';
  clearTimeout(t._tid);
  t._tid = setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(-8px)'; }, duration);
}

document.addEventListener('DOMContentLoaded', () => Wishlist.initButtons());

// Mettre à jour le compteur dans le header
function updateWishlistHeader() {
  const n   = Wishlist.getCount();
  const btn = document.getElementById('wishlistBtn');
  if (!btn) return;
  btn.textContent = n > 0 ? `❤️ ${n}` : '🤍';
  btn.style.color = n > 0 ? '#ef4444' : '';
}

// initButtons et updateWishlistHeader appelés via le DOMContentLoaded de chaque page

// Override toggle pour aussi mettre à jour le header
const _origToggle = Wishlist.toggle.bind(Wishlist);
Wishlist.toggle = function(id) {
  const result = _origToggle(id);
  updateWishlistHeader();
  return result;
};
