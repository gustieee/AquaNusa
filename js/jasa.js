(function () {
  var serviceGrid = document.getElementById("serviceGrid");
  if (!serviceGrid || !window.AppData) return;
  var whatsappNumber = "6285894980615";
  serviceGrid.innerHTML = window.AppData.services.map(function (service) {
    var link = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(service.waMessage);
    return '<article class="service-card fade-in is-visible"><div class="service-icon">' + service.icon + '</div><h3>' + service.name + '</h3><p>' + service.description + '</p><div class="service-price">' + service.price + '</div><a class="button button-primary" href="' + link + '" target="_blank" rel="noopener noreferrer">Hubungi Kami</a></article>';
  }).join("");
})();
