(function () {
  var SESSION_KEY = "aqua_session";

  function getUsers() {
    return (window.AppData && window.AppData.users) || [];
  }

  function saveSession(user) {
    var session = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      avatar: user.avatar || ""
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function login(email, password) {
    var user = getUsers().find(function (item) {
      return item.email === email && item.password === password;
    });
    if (!user) {
      return { success: false };
    }
    var session = saveSession(user);
    return { success: true, role: user.role, user: session };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }

  function requireAuth(requiredRole) {
    var session = getSession();
    if (!session) {
      window.location.href = "login.html";
      return;
    }
    if (requiredRole && session.role !== requiredRole) {
      window.location.href = session.role === "admin" ? "admin/dashboard.html" : "index.html";
    }
  }

  function updateNavForAuth() {
    var navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    var existing = navLinks.querySelector(".nav-auth");
    if (existing) existing.remove();

    var session = getSession();
    var authWrap = document.createElement("div");
    authWrap.className = "nav-auth";

    if (!session) {
      var loginLink = document.createElement("a");
      loginLink.href = "login.html";
      loginLink.textContent = "Login";
      authWrap.appendChild(loginLink);
    } else {
      var nameSpan = document.createElement("span");
      nameSpan.className = "nav-user";
      nameSpan.textContent = session.name;

      var logoutBtn = document.createElement("button");
      logoutBtn.type = "button";
      logoutBtn.className = "nav-logout";
      logoutBtn.textContent = "Keluar";
      logoutBtn.addEventListener("click", logout);

      authWrap.appendChild(nameSpan);
      authWrap.appendChild(logoutBtn);
    }

    navLinks.appendChild(authWrap);
  }

  window.Auth = {
    login: login,
    logout: logout,
    getSession: getSession,
    requireAuth: requireAuth,
    updateNavForAuth: updateNavForAuth
  };
})();
