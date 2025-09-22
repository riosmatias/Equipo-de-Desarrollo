if (Auth.isLoggedIn()) {
  window.location.replace('index.html');
}

let mode = 'login';
const form = document.getElementById('authForm');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const msgEl = document.getElementById('msg');
const toggle = document.getElementById('toggleMode');
const titleEl = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

function setMode(next) {
  mode = next;
  if (mode === 'login') {
    titleEl.textContent = 'Ingresá';
    submitBtn.textContent = 'INGRESAR';
    toggle.textContent = 'Crear cuenta';
  } else {
    titleEl.textContent = 'Crear cuenta';
    submitBtn.textContent = 'REGISTRARME';
    toggle.textContent = 'Ya tengo cuenta';
  }
  msgEl.textContent = '';
}

toggle.addEventListener('click', (e) => {
  e.preventDefault();
  setMode(mode === 'login' ? 'signup' : 'login');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgEl.textContent = '';
  const email = emailEl.value.trim().toLowerCase();
  const password = passEl.value;

  if (!email || !password) {
    msgEl.textContent = 'Completá email y contraseña.';
    return;
  }
  if (password.length < 6) {
    msgEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  try {
    if (mode === 'signup') {
      await Auth.signup(email, password);
    } else {
      await Auth.login(email, password);
    }
    window.location.href = 'index.html';
  } catch (err) {
    msgEl.textContent = err.message || 'Ocurrió un error';
  }
});
