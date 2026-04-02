(function () {
  var siteHeader = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navPanel = document.getElementById("navPanel");

  function handleHeaderShadow() {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  function setActiveNav() {
    var page = document.body.getAttribute("data-page");
    var linkMap = { home: "index.html", produk: "produk.html", jasa: "jasa.html", keranjang: "keranjang.html" };
    var currentHref = linkMap[page];
    if (!currentHref) return;
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      if (link.getAttribute("href") === currentHref) link.classList.add("active");
    });
  }

  function initMobileMenu() {
    if (!navToggle || !navPanel) return;
    navToggle.addEventListener("click", function () {
      var isOpen = navPanel.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navPanel.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initFadeIn() {
    var items = document.querySelectorAll(".fade-in");
    if (!items.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function renderFeaturedProducts() {
    var featuredRoot = document.getElementById("featuredProducts");
    if (!featuredRoot || !window.CartUI) return;
    featuredRoot.innerHTML = window.CartUI.getProductsData().slice(0, 6).map(function (product) {
      return window.CartUI.createProductCard(product);
    }).join("");
    window.CartUI.bindAddToCartButtons(featuredRoot);
  }

  window.addEventListener("scroll", handleHeaderShadow);
  handleHeaderShadow();
  setActiveNav();
  initMobileMenu();
  initFadeIn();
  renderFeaturedProducts();
  if (window.Auth && window.Auth.updateNavForAuth) {
    window.Auth.updateNavForAuth();
  }
})();
