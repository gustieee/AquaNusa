(function () {
  var STORAGE_KEY = "aquarium_cart";
  var SHIPPING_ESTIMATE = 35000;
  var WHATSAPP_NUMBER = "6285894980615";

  function getProducts() {
    var base = (window.AppData && window.AppData.products) || [];
    try {
      var overrideRaw = localStorage.getItem("aqua_products");
      if (!overrideRaw) return base;
      var override = JSON.parse(overrideRaw);
      return Array.isArray(override) ? override : base;
    } catch (err) {
      return base;
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(id) {
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === id; });
    if (existing) existing.qty += 1;
    else cart.push({ id: id, qty: 1 });
    saveCart(cart);
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(function (item) { return item.id !== id; }));
    renderCartPage();
  }

  function updateQty(id, qty) {
    var cart = getCart();
    var item = cart.find(function (entry) { return entry.id === id; });
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
    renderCartPage();
  }

  function clearCart() {
    saveCart([]);
    renderCartPage();
  }

  function getCartDetails() {
    var products = getProducts();
    return getCart().map(function (item) {
      var product = products.find(function (entry) { return entry.id === item.id; });
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
        subtotal: product.price * item.qty
      };
    }).filter(Boolean);
  }

  function updateCartBadge() {
    var count = getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (badge) {
      badge.textContent = String(count);
    });
  }

  function createProductCard(product) {
    return [
      '<article class="product-card fade-in is-visible">',
      '<div class="product-media">',
      '<img src="' + product.image + '" alt="' + product.name + '">',
      '<span class="product-badge product-badge--' + product.category + '">' + product.category + '</span>',
      '</div>',
      '<h3>' + product.name + '</h3>',
      '<p>' + product.description + '</p>',
      '<div class="price-row">',
      '<span class="price">' + formatCurrency(product.price) + '</span>',
      '<span class="stock">Stok ' + product.stock + '</span>',
      '</div>',
      '<button class="button button-primary button-full btn-ripple" type="button" data-add-to-cart="' + product.id + '">Tambah ke Keranjang</button>',
      '</article>'
    ].join("");
  }

  function bindAddToCartButtons(scope) {
    (scope || document).querySelectorAll("[data-add-to-cart]").forEach(function (button) {
      if (button.dataset.cartBound === "true") return;
      button.dataset.cartBound = "true";
      button.addEventListener("click", function (event) {
        addToCart(Number(button.getAttribute("data-add-to-cart")));
        if (window.CartAnimation) {
          window.CartAnimation.createRipple(button, event);
          window.CartAnimation.buttonFeedback(button);
          window.CartAnimation.flyToCart(button);
          window.CartAnimation.particleBurst(button);
        }
      });
    });
  }

  function generateWhatsAppLink(items, total) {
    var lines = ["Halo Aquarium Nusa, saya ingin checkout pesanan berikut:", ""];
    items.forEach(function (item, index) {
      lines.push((index + 1) + ". " + item.name + " x" + item.qty + " - " + formatCurrency(item.subtotal));
    });
    lines.push("");
    lines.push("Total: " + formatCurrency(total));
    lines.push("Mohon info langkah selanjutnya. Terima kasih.");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function renderCartPage() {
    var cartContent = document.getElementById("cartContent");
    if (!cartContent) return;

    var subtotalValue = document.getElementById("subtotalValue");
    var shippingValue = document.getElementById("shippingValue");
    var totalValue = document.getElementById("totalValue");
    var checkoutButton = document.getElementById("checkoutButton");
    var clearCartButton = document.getElementById("clearCartButton");
    var cartSummary = document.getElementById("cartSummary");
    var items = getCartDetails();
    var subtotal = items.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
    var shipping = items.length ? SHIPPING_ESTIMATE : 0;
    var total = subtotal + shipping;

    if (!items.length) {
      cartContent.innerHTML = '<div class="empty-state fade-in is-visible"><h2>Keranjang Anda masih kosong</h2><p>Tambahkan ikan, peralatan, atau dekorasi favorit Anda untuk memulai checkout.</p><a class="button button-primary" href="produk.html">Belanja Sekarang</a></div>';
      if (cartSummary) cartSummary.style.opacity = "0.6";
      if (checkoutButton) {
        checkoutButton.href = "#";
        checkoutButton.setAttribute("aria-disabled", "true");
      }
    } else {
      cartContent.innerHTML = '<div class="cart-stack">' + items.map(function (item) {
        return '<article class="cart-item fade-in is-visible"><img class="cart-item-image" src="' + item.image + '" alt="' + item.name + '"><div><h3 class="cart-item-title">' + item.name + '</h3><p class="cart-item-meta">' + formatCurrency(item.price) + ' per item</p><div class="cart-item-controls"><div class="qty-stepper"><button type="button" data-qty-change="' + item.id + '" data-direction="-1">-</button><input type="number" min="1" value="' + item.qty + '" data-qty-input="' + item.id + '"><button type="button" data-qty-change="' + item.id + '" data-direction="1">+</button></div><strong>' + formatCurrency(item.subtotal) + '</strong><button class="remove-button" type="button" data-remove-item="' + item.id + '">Hapus</button></div></div></article>';
      }).join("") + '</div>';
      if (cartSummary) cartSummary.style.opacity = "1";
      if (checkoutButton) {
        checkoutButton.href = generateWhatsAppLink(items, total);
        checkoutButton.target = "_blank";
        checkoutButton.rel = "noopener noreferrer";
        checkoutButton.removeAttribute("aria-disabled");
      }
    }

    if (subtotalValue) subtotalValue.textContent = formatCurrency(subtotal);
    if (shippingValue) shippingValue.textContent = formatCurrency(shipping);
    if (totalValue) totalValue.textContent = formatCurrency(total);
    if (clearCartButton) {
      clearCartButton.onclick = clearCart;
      clearCartButton.disabled = !items.length;
    }

    document.querySelectorAll("[data-qty-change]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = Number(button.getAttribute("data-qty-change"));
        var direction = Number(button.getAttribute("data-direction"));
        var currentItem = getCart().find(function (entry) { return entry.id === id; });
        if (!currentItem) return;
        updateQty(id, currentItem.qty + direction);
      });
    });

    document.querySelectorAll("[data-qty-input]").forEach(function (input) {
      input.addEventListener("change", function () {
        updateQty(Number(input.getAttribute("data-qty-input")), Number(input.value) || 1);
      });
    });

    document.querySelectorAll("[data-remove-item]").forEach(function (button) {
      button.addEventListener("click", function () {
        removeFromCart(Number(button.getAttribute("data-remove-item")));
      });
    });
  }

  window.CartUI = {
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQty: updateQty,
    getCart: getCart,
    clearCart: clearCart,
    createProductCard: createProductCard,
    bindAddToCartButtons: bindAddToCartButtons,
    formatCurrency: formatCurrency,
    getProductsData: getProducts
  };

  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQty = updateQty;
  window.getCart = getCart;
  window.clearCart = clearCart;

  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    renderCartPage();
  });
})();
