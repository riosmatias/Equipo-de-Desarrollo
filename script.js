$(document).ready(() => {
  // Manejar el envío del formulario
  $("#profileForm").on("submit", (e) => {
    e.preventDefault() // Evita que la página se recargue

    const usuario = $("#usuario").val()
    const nombre = $("#nombre").val()
    const apellido = $("#apellido").val()

    // Validar que todos los campos estén llenos
    if (usuario.trim() === "" || nombre.trim() === "" || apellido.trim() === "") {
      alert("Por favor, completa todos los campos")
      return
    }

    mostrarMensajeExito()

    console.log("Datos del formulario:", {
      usuario: usuario,
      nombre: nombre,
      apellido: apellido,
    })
  })

  $("#imageUpload").on("change", (e) => {
    const file = e.target.files[0]

    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido")
        return
      }

      // Crear un FileReader para leer el archivo
      const reader = new FileReader()

      reader.onload = (e) => {
        // Mostrar la imagen seleccionada
        $("#profileImage").attr("src", e.target.result)
      }

      // Leer el archivo como URL de datos
      reader.readAsDataURL(file)
    }
  })
})

function mostrarMensajeExito() {
  $("#successMessage").removeClass("d-none").addClass("d-block")
}

function limpiarFormulario() {
  $("#profileForm")[0].reset()
  $("#successMessage").removeClass("d-block").addClass("d-none")
  $("#profileImage").attr("src", "https://via.placeholder.com/150x150/cccccc/666666?text=Usuario")
  $("#imageUpload").val("")
}