(function () {
    var input = document.getElementById('search-page-input');
    var results = document.getElementById('search-results');
    var summary = document.getElementById('search-summary');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (!input || !results || !summary || !window.movieIndex) {
        return;
    }

    input.value = query;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function card(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a class="movie-poster" href="' + escapeHtml(movie.url) + '">' +
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="poster-shade"></span>' +
            '<span class="type-badge">' + escapeHtml(movie.type) + '</span>' +
            '<span class="play-chip">▶</span>' +
            '</a>' +
            '<div class="movie-card-body">' +
            '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span></div>' +
            '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
            '<p>' + escapeHtml(movie.oneLine) + '</p>' +
            '<div class="tag-row">' + tags + '</div>' +
            '</div>' +
            '</article>';
    }

    function render(value) {
        var keyword = value.trim().toLowerCase();
        var list = window.movieIndex;
        if (keyword) {
            list = list.filter(function (movie) {
                return [
                    movie.title,
                    movie.region,
                    movie.type,
                    movie.year,
                    movie.genre,
                    movie.oneLine,
                    movie.tags.join(' ')
                ].join(' ').toLowerCase().indexOf(keyword) !== -1;
            });
        }
        list = list.slice(0, 120);
        summary.textContent = keyword ? '找到 ' + list.length + ' 条相关结果' : '默认展示前 120 部影片，可输入关键词继续检索';
        results.innerHTML = list.map(card).join('');
    }

    input.addEventListener('input', function () {
        render(input.value);
    });

    render(query);
})();
