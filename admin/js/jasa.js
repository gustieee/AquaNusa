document.addEventListener("DOMContentLoaded", function () {
  var services = (window.AppData && window.AppData.services) || [];
  var tbody = document.getElementById("services-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  services.forEach(function (s, i) {
    tbody.innerHTML += "<tr>" +
      "<td>" + (i + 1) + "</td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.description + "</td>" +
      "</tr>";
  });
});
