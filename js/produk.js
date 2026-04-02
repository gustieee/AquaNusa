(function () {
  var productGrid = document.getElementById("productGrid");
  var resultInfo = document.getElementById("productResultInfo");
  var sortSelect = document.getElementById("sortSelect");
  var categoryInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="category"]'));
  if (!productGrid || !window.CartUI) return;

  var state = { categories: ["semua"], sort: "terbaru" };

  function formatInfo(count) {
    if (state.categories.indexOf("semua") !== -1 || !state.categories.length) {
      return "Menampilkan " + count + " produk premium untuk kebutuhan aquarium Anda.";
    }
    return "Menampilkan " + count + " produk dalam kategori " + state.categories.join(", ") + ".";
  }

  function getFilteredProducts() {
    var products = window.CartUI.getProductsData().slice();
    if (state.categories.length && state.categories.indexOf("semua") === -1) {
      products = products.filter(function (product) { return state.categories.indexOf(product.category) !== -1; });
    }
    switch (state.sort) {
      case "harga-rendah": products.sort(function (a, b) { return a.price - b.price; }); break;
      case "harga-tinggi": products.sort(function (a, b) { return b.price - a.price; }); break;
      case "populer": products.sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); }); break;
      default: products.sort(function (a, b) { return b.id - a.id; }); break;
    }
    return products;
  }

  function renderProducts() {
    var products = getFilteredProducts();
    productGrid.innerHTML = products.map(function (product) { return window.CartUI.createProductCard(product); }).join("");
    resultInfo.textContent = formatInfo(products.length);
    window.CartUI.bindAddToCartButtons(productGrid);
    document.querySelectorAll("#productGrid .fade-in").forEach(function (card) { card.classList.add("is-visible"); });
  }

  function syncCheckboxes(selected) {
    categoryInputs.forEach(function (input) { input.checked = selected.indexOf(input.value) !== -1; });
  }

  function setCategoryFromHash() {
    var categoryFromHash = window.location.hash.replace("#", "").toLowerCase();
    if (["ikan", "peralatan", "dekorasi"].indexOf(categoryFromHash) !== -1) {
      state.categories = [categoryFromHash];
      syncCheckboxes(state.categories);
      renderProducts();
    }
  }

  categoryInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      if (input.value === "semua") {
        state.categories = ["semua"];
      } else {
        state.categories = categoryInputs.filter(function (checkbox) {
          return checkbox.value !== "semua" && checkbox.checked;
        }).map(function (checkbox) { return checkbox.value; });
        if (!state.categories.length) state.categories = ["semua"];
      }
      syncCheckboxes(state.categories);
      renderProducts();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", function (event) {
      state.sort = event.target.value;
      renderProducts();
    });
  }

  renderProducts();
  setCategoryFromHash();
})();
