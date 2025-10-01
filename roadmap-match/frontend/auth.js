// frontend/auth.js — Cliente de API con JWT para Roadmap & match

// ⚙️ Ajustá esto si tu backend no corre en localhost:4000
const API_BASE = "http://localhost:4000/api";
const TOKEN_KEY = "rm_token";

const Auth = (() => {
  /* ============ Helpers token ============ */
  const getToken  = () => localStorage.getItem(TOKEN_KEY);
  const setToken  = (t) => localStorage.setItem(TOKEN_KEY, t);
  const clearToken= () => localStorage.removeItem(TOKEN_KEY);

  function authHeaders(extra = {}) {
    const token = getToken();
    return {
      ...extra,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  /* ============ Endpoints ============ */

  // POST /api/auth/register -> { token, user }
  async function signup(email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en registro");
    setToken(data.token);
    return data;
  }

  // POST /api/auth/login -> { token, user }
  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en login");
    setToken(data.token);
    return data;
  }

  // POST /api/auth/reset-password -> { ok: true }
  async function resetPassword(email, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo restablecer la contraseña");
    return data;
  }

  // GET /api/auth/me (requiere Authorization: Bearer <token>) -> { user }
  async function me() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No autorizado");
    return data.user;
  }

  /* ============ Estado de sesión ============ */
  function isLoggedIn() { return !!getToken(); }
  function logout()     { clearToken(); }

  return { signup, login, resetPassword, me, isLoggedIn, logout, getToken };
})();
