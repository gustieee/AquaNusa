(function () {
  function flyToCart(triggerElement) {
    var cartIcon = document.querySelector(".cart-icon-wrapper");
    if (!cartIcon) return;

    var productCard = triggerElement.closest(".product-card");
    var productImg = productCard ? productCard.querySelector("img") : null;
    var cartRect = cartIcon.getBoundingClientRect();
    var startRect = triggerElement.getBoundingClientRect();

    var fly = document.createElement("div");
    fly.style.cssText = [
      "position:fixed",
      "z-index:9999",
      "width:60px",
      "height:60px",
      "border-radius:50%",
      "overflow:hidden",
      "border:2px solid var(--color-primary)",
      "box-shadow:0 0 16px var(--color-primary-glow)",
      "pointer-events:none",
      "left:" + (startRect.left + startRect.width / 2 - 30) + "px",
      "top:" + (startRect.top + startRect.height / 2 - 30) + "px",
      "transition:none"
    ].join(";");

    if (productImg) {
      var img = document.createElement("img");
      img.src = productImg.src;
      img.alt = "";
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      fly.appendChild(img);
    } else {
      fly.style.background = "var(--color-primary)";
    }

    document.body.appendChild(fly);

    var targetX = cartRect.left + cartRect.width / 2 - 30;
    var targetY = cartRect.top + cartRect.height / 2 - 30;
    var startX = parseFloat(fly.style.left);
    var startY = parseFloat(fly.style.top);
    var duration = 700;
    var startTime = performance.now();

    function animate(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      var arc = Math.sin(progress * Math.PI) * -80;
      var x = startX + (targetX - startX) * ease;
      var y = startY + (targetY - startY) * ease + arc;
      var scale = 1 - progress * 0.6;
      var opacity = progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1;

      fly.style.transform = "scale(" + scale + ")";
      fly.style.left = x + "px";
      fly.style.top = y + "px";
      fly.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        fly.remove();
        cartBounce();
        cartBadgePop();
      }
    }

    requestAnimationFrame(animate);
  }

  function cartBounce() {
    var cartIcon = document.querySelector(".cart-icon-wrapper");
    if (!cartIcon) return;

    cartIcon.style.transition = "transform 0.15s ease";
    cartIcon.style.transform = "scale(1.4)";
    cartIcon.style.filter = "drop-shadow(0 0 8px var(--color-primary))";

    setTimeout(function () {
      cartIcon.style.transform = "scale(0.9)";
      setTimeout(function () {
        cartIcon.style.transform = "scale(1)";
        cartIcon.style.filter = "none";
      }, 150);
    }, 150);
  }

  function cartBadgePop() {
    var badge = document.querySelector(".cart-badge");
    if (!badge) return;
    badge.classList.remove("popping");
    void badge.offsetWidth;
    badge.classList.add("popping");
    badge.addEventListener("animationend", function () {
      badge.classList.remove("popping");
    }, { once: true });
  }

  function buttonFeedback(btn) {
    var originalText = btn.textContent;
    btn.classList.add("btn-added");
    btn.textContent = "\u2713 Ditambahkan!";
    btn.disabled = true;

    setTimeout(function () {
      btn.classList.remove("btn-added");
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  }

  function createRipple(btn, event) {
    var pointer = event.touches && event.touches[0] ? event.touches[0] : event;
    var rect = btn.getBoundingClientRect();
    var circle = document.createElement("span");
    circle.classList.add("ripple-circle");
    circle.style.left = (pointer.clientX - rect.left) + "px";
    circle.style.top = (pointer.clientY - rect.top) + "px";
    btn.appendChild(circle);
    circle.addEventListener("animationend", function () { circle.remove(); });
  }

  function particleBurst(triggerElement) {
    var rect = triggerElement.getBoundingClientRect();
    var colors = ["#00d4ff", "#00e5a0", "#ff6b35"];
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    for (var i = 0; i < 8; i += 1) {
      var particle = document.createElement("div");
      var angle = (i / 8) * Math.PI * 2;
      var distance = 40 + Math.random() * 20;
      var color = colors[i % colors.length];

      particle.style.cssText = [
        "position:fixed",
        "z-index:9998",
        "width:6px",
        "height:6px",
        "border-radius:50%",
        "background:" + color,
        "box-shadow:0 0 6px " + color,
        "left:" + (cx - 3) + "px",
        "top:" + (cy - 3) + "px",
        "pointer-events:none",
        "transition:all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "opacity:1"
      ].join(";");

      document.body.appendChild(particle);

      (function (node, targetX, targetY) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            node.style.left = targetX + "px";
            node.style.top = targetY + "px";
            node.style.opacity = "0";
            node.style.transform = "scale(0)";
          });
        });
      }(particle, cx + Math.cos(angle) * distance - 3, cy + Math.sin(angle) * distance - 3));

      setTimeout(function (nodeRef) {
        nodeRef.remove();
      }.bind(null, particle), 500);
    }
  }

  window.CartAnimation = {
    flyToCart: flyToCart,
    cartBounce: cartBounce,
    cartBadgePop: cartBadgePop,
    buttonFeedback: buttonFeedback,
    createRipple: createRipple,
    particleBurst: particleBurst
  };
})();
