function initPlayer(mediaUrl) {
    var video = document.getElementById('movie-video');
    var layer = document.getElementById('play-layer');
    var hls = null;
    var ready = false;

    if (!video || !mediaUrl) {
        return;
    }

    function safePlay() {
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function() {
                if (layer) {
                    layer.classList.remove('is-hidden');
                }
            });
        }
    }

    function prepare() {
        if (ready) {
            safePlay();
            return;
        }
        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = mediaUrl;
            video.addEventListener('loadedmetadata', safePlay, { once: true });
            video.load();
            safePlay();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, function() {
                hls.loadSource(mediaUrl);
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                safePlay();
            });
            return;
        }

        video.src = mediaUrl;
        video.load();
        safePlay();
    }

    function start() {
        if (layer) {
            layer.classList.add('is-hidden');
        }
        prepare();
    }

    if (layer) {
        layer.addEventListener('click', start);
    }

    video.addEventListener('click', function() {
        if (!ready) {
            start();
        }
    });

    window.addEventListener('beforeunload', function() {
        if (hls) {
            hls.destroy();
        }
    });
}
