(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initImages() {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.classList.add("is-unavailable");
            });
        });
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var links = document.querySelector(".nav-links");
        if (!button || !links) {
            return;
        }
        button.addEventListener("click", function () {
            var open = links.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function schedule() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot") || 0));
                schedule();
            });
        });
        schedule();
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initFilters() {
        document.querySelectorAll("[data-filter-form]").forEach(function (form) {
            var scope = form.parentElement || document;
            var list = scope.querySelector("[data-filter-list]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            var empty = scope.querySelector("[data-empty-state]");
            var search = form.querySelector(".js-search");
            var region = form.querySelector(".js-region");
            var type = form.querySelector(".js-type");
            function apply() {
                var q = normalize(search && search.value);
                var r = normalize(region && region.value);
                var t = normalize(type && type.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" "));
                    var matchQuery = !q || haystack.indexOf(q) !== -1;
                    var matchRegion = !r || normalize(card.getAttribute("data-region")).indexOf(r) !== -1;
                    var matchType = !t || normalize(card.getAttribute("data-type")).indexOf(t) !== -1;
                    var show = matchQuery && matchRegion && matchType;
                    card.hidden = !show;
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            form.addEventListener("input", apply);
            form.addEventListener("change", apply);
            form.addEventListener("reset", function () {
                window.setTimeout(apply, 0);
            });
            apply();
        });
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video");
            var overlay = player.querySelector(".player-overlay");
            var source = player.getAttribute("data-stream");
            var started = false;
            if (!video || !source) {
                return;
            }
            function start() {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                if (started) {
                    video.play().catch(function () {});
                    return;
                }
                started = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    video.play().catch(function () {});
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    return;
                }
                video.src = source;
                video.play().catch(function () {});
            }
            if (overlay) {
                overlay.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (!started) {
                    start();
                }
            });
        });
    }

    ready(function () {
        initImages();
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
