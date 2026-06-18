(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll("[data-site-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      const target = query ? "./search.html?q=" + encodeURIComponent(query) : "./search.html";
      window.location.href = target;
    });
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.querySelector(".hero-prev");
  const next = document.querySelector(".hero-next");
  let active = 0;
  let timer = null;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle("is-active", itemIndex === active);
    });
    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle("is-active", itemIndex === active);
    });
  }

  function restart() {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        setSlide(active + 1);
      }, 5600);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        setSlide(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        setSlide(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        setSlide(active + 1);
        restart();
      });
    }

    restart();
  }
})();
