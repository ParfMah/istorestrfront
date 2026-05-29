// api.js — iStore Pro
// URL automatique : local en dev, Render en production

const API_URL = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) ? 'http://localhost:5000/api'
  : 'https://istorestrback.onrender.com/api';

// ── Intercepteur global 401 (token expiré) ────────────────────
function _handle401() {
  // Nettoyer la session
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Ne pas rediriger si on est déjà sur connexion/vérification
  const here = window.location.pathname.split('/').pop();
  const open  = ['connexion.html','verify-email.html','mot-de-passe-oublie.html','reset-password.html','index.html','catalogue.html','a-propos.html','contact.html','faq.html','suivi.html','comparateur.html','simulation.html','favoris.html','produit.html','maintenance.html','404.html'];
  if (!open.includes(here)) {
    window.location.href = '/connexion.html?expired=1';
  }
}

const API = {

  // ── Construit les headers, toujours avec le token si présent ─
  _headers(auth = true) {
    const h = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  // ── Traitement centralisé de la réponse ───────────────────────
  async _handle(res) {
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      _handle401();
      // data.message peut être un objet si le rate-limiter renvoie { message: {...} }
      const rawMsg = data.message;
      const msgStr = typeof rawMsg === 'string' ? rawMsg : (rawMsg?.message || 'Session expirée. Veuillez vous reconnecter.');
      const err = new Error(msgStr);
      Object.assign(err, data);
      err.message = msgStr; // garantit que .message reste une chaîne
      throw err;
    }

    if (!res.ok) {
      const rawMsg = data.message;
      const msgStr = typeof rawMsg === 'string' ? rawMsg : (rawMsg?.message || `Erreur ${res.status}`);
      const err = new Error(msgStr);
      Object.assign(err, data); // transmet unverified, expired, email, etc.
      err.message = msgStr; // garantit que .message reste une chaîne après Object.assign
      throw err;
    }

    return data;
  },

  // ── Vérifier si le backend est disponible ─────────────────────
  async isOnline() {
    try {
      const r = await Promise.race([
        fetch(`${API_URL}/health`),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 3000))
      ]);
      return r.ok;
    } catch { return false; }
  },

  // ── CRUD ──────────────────────────────────────────────────────
  async get(path, auth = true) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: this._headers(auth)
    });
    return this._handle(res);
  },

  async post(path, body, auth = true) {
    const res = await fetch(`${API_URL}${path}`, {
      method : 'POST',
      headers: this._headers(auth),
      body   : JSON.stringify(body)
    });
    return this._handle(res);
  },

  async put(path, body, auth = true) {
    const res = await fetch(`${API_URL}${path}`, {
      method : 'PUT',
      headers: this._headers(auth),
      body   : JSON.stringify(body)
    });
    return this._handle(res);
  },

  async patch(path, body, auth = true) {
    const res = await fetch(`${API_URL}${path}`, {
      method : 'PATCH',
      headers: this._headers(auth),
      body   : JSON.stringify(body)
    });
    return this._handle(res);
  },

  async delete(path, auth = true) {
    const res = await fetch(`${API_URL}${path}`, {
      method : 'DELETE',
      headers: this._headers(auth)
    });
    return this._handle(res);
  }
};
