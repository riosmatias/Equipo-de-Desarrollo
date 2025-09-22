// auth.js — utilidades simples de autenticación usando LocalStorage
// NOTA: Esto es solo para prototipos. No usar en producción.

const Auth = (() => {
  const USERS_KEY = 'rm_users';       // lista de usuarios { email, passHash }
  const SESSION_KEY = 'rm_session';   // { email }

  async function sha256(text){
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function loadUsers(){
    try{ return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch{ return []; }
  }
  function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setSession(email){
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  }
  function clearSession(){
    localStorage.removeItem(SESSION_KEY);
  }
  function getSession(){
    try{ return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch{ return null; }
  }

  async function signup(email, password){
    const users = loadUsers();
    if(users.find(u => u.email === email)){
      throw new Error('Ese email ya está registrado.');
    }
    const passHash = await sha256(password);
    users.push({ email, passHash });
    saveUsers(users);
    setSession(email);
    return { ok: true };
  }

  async function login(email, password){
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if(!user) throw new Error('No existe una cuenta con ese email.');
    const passHash = await sha256(password);
    if(user.passHash !== passHash) throw new Error('Contraseña incorrecta.');
    setSession(email);
    return { ok: true };
  }

  function logout(){ clearSession(); }
  function isLoggedIn(){ return !!getSession(); }

  return { signup, login, logout, isLoggedIn, getSession };
})();
