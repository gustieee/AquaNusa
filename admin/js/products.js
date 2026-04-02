
var currentCategory = "semua";
var searchQuery = "";

function getBadgeClass(category) {
  if (category === "ikan") return "badge-ikan";
  if (category === "peralatan") return "badge-peralatan";
  if (category === "dekorasi") return "badge-dekorasi";
  return "";
}

function renderProducts(list) {
  var tbody = document.getElementById("products-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  list.forEach(function (p, i) {
    var imageSrc = p.image || "";
    var stockValue = (p.stock === 0 || p.stock) ? p.stock : "-";
    var stockClass = (typeof p.stock === "number" && p.stock < 5) ? "stock-low" : "";
    tbody.innerHTML += "<tr>" +
      "<td class=\"row-muted\">" + (i + 1) + "</td>" +
      "<td>" +
        "<img class=\"table-image\" src=\"" + imageSrc + "\" alt=\"" + (p.name || "Produk") + "\" onerror=\"this.replaceWith(document.createTextNode('🐟'))\">" +
      "</td>" +
      "<td>" + p.name + "</td>" +
      "<td><span class=\"category-badge " + getBadgeClass(p.category) + "\">" + p.category + "</span></td>" +
      "<td class=\"price-teal\">Rp " + Number(p.price || 0).toLocaleString("id-ID") + "</td>" +
      "<td class=\"" + stockClass + "\">" + stockValue + "</td>" +
      "</tr>";
  });
}
function filterAndRender() {
  var list = (window.AppData && window.AppData.products) ? window.AppData.products.slice() : [];

  if (currentCategory !== "semua") {
    list = list.filter(function (p) { return p.category === currentCategory; });
  }

  if (searchQuery) {
    list = list.filter(function (p) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  renderProducts(list);
}

document.querySelectorAll(".filter-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
    this.classList.add("active");
    currentCategory = this.dataset.category || "semua";
    filterAndRender();
  });
});

var searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchQuery = this.value;
    filterAndRender();
  });
}
document.addEventListener("DOMContentLoaded", function () {
  filterAndRender();

  var modal = document.getElementById("productModal");
  var openBtn = document.getElementById("addProductBtn");
  var closeBtn = document.getElementById("modalClose");
  var cancelBtn = document.getElementById("modalCancel");
  var saveBtn = document.getElementById("modalSave");

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (saveBtn) saveBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }
});
