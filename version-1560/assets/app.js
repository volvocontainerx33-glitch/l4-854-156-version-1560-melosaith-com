(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function initLocalFilter() {
    var input = document.querySelector(".local-filter-input");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] .movie-card"));
    var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));
    if (!cards.length) {
      return;
    }
    var active = "all";
    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var genre = card.getAttribute("data-genre") || "";
        var matchText = !keyword || text.indexOf(keyword) > -1;
        var matchGenre = active === "all" || genre.indexOf(active) > -1 || text.indexOf(active.toLowerCase()) > -1;
        card.style.display = matchText && matchGenre ? "" : "none";
      });
    }
    if (input) {
      input.addEventListener("input", apply);
    }
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        active = pill.getAttribute("data-filter") || "all";
        pills.forEach(function (item) {
          item.classList.toggle("is-active", item === pill);
        });
        apply();
      });
    });
  }

  function cardMarkup(movie) {
    return [
      '<a class="movie-card" href="' + movie.url + '">',
      '<div class="poster-wrap">',
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="card-badge">' + escapeHtml(movie.category) + '</span>',
      '<span class="card-year">' + escapeHtml(movie.year) + '</span>',
      '<span class="play-hover">▶</span>',
      '</div>',
      '<div class="movie-card-body">',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="card-meta">' + escapeHtml(movie.region + ' · ' + movie.type + ' · ' + movie.genre) + '</div>',
      '</div>',
      '</a>'
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initSearchPage() {
    var result = document.getElementById("searchResults");
    var status = document.getElementById("searchStatus");
    var input = document.getElementById("searchInput");
    if (!result || !window.MOVIE_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input) {
      input.value = initial;
    }
    function render(keyword) {
      var q = String(keyword || "").trim().toLowerCase();
      var list = window.MOVIE_INDEX.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.category].join(" ").toLowerCase();
        return !q || text.indexOf(q) > -1;
      }).slice(0, 120);
      result.innerHTML = list.map(cardMarkup).join("");
      if (status) {
        status.textContent = q ? "搜索结果" : "推荐影片";
      }
    }
    render(initial);
    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
  }

  function initMoviePlayer(sourceUrl) {
    var video = document.getElementById("moviePlayer");
    var cover = document.getElementById("playerCover");
    if (!video || !sourceUrl) {
      return;
    }
    var loaded = false;
    var hlsInstance = null;
    function load() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(sourceUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = sourceUrl;
        }
        loaded = true;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }
    if (cover) {
      cover.addEventListener("click", load);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        load();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initLocalFilter();
    initSearchPage();
  });

  window.initMoviePlayer = initMoviePlayer;
})();
