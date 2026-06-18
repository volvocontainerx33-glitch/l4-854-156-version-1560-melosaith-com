(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-nav-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var tabs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-tab]'));
        var current = 0;
        var timer = null;

        function activate(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            tabs.forEach(function (tab, tabIndex) {
                tab.classList.toggle('is-active', tabIndex === index);
            });
            if (slides[index]) {
                hero.style.setProperty('--hero-image', 'url("' + slides[index].getAttribute('data-hero-image') + '")');
            }
        }

        function start() {
            timer = window.setInterval(function () {
                activate((current + 1) % slides.length);
            }, 5200);
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                activate(index);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    var searchInput = document.querySelector('[data-page-search]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var filterGrid = document.querySelector('[data-filter-grid]');

    if (filterGrid && (searchInput || yearFilter)) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('[data-card]'));

        function filterCards() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var year = yearFilter ? yearFilter.value : '';
            cards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchYear = !year || text.indexOf(year) !== -1;
                card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterCards);
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', filterCards);
        }
    }
})();
