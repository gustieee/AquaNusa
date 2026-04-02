(function () {
  if (window.Auth && window.Auth.requireAuth) {
    window.Auth.requireAuth("admin");
  }
})();
