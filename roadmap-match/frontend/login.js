// frontend/login.js
if (Auth.isLoggedIn()) window.location.replace('index.html');

let mode = 'login';
const form = document.getElementById('authForm');
const emailEl = document.getElementById('email');
const passEl  = document.getElementById('password');
const msgEl   = document.getElementById('msg');
const toggle  = document.getElementById('toggleMode');
const submitBtn = document.getElementById('submitBtn');
const titleEl = document.getElementById('formTitle');

const emailHint = document.getElementById('emailHint');
const passHint  = document.getElementById('passwordHint');

const forgotBtn   = document.getElementById('forgotBtn');
const modal       = document.getElementById('resetModal');
const resetForm   = document.getElementById('resetForm');
const resetEmail  = document.getElementById('resetEmail');
const resetPass   = document.getElementById('resetPass');
const resetPass2  = document.getElementById('resetPass2');
const resetMsg    = document.getElementById('resetMsg');
const cancelReset = document.getElementById('cancelReset');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRe  = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

function show(e){ e && (e.style.display=''); }
function hide(e){ e && (e.style.display='none'); }

function setMode(next){
  mode = next;
  if(mode==='login'){ titleEl.textContent='Ingresá'; submitBtn.textContent='INGRESAR'; toggle.textContent='Crear cuenta'; hide(passHint); }
  else { titleEl.textContent='Crear cuenta'; submitBtn.textContent='REGISTRARME'; toggle.textContent='Ya tengo cuenta'; show(passHint); }
  msgEl.textContent='';
}
toggle.addEventListener('click', e=>{ e.preventDefault(); setMode(mode==='login'?'signup':'login'); });

emailEl.addEventListener('input', ()=>{
  if(!emailEl.value) return hide(emailHint);
  emailRe.test(emailEl.value.trim().toLowerCase()) ? hide(emailHint) : show(emailHint);
});
passEl.addEventListener('input', ()=>{
  if(mode==='login') return hide(passHint);
  if(!passEl.value) return show(passHint);
  passRe.test(passEl.value) ? hide(passHint) : show(passHint);
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault(); msgEl.textContent='';
  const email = emailEl.value.trim().toLowerCase();
  const password = passEl.value;

  if(!emailRe.test(email)){ msgEl.textContent='Ingresá un correo válido.'; return; }
  if(mode==='signup' && !passRe.test(password)){
    msgEl.textContent='Contraseña alfanumérica 8–12 (mínimo 1 letra y 1 número).'; return;
  }
  if(mode==='login' && !password){ msgEl.textContent='Ingresá tu contraseña.'; return; }

  try{
    if(mode==='signup') await Auth.signup(email, password);
    else await Auth.login(email, password);
    window.location.href='index.html';
  }catch(err){ msgEl.textContent = err.message || 'Ocurrió un error'; }
});

/* ——— Olvidé mi contraseña (modal) ——— */
function openModal(){ resetForm.reset(); resetMsg.textContent=''; resetEmail.value=emailEl.value.trim().toLowerCase(); modal.style.display='block'; modal.setAttribute('aria-hidden','false'); resetEmail.focus(); }
function closeModal(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }

forgotBtn?.addEventListener('click', openModal);
cancelReset?.addEventListener('click', closeModal);
modal?.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.getAttribute('aria-hidden')==='false') closeModal(); });

resetForm?.addEventListener('submit', async (e)=>{
  e.preventDefault(); resetMsg.textContent='';
  const email = resetEmail.value.trim().toLowerCase();
  const p1 = resetPass.value, p2 = resetPass2.value;

  if(!emailRe.test(email)){ resetMsg.textContent='Correo inválido.'; return; }
  if(!passRe.test(p1)){ resetMsg.textContent='Contraseña alfanumérica 8–12 (mínimo 1 letra y 1 número).'; return; }
  if(p1!==p2){ resetMsg.textContent='Las contraseñas no coinciden.'; return; }

  try{ await Auth.resetPassword(email, p1); closeModal(); msgEl.textContent='Contraseña actualizada. Ingresá con la nueva.'; }
  catch(err){ resetMsg.textContent = err.message || 'No se pudo restablecer la contraseña.'; }
});

setMode('login');
