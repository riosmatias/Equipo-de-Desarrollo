let jobsData = [];
let filteredJobs = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("../../data/jobsData.json"); // cargo el json.
    jobsData = await response.json();
    filteredJobs = [...jobsData];

    renderJobs(jobsData);
    updateJobsCount();
  } catch (error) {
    console.error("Error al cargar los datos de empleos:", error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  renderJobs(jobsData);
  updateJobsCount();
});

function renderJobs(jobs) {
  const grid = document.getElementById("jobsGrid");

  if (jobs.length === 0) {
    grid.innerHTML = `
          <div class="no-results">
            <h3>No se encontraron empleos</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        `;
    return;
  }

  grid.innerHTML = jobs
    .map(
      (job) => `
        <div class="job-card" onclick="openModal(${job.id})">
          <div class="job-header">
            <div class="job-info">
              <div class="job-company">${job.company}</div>
              <h3 class="job-title">${job.title}</h3>
              <div class="job-location">📍 ${job.location}</div>
            </div>
            <div class="job-salary">${job.salary}</div>
          </div>
          <p class="job-description">${job.description}</p>
          <div class="job-tags">
            ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <div class="job-footer">
            <div class="job-meta">
            
              <span class="job-type ${job.mode}">${job.type}</span>
              <span class="job-type ${job.mode}">${job.mode}</span>
              <span>⏰ ${job.posted}</span>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function filterJobs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;
  const type = document.getElementById("typeFilter").value;

  filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
    const matchesLocation = !location || job.location === location;
    const matchesType = !type || job.type === type;

    return matchesSearch && matchesLocation && matchesType;
  });

  renderJobs(filteredJobs);
  updateJobsCount();
}

function sortJobs() {
  const sortValue = document.getElementById("sortSelect").value;

  if (sortValue === "recent") {
    filteredJobs = [...filteredJobs].sort((a, b) => b.id - a.id);
  } else if (sortValue === "salary-high") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const salaryA = parseInt(
        a.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[1] ||
          a.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[0]
      );
      const salaryB = parseInt(
        b.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[1] ||
          b.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[0]
      );
      return salaryB - salaryA;
    });
  } else if (sortValue === "salary-low") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const salaryA = parseInt(
        a.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[0]
      );
      const salaryB = parseInt(
        b.salary.replace(/[^0-9]/g, "").match(/\d{5,}/g)[0]
      );
      return salaryA - salaryB;
    });
  } else if (sortValue === "older") {
    filteredJobs = [...filteredJobs].sort((a, b) => a.id - b.id);
  }

  renderJobs(filteredJobs);
}

function updateJobsCount() {
  document.getElementById("totalJobs").textContent = jobsData.length;
  document.getElementById(
    "jobsCount"
  ).textContent = `Mostrando ${filteredJobs.length} empleos`;
}
// *.*.*.* MODAL *.*.*.*
function openModal(jobId) {
  const job = jobsData.find((j) => j.id === jobId);
  if (!job) return;

  document.getElementById("modalTitle").textContent = job.title;
  document.getElementById("modalCompany").textContent = job.company;

  document.getElementById("modalBody").innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <span class="job-type ${job.mode}">${job.type}</span>
            <span style="color: var(--muted);">📍 ${job.location}</span>
            <span style="color: var(--primary); font-weight: 600;">${
              job.salary
            }</span>
          </div>
          <div style="color: var(--muted); font-size: 0.9rem;">⏰ Publicado ${
            job.posted
          }</div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--text); margin-bottom: 0.5rem;">Descripción</h3>
          <p style="color: var(--muted); line-height: 1.6;">${
            job.description
          }</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--text); margin-bottom: 0.5rem;">Requisitos</h3>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${job.requirements.map((req) => `<li>${req}</li>`).join("")}
          </ul>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--text); margin-bottom: 0.5rem;">Beneficios</h3>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${job.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
          </ul>
        </div>

        <div>
          <h3 style="color: var(--text); margin-bottom: 0.5rem;">Habilidades requeridas</h3>
          <div class="job-tags">
            ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </div>
      `;

  document.getElementById("jobModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("jobModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

function applyJob() {
  let timerInterval;
  Swal.fire({
    title: "Éxito!",
    text: "Aplico a la oferta!",

    timer: 2000,
    timerProgressBar: false,
    theme: "dark",
    icon: "success",
    showConfirmButton: false,
    didOpen: () => {
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });

  closeModal();
}

document.getElementById("jobModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Permitir que se busque apretando ENTER
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      filterJobs();
    }
  });
