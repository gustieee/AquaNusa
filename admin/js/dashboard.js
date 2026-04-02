
(function () {
  function formatCurrency(value) {
    var formatted = new Intl.NumberFormat("id-ID").format(value || 0);
    return "Rp " + formatted;
  }

  function renderStats(products) {
    var totalEl = document.getElementById("statTotal");
    var ikanEl = document.getElementById("statIkan");
    var peralatanEl = document.getElementById("statPeralatan");
    var dekorasiEl = document.getElementById("statDekorasi");
    if (totalEl) totalEl.textContent = products.length;
    if (ikanEl) ikanEl.textContent = products.filter(function (p) { return p.category === "ikan"; }).length;
    if (peralatanEl) peralatanEl.textContent = products.filter(function (p) { return p.category === "peralatan"; }).length;
    if (dekorasiEl) dekorasiEl.textContent = products.filter(function (p) { return p.category === "dekorasi"; }).length;
  }
  function renderRecent(products) {
    var tbody = document.getElementById("recentProducts");
    if (!tbody) return;
    var lastFive = products.slice().sort(function (a, b) { return b.id - a.id; }).slice(0, 5);
    tbody.innerHTML = lastFive.map(function (product, index) {
      return [
        "<tr>",
        "<td>" + (index + 1) + "</td>",
        "<td>" + product.name + "</td>",
        "<td>" + product.category + "</td>",
        "<td>" + formatCurrency(product.price) + "</td>",
        "<td>Aktif</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var products = (window.AppData && window.AppData.products) || [];
    renderStats(products);
    renderRecent(products);
  });
})();
