(function() {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = $('.nav-toggle');
    var nav = $('.site-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('is-open');
        });
    }

    $all('[data-carousel]').forEach(function(carousel) {
        var slides = $all('.hero-slide', carousel);
        var dots = $all('.hero-dot', carousel);
        var prev = $('.hero-prev', carousel);
        var next = $('.hero-next', carousel);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function move(step) {
            show(index + step);
            start();
        }

        function start() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function() {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function() {
                move(-1);
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                move(1);
            });
        }
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                show(i);
                start();
            });
        });
        show(0);
        start();
    });

    $all('.filter-scope').forEach(function(scope) {
        var cards = $all('.movie-card', scope);
        var query = $('[data-filter="query"]', scope);
        var year = $('[data-filter="year"]', scope);
        var type = $('[data-filter="type"]', scope);
        var region = $('[data-filter="region"]', scope);
        var empty = $('.empty-state', scope);

        function fillSelect(select, attr) {
            if (!select) {
                return;
            }
            var values = [];
            cards.forEach(function(card) {
                var value = card.getAttribute(attr) || '';
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            values.sort(function(a, b) {
                return b.localeCompare(a, 'zh-Hans-CN');
            });
            values.forEach(function(value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function apply() {
            var q = normalize(query && query.value);
            var y = normalize(year && year.value);
            var t = normalize(type && type.value);
            var r = normalize(region && region.value);
            var visible = 0;

            cards.forEach(function(card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type')
                ].join(' '));
                var ok = true;
                if (q && haystack.indexOf(q) === -1) {
                    ok = false;
                }
                if (y && normalize(card.getAttribute('data-year')) !== y) {
                    ok = false;
                }
                if (t && normalize(card.getAttribute('data-type')) !== t) {
                    ok = false;
                }
                if (r && normalize(card.getAttribute('data-region')) !== r) {
                    ok = false;
                }
                card.classList.toggle('is-hidden', !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        fillSelect(year, 'data-year');
        fillSelect(type, 'data-type');
        fillSelect(region, 'data-region');

        [query, year, type, region].forEach(function(control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    });
})();
