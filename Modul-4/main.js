// Data Array Proyek Utama
let projects = [
  { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
  { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
  { id: 3, title: "Landing Page Profil Perusahaan", category: "Web App", budget: 1500000, completed: false },
  { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 4500000, completed: false }
];

let activeCategory = "Semua";
let searchQuery = "";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
};

const updateStats = () => {
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = projects.filter(item => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

const applyFilterAndRender = () => {
  let filtered = projects;

  if (activeCategory !== "Semua") {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim() !== "") {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  renderProjects(filtered);
};

const renderProjects = (dataList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (dataList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang sesuai.</p>";
    return;
  }

  container.innerHTML = dataList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h4>${proj.title}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div class="project-actions">
          <span class="badge ${badgeClass}">${statusText}</span>
          <button class="btn-action" onclick="toggleStatus(${proj.id})">Ubah Status</button>
          <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus</button>
        </div>
      </div>
    `;
  }).join("");
};

const handleAddProject = (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const budgetInput = document.getElementById("budget");
  const completedInput = document.getElementById("completed");

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const budget = parseFloat(budgetInput.value);
  const completed = completedInput.checked;


  if (!title || isNaN(budget) || budget <= 0) {
    alert("Mohon isi judul dan anggaran dengan benar!");
    return;
  }

 
  const newProject = {
    id: Date.now(),
    title,
    category,
    budget,
    completed
  };

  projects.push(newProject);

  document.getElementById("project-form").reset();

  updateStats();
  applyFilterAndRender();
};

window.toggleStatus = (id) => {
  projects = projects.map(proj => {
    if (proj.id === id) {
      return { ...proj, completed: !proj.completed };
    }
    return proj;
  });

  updateStats();
  applyFilterAndRender();
};

window.deleteProject = (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
    projects = projects.filter(proj => proj.id !== id);
    updateStats();
    applyFilterAndRender();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  applyFilterAndRender();

  document.getElementById("project-form").addEventListener("submit", handleAddProject);

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFilterAndRender();
  });

  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      activeCategory = e.target.getAttribute("data-category");
      applyFilterAndRender();
    });
  });
});