const form = document.getElementById("profile-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nickname = document.getElementById("nickname").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();

  console.log(nickname, nombre, apellido, email); //ok leo bien los datos.
  if (!nickname || !nombre || !apellido) {
    mensaje.textContent = "Por favor, completá todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  // Datos xa enviar
  const datosUsuario = { nickname, nombre, apellido };

  try {
    //NECESITO LA RUTA DEL BACK Y VER COMO QUEDARON LAS TABLAS...
    const respuesta = await fetch(
      "http://localhost:3000/api/usuarios/actualizar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
      }
    );

    if (respuesta.ok) {
      mensaje.textContent = "Perfil actualizado correctamente";
      mensaje.style.color = "green";
    } else {
      mensaje.textContent = "Error al actualizar el perfil";
      mensaje.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
  }
});



// Mandar aca los pasos para eliminar perfil 