const carreras = [
  { nombre: "Ciencia de datos e inteligencia artificial", empleabilidad: 95, detalle: "Alta demanda ...." },
  { nombre: "Desarrollo de software", empleabilidad: 88, detalle: "Claves para backend y análisis de datos" },
  { nombre: "Diseño de Interfaces", empleabilidad: 81, detalle: "Muy buscado en UX/UI y productos digitales" },
  { nombre: "Redes", empleabilidad: 72, detalle: "Importante en infraestructura y seguridad" },
  { nombre: "Desarrollo de video juegos", empleabilidad: 60, detalle: "puede ser un terciario o licenciatura" }
];

const chart = document.getElementById("chart");
const tooltip = document.getElementById("tooltip");

// Crear las barras dinámicamente
carreras.forEach(carrera => {
  const row = document.createElement("div");
  row.classList.add("bar-row");

  const label = document.createElement("span");
  label.classList.add("bar-label");
  label.textContent = carrera.nombre;

  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.width = carrera.empleabilidad + "%";

  const value = document.createElement("span");
  value.classList.add("bar-value");
  value.textContent = `${carrera.empleabilidad}%`;
  

  row.appendChild(label);
  row.appendChild(bar);
  row.appendChild(value);
  chart.appendChild(row);

  // Tooltip dinámico
  bar.addEventListener("mousemove", e => {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
    tooltip.textContent = `${carrera.nombre}: ${carrera.detalle} (${carrera.empleabilidad}%)`;
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY - 20 + "px";
  });

  bar.addEventListener("mouseleave", () => {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
  });
});


