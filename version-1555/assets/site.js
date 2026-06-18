(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function openMobileMenu() {
    var button = qs('[data-menu-button]');
    var panel = qs('[data-mobile-menu]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = qsa('[data-hero-slide]');
    var thumbs = qsa('[data-hero-thumb]');
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('is-active', i === active);
      });
    }
    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('mouseenter', function () {
        show(index);
      });
      thumb.addEventListener('focus', function () {
        show(index);
      });
    });
    timer = window.setInterval(function () {
      show(active + 1);
    }, 5200);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }
    });
    show(0);
  }

  function renderSearchResult(item) {
    return '<a href="./' + item.file + '">' +
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
      '<span><strong>' + escapeHtml(item.title) + '</strong>' +
      '<small>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</small></span></a>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function setupSiteSearch() {
    var inputs = qsa('[data-site-search]');
    if (!inputs.length || !window.siteMovies) {
      return;
    }
    inputs.forEach(function (input) {
      var box = input.closest('[data-search-box]');
      var result = box ? qs('[data-search-results]', box) : null;
      if (!result) {
        return;
      }
      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        if (!keyword) {
          result.classList.remove('is-open');
          result.innerHTML = '';
          return;
        }
        var matches = window.siteMovies.filter(function (item) {
          return item.search.indexOf(keyword) !== -1;
        }).slice(0, 10);
        result.innerHTML = matches.map(renderSearchResult).join('');
        result.classList.toggle('is-open', matches.length > 0);
      });
      document.addEventListener('click', function (event) {
        if (!box.contains(event.target)) {
          result.classList.remove('is-open');
        }
      });
    });
  }

  function setupFilters() {
    var filterBlocks = qsa('[data-filter-root]');
    filterBlocks.forEach(function (root) {
      var input = qs('[data-filter-input]', root);
      var year = qs('[data-filter-year]', root);
      var type = qs('[data-filter-type]', root);
      var cards = qsa('[data-card]', root);
      var empty = qs('[data-empty]', root);
      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = [card.dataset.title, card.dataset.tags, card.dataset.year, card.dataset.type].join(' ').toLowerCase();
          var ok = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            ok = false;
          }
          if (yearValue && card.dataset.year !== yearValue) {
            ok = false;
          }
          if (typeValue && card.dataset.type !== typeValue) {
            ok = false;
          }
          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      }
      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  window.initMoviePlayer = function (videoId, buttonId, posterId, playbackUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var poster = document.getElementById(posterId);
    if (!video || !button || !poster || !playbackUrl) {
      return;
    }
    var ready = false;
    var hls = null;
    function attach() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playbackUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(playbackUrl);
        hls.attachMedia(video);
      } else {
        video.src = playbackUrl;
      }
    }
    function play() {
      attach();
      poster.classList.add('is-hidden');
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }
    button.addEventListener('click', play);
    poster.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    openMobileMenu();
    setupHero();
    setupSiteSearch();
    setupFilters();
  });
})();
