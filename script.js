$(document).ready(() => {
  // === Manejo del formulario de perfil ===
  $("#profileForm").on("submit", (e) => {
    e.preventDefault(); // Evita recargar la página

    const usuario = $("#usuario").val();
    const nombre = $("#nombre").val();
    const apellido = $("#apellido").val();

    if (usuario.trim() === "" || nombre.trim() === "" || apellido.trim() === "") {
      alert("Por favor, completa todos los campos");
      return;
    }

    mostrarMensajeExito();

    console.log("Datos del formulario:", {
      usuario: usuario,
      nombre: nombre,
      apellido: apellido,
    });
  });

  // === Manejo de la imagen de perfil ===
  $("#imageUpload").on("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        $("#profileImage").attr("src", e.target.result);
      };

      reader.readAsDataURL(file);
    }
  });

  // === Manejo del formulario de configuración ===
  $("#configForm").on("submit", (e) => {
    e.preventDefault();

    const nuevoMail = $("#nuevoMail").val().trim();

    if (nuevoMail === "") {
      alert("Por favor, ingresa un correo válido");
      return;
    }

    alert("Correo actualizado a: " + nuevoMail);
  });

  // === Manejo de eliminar cuenta ===
  $("#btnEliminarCuenta").on("click", () => {
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");

    if (confirmacion) {
      alert("Tu cuenta ha sido eliminada 🚫");
      // Aquí podrías poner una llamada AJAX al servidor para eliminar la cuenta
    }
  });

  // === Manejo de navegación lateral ===
  $(".sidebar a").on("click", function (e) {
    e.preventDefault();

    $(".sidebar a").removeClass("active");
    $(this).addClass("active");

    const texto = $(this).text().trim();

    if (texto === "Mi Perfil") {
      $("#seccion-perfil").removeClass("d-none");
      $("#seccion-configuracion").addClass("d-none");
    } else if (texto === "Configuración") {
      $("#seccion-configuracion").removeClass("d-none");
      $("#seccion-perfil").addClass("d-none");
    } else if (texto === "Cerrar Sesión") {
      alert("EN DESARROLLO");
    }
  });
});

// === Funciones auxiliares ===
function mostrarMensajeExito() {
  $("#successMessage").removeClass("d-none").addClass("d-block");
}

function limpiarFormulario() {
  $("#profileForm")[0].reset();
  $("#successMessage").removeClass("d-block").addClass("d-none");
  $("#profileImage").attr("src", "https://via.placeholder.com/150x150/cccccc/666666?text=Usuario");
  $("#imageUpload").val("");
}
