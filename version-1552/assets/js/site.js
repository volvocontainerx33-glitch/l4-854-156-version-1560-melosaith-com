document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initHeroSlider();
  initFilters();
  initImageFallbacks();
  initSearchPage();
});

function initMobileMenu() {
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    menu.classList.toggle("is-open");
  });
}

function initHeroSlider() {
  var slider = document.querySelector(".js-hero-slider");

  if (!slider) {
    return;
  }

  var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
  var prev = slider.querySelector("[data-hero-prev]");
  var next = slider.querySelector("[data-hero-next]");
  var current = 0;
  var timer = null;

  function show(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      show(Number(dot.getAttribute("data-hero-dot")) || 0);
      start();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      show(current - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      show(current + 1);
      start();
    });
  }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  show(0);
  start();
}

function initFilters() {
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function (panel) {
    var section = panel.closest("section") || document;
    var scope = section.querySelector("[data-filter-scope]");

    if (!scope) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search]"));
    var input = panel.querySelector(".js-filter-input");
    var selects = Array.prototype.slice.call(panel.querySelectorAll(".js-filter-select"));
    var count = panel.querySelector(".js-result-count");

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selected = {};

      selects.forEach(function (select) {
        selected[select.getAttribute("data-filter")] = select.value;
      });

      var visible = 0;

      cards.forEach(function (card) {
        var haystack = card.getAttribute("data-search") || "";
        var ok = !query || haystack.indexOf(query) !== -1;

        Object.keys(selected).forEach(function (key) {
          if (selected[key] && card.getAttribute("data-" + key) !== selected[key]) {
            ok = false;
          }
        });

        card.classList.toggle("is-hidden", !ok);

        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    selects.forEach(function (select) {
      select.addEventListener("change", apply);
    });

    apply();
  });
}

function initImageFallbacks() {
  var images = Array.prototype.slice.call(document.querySelectorAll("img[data-fallback-title]"));

  images.forEach(function (img) {
    img.addEventListener("error", function () {
      var parent = img.parentElement;

      if (parent) {
        parent.classList.add("is-missing");
        parent.setAttribute("data-title", img.getAttribute("data-fallback-title") || img.alt || "影片封面");
      }
    }, { once: true });
  });
}

function initSearchPage() {
  if (!window.MOVIE_SEARCH_DATA) {
    return;
  }

  var input = document.getElementById("site-search-input");
  var button = document.getElementById("site-search-button");
  var results = document.getElementById("search-results");

  if (!input || !results) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get("q") || "";

  input.value = initialQuery;

  function render() {
    var query = input.value.trim().toLowerCase();
    var pool = window.MOVIE_SEARCH_DATA;
    var matched = pool.filter(function (movie) {
      var text = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        (movie.tags || []).join(" "),
        movie.description
      ].join(" ").toLowerCase();

      return !query || text.indexOf(query) !== -1;
    }).slice(0, 80);

    if (!matched.length) {
      results.innerHTML = "<p class=\"search-hint\">没有找到匹配影片，请换一个关键词。</p>";
      return;
    }

    results.innerHTML = matched.map(function (movie) {
      return [
        "<article class=\"search-result-card\">",
        "  <a href=\"" + movie.url + "\">",
        "    <figure data-title=\"" + escapeHtml(movie.title) + "\">",
        "      <img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\" data-fallback-title=\"" + escapeHtml(movie.title) + "\">",
        "    </figure>",
        "  </a>",
        "  <div>",
        "    <h2><a href=\"" + movie.url + "\">" + escapeHtml(movie.title) + "</a></h2>",
        "    <p>" + escapeHtml(movie.description) + "</p>",
        "    <span>" + escapeHtml(movie.year) + " · " + escapeHtml(movie.region) + " · " + escapeHtml(movie.genre) + " · " + escapeHtml(movie.rating) + " 分</span>",
        "  </div>",
        "</article>"
      ].join("");
    }).join("");

    initImageFallbacks();
  }

  if (button) {
    button.addEventListener("click", render);
  }

  input.addEventListener("input", render);
  render();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
