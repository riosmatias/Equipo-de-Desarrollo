// Cerrar sesión.... Esto deberia estar en el nav bar!! ¬¬
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  Auth.logout();
  window.location.assign("../../login.html");
});

/* === ELEMENTOS DEL DOM === */
const inputImagen = document.getElementById("inputImagenPerfil");
const previewImagen = document.getElementById("previewImagenPerfil");
const btnEditarImg = document.getElementById("btnEditarImg");
const form = document.getElementById("profile-form");
const mensaje = document.getElementById("mensaje");

/* --- ABRIR EXPLORADOR AL CLICAR EL LÁPIZ --- */
btnEditarImg.addEventListener("click", () => {
  inputImagen.click();
});

/* --- MOSTRAR VISTA PREVIA DE LA IMAGEN --- */
inputImagen.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImagen.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

/* --- MOSTRAR / OCULTAR CONTRASEÑA --- */
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

/* --- CARGAR DATOS DEL USUARIO --- */
async function cargarDatosUsuario() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al traer datos del usuario");

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Error al traer datos del usuario");

    const user = data.user;

    // Rellenar inputs con los datos existentes
    document.getElementById("nickname").value = user.nickname || "";
    document.getElementById("nombre").value = user.nombre || "";
    document.getElementById("apellido").value = user.apellido || "";
    document.getElementById("email").value = user.email || "";

    // Imagen de perfil: si existe, mostrar; si no, default
    previewImagen.src = user.fotoPerfil
      ? `http://localhost:4000${user.fotoPerfil}`
      : "../../src/img/icons8-usuario-48.png";
  } catch (err) {
    console.error(err);
    previewImagen.src = "../../src/img/icons8-usuario-48.png";
  }
}

/* === GUARDAR CAMBIOS EN PERFIL === */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (password && password !== password2) {
    mensaje.textContent = "Las contraseñas no coinciden";
    mensaje.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("nickname", document.getElementById("nickname").value);
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("apellido", document.getElementById("apellido").value);
  formData.append("email", document.getElementById("email").value);
  if (password) formData.append("password", password);
  if (inputImagen.files[0]) formData.append("imagen", inputImagen.files[0]);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/profile/update", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.textContent = "Perfil actualizado correctamente.";
      mensaje.style.color = "green";

      // Actualizar imagen en pantalla si se subió una nueva
      if (data.user.fotoPerfil) {
        previewImagen.src = `http://localhost:4000${data.user.fotoPerfil}`;
      }
    } else {
      mensaje.textContent = data.error || "Error al actualizar perfil.";
      mensaje.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    mensaje.textContent = "Error de conexión con el servidor.";
    mensaje.style.color = "red";
  }
});

/* === INICIALIZAR DATOS AL CARGAR PAGINA === */
cargarDatosUsuario();

/* === Modal eliminar perfil === */
const btnEliminar = document.querySelector(".btn_eliminar");
const modalEliminar = document.getElementById("modalEliminar");
const btnCancelEliminar = document.getElementById("btnCancelEliminar");
const btnConfirmEliminar = document.getElementById("btnConfirmEliminar");

btnEliminar.addEventListener("click", () => {
  console.log('modal "abierto"')
  modalEliminar.style.display = "flex";
});

btnCancelEliminar.addEventListener("click", () => {
  modalEliminar.style.display = "none";
});

// Confirmar eliminación
btnConfirmEliminar.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/profile/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Perfil eliminado correctamente.");
      localStorage.removeItem("token");
      window.location.assign("../../login.html");
    } else {
      alert(data.error || "Error al eliminar el perfil.");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor.");
  }
});
