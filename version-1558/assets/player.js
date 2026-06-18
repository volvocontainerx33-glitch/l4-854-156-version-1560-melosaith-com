(function () {
    var video = document.getElementById('movie-video');
    var button = document.getElementById('movie-play-button');
    var shell = video ? video.closest('.video-shell') : null;
    var source = window.movieStream;
    var hlsInstance = null;

    if (!video || !source) {
        return;
    }

    function loadSource() {
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        }
    }

    function playVideo() {
        loadSourceOnce();
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    function loadSourceOnce() {
        if (!video.getAttribute('data-loaded')) {
            loadSource();
            video.setAttribute('data-loaded', 'true');
        }
    }

    video.addEventListener('play', function () {
        if (shell) {
            shell.classList.add('is-playing');
        }
    });

    video.addEventListener('pause', function () {
        if (shell && video.currentTime === 0) {
            shell.classList.remove('is-playing');
        }
    });

    video.addEventListener('click', function () {
        loadSourceOnce();
    });

    if (button) {
        button.addEventListener('click', playVideo);
    }

    loadSource();
    video.setAttribute('data-loaded', 'true');

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
